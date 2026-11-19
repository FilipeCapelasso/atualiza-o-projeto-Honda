// Edge Function: honda-sync
// Coletor nacional das tabelas do Consórcio Nacional Honda (27 UFs), feito pelo servidor (nunca pelo navegador).
// Quem chama: o banco (cron honda_passo / honda_agendar / botão "ATUALIZAR TABELAS AGORA"), com o cabeçalho x-cron-token.
// A cada chamada pega estados da fila (honda_sync_queue) até ~100 s, consulta a fonte e entrega o JSON original ao banco
// (honda_gravar_uf), que valida, normaliza, compara com o anterior e registra o histórico. Falha = nada é apagado.
//
// Hosts: o banco manda a lista em `bases` (plataforma_config.honda_base e honda_base_alt). O coletor tenta na ordem e
// usa o primeiro que responder — o segundo host oficial (hondaservicosfinanceiros.com.br) serve o mesmo JSON.
// Isso cobre falha de um host (DNS, certificado, regra de WAF daquele host) e bloqueio do nosso IP em um deles.
// Não cobre queda geral da Honda: nesse caso a execução é cancelada na sonda e as tabelas guardadas continuam valendo.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Endpoints centralizados: se a Honda mudar a API, altere só aqui (as bases ficam em plataforma_config).
export const ROTAS = {
  planos: () => '/api/site/consorcio/planos',
  categorias: (uf: string) => `/api/veiculos/categorias/list/${uf}/motos`,
  lista: (uf: string) => `/api/veiculos/list/${uf}/motos`,
  detalhe: (uf: string, slug: string) => `/api/veiculo/plans/${uf}/${encodeURIComponent(slug)}`,
};
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; CatalogoStarMotos/1.0)', Accept: 'application/json' };
const LIMITE_MS = 100_000;      // tempo de trabalho por chamada
const CONCORRENCIA = 3;         // pedidos simultâneos à Honda
const TIMEOUT_MS = 20_000;
const TENTATIVAS = 3;
const J = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json' } });
const dorme = (ms: number) => new Promise((r) => setTimeout(r, ms));
// resumo legível de uma página de erro (ex.: "Web Site Not Found"), sem CSS/HTML
const limpa = (t: string) => t.replace(/<(style|script)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);

type Resp = { ok: boolean; status: number; data?: any; corpo?: string; erro?: string; url: string; ms: number };

export async function getJson(url: string): Promise<Resp> {
  let ult: Resp = { ok: false, status: 0, url, ms: 0, erro: 'sem tentativa' };
  for (let i = 0; i < TENTATIVAS; i++) {
    const t0 = Date.now(), ac = new AbortController(), tm = setTimeout(() => ac.abort(), TIMEOUT_MS);
    try {
      const r = await fetch(url, { headers: UA, signal: ac.signal });
      const txt = await r.text();
      clearTimeout(tm);
      if (r.ok) {
        try { return { ok: true, status: r.status, data: JSON.parse(txt), url, ms: Date.now() - t0 }; }
        catch (_) { ult = { ok: false, status: r.status, corpo: limpa(txt), erro: 'resposta não é JSON', url, ms: Date.now() - t0 }; return ult; }
      }
      ult = { ok: false, status: r.status, corpo: limpa(txt), url, ms: Date.now() - t0 };
      if (r.status < 500 && r.status !== 429 && r.status !== 408) return ult;      // 4xx (exceto 408/429): não adianta repetir
    } catch (e) {
      clearTimeout(tm);
      ult = { ok: false, status: 0, erro: (e as Error)?.name === 'AbortError' ? 'tempo esgotado' : String((e as Error)?.message || e), url, ms: Date.now() - t0 };
    }
    if (i < TENTATIVAS - 1) await dorme(1500 * 2 ** i + Math.floor(Math.random() * 400));   // backoff: ~1,5 s, ~3 s
  }
  return ult;
}

export async function emLotes<T, R>(itens: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(itens.length); let k = 0;
  await Promise.all(Array.from({ length: Math.min(n, itens.length) }, async () => {
    while (k < itens.length) { const i = k++; out[i] = await fn(itens[i]); }
  }));
  return out;
}

// Aceita os dois formatos conhecidos: { vehicles: [ {label, vehicles:[...]} ] } (categorias) e { vehicles: [ {...} ] } (lista simples)
export function achatar(d: any): { categoria: string | null; item: any }[] {
  const raiz = Array.isArray(d?.vehicles) ? d.vehicles : Array.isArray(d?.categories) ? d.categories : Array.isArray(d) ? d : null;
  if (!raiz) return [];
  const out: { categoria: string | null; item: any }[] = [];
  for (const x of raiz) {
    if (x && Array.isArray(x.vehicles)) for (const v of x.vehicles) out.push({ categoria: x.label ?? x.name ?? null, item: v });
    else if (x && typeof x === 'object') out.push({ categoria: x.category ?? null, item: x });
  }
  return out.filter((o) => o.item && typeof o.item.slug === 'string' && o.item.slug.trim());
}

// Lista de hosts sem repetição e sem barra no fim.
export function normalizarBases(bases: unknown, base: unknown): string[] {
  const brutas = Array.isArray(bases) && bases.length ? bases : [base];
  const out: string[] = [];
  for (const b of brutas) {
    if (typeof b !== 'string' || !b.trim()) continue;
    const u = b.trim().replace(/\/+$/, '');
    if (!out.includes(u)) out.push(u);
  }
  return out;
}

// Confere se a fonte está no ar. Tenta cada host da lista e devolve o primeiro que responder.
async function sondar(bases: string[], uf: string) {
  const falhas: string[] = [];
  let ultimo = 0;
  for (const base of bases) {
    const p = await getJson(base + ROTAS.planos());
    ultimo = p.status;
    if (p.ok && p.data && typeof p.data === 'object') {
      return { ok: true, base, info: { http: p.status, url_planos: p.url, planos_raw: p.data, rota_planos_ok: true, base_usada: base, ...(falhas.length ? { hosts_que_falharam: falhas } : {}) } };
    }
    for (const rota of [ROTAS.categorias(uf), ROTAS.lista(uf)]) {          // a rota de planos pode ter mudado e as outras não
      const l = await getJson(base + rota);
      if (l.ok && achatar(l.data).length) {
        return { ok: true, base, info: { http: l.status, rota_planos_ok: false, base_usada: base, detalhe: `planos: HTTP ${p.status} ${p.erro || ''}`.trim(), ...(falhas.length ? { hosts_que_falharam: falhas } : {}) } };
      }
    }
    falhas.push(`${base}: HTTP ${p.status}${p.erro ? ' ' + p.erro : ''}`.slice(0, 150));
  }
  return { ok: false, base: bases[0], info: { http: ultimo, detalhe: falhas.join(' | ').slice(0, 300), hosts_que_falharam: falhas } };
}

async function coletarUf(bases: string[], uf: string) {
  let lista: Resp | null = null, rota = '', base = bases[0];
  for (const b of bases) {                                                 // se um host falhar, tenta o seguinte
    for (const [nome, r] of [['categorias', ROTAS.categorias(uf)], ['lista', ROTAS.lista(uf)]] as const) {
      const x = await getJson(b + r);
      if (x.ok && achatar(x.data).length) { lista = x; rota = nome; base = b; break; }
      if (!lista || !lista.ok) lista = x;
    }
    if (rota) break;
  }
  if (!lista || !lista.ok || !rota) return { erro: lista?.ok ? 'a lista de motos veio vazia ou num formato desconhecido' : `lista de motos indisponível (HTTP ${lista?.status ?? '-'}${lista?.erro ? ', ' + lista.erro : ''})`, p: { rota_lista: null, url_lista: lista?.url } };
  const itens = achatar(lista.data), vistos = new Set<string>();
  const unicos = itens.filter((o) => (vistos.has(o.item.slug) ? false : (vistos.add(o.item.slug), true)));
  const veiculos = await emLotes(unicos, CONCORRENCIA, async (o) => {
    const d = await getJson(base + ROTAS.detalhe(uf, o.item.slug));
    let detalhe = null, erro = null;
    if (!d.ok) erro = `HTTP ${d.status}${d.erro || d.corpo ? ': ' + (d.erro || d.corpo) : ''}`.slice(0, 200);
    else if (d.data && d.data.status === 'Error') erro = String(d.data.message || 'veículo não encontrado na Honda').slice(0, 200);
    else detalhe = d.data;
    return { slug: o.item.slug, categoria: o.categoria, item: o.item, detalhe, erro, url: d.url, http: d.status };
  });
  return { base, p: { rota_lista: rota, url_lista: lista.url, lista_raw: lista.data, veiculos } };
}

Deno.serve(async (req) => {
  const t0 = Date.now();
  try {
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const tok = req.headers.get('x-cron-token');
    const { data: seg } = await db.from('segredos').select('valor').eq('chave', 'honda_sync_token').maybeSingle();
    if (!tok || !seg || seg.valor !== tok) return J({ erro: 'Chave inválida.' }, 401);
    const feitos: unknown[] = [];
    let baseOk: string | null = null;                      // host que respondeu nesta chamada: vai primeiro nas próximas UFs
    while (Date.now() - t0 < LIMITE_MS) {
      const { data: job, error } = await db.rpc('honda_fila_pegar');
      if (error) throw new Error(error.message);
      if (!job) break;
      const { log_id, uf } = job as { log_id: number; uf: string };
      const todas = normalizarBases((job as any).bases, (job as any).base);
      if (!todas.length) throw new Error('nenhum host configurado (plataforma_config.honda_base)');
      const bases = baseOk ? [baseOk, ...todas.filter((b) => b !== baseOk)] : todas;
      if ((job as any).conexao_ok === null) {                 // 1ª UF da execução: confere se a fonte está no ar
        const s = await sondar(bases, uf);
        const { error: e2 } = await db.rpc('honda_conexao_registrar', { p_log: log_id, p_ok: s.ok, p: s.info });
        if (e2) throw new Error(e2.message);
        if (!s.ok) { feitos.push({ uf, fonte: 'fora do ar', ...s.info }); break; }
        baseOk = s.base;
      }
      const ordem = baseOk ? [baseOk, ...todas.filter((b) => b !== baseOk)] : bases;
      const c = await coletarUf(ordem, uf);
      if (c.base) baseOk = c.base;
      const { data: res, error: e3 } = c.erro
        ? await db.rpc('honda_uf_erro', { p_log: log_id, p_uf: uf, p_motivo: c.erro, p: c.p })
        : await db.rpc('honda_gravar_uf', { p_log: log_id, p_uf: uf, p: c.p });
      if (e3) await db.rpc('honda_uf_erro', { p_log: log_id, p_uf: uf, p_motivo: 'erro ao gravar: ' + e3.message, p: null });
      feitos.push(res ?? { uf, erro: e3?.message });
    }
    if (feitos.length) { try { await db.rpc('honda_tabela_versionar'); } catch (_) { /* histórico é melhor esforço */ } }
    return J({ ok: true, ms: Date.now() - t0, host: baseOk, feitos });
  } catch (e) {
    return J({ erro: String((e as Error)?.message || e), ms: Date.now() - t0 }, 500);
  }
});
