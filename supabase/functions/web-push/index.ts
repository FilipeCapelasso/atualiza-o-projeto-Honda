// @ts-nocheck
// Envia os avisos do painel do vendedor por Web Push (app instalado no Android, iPhone e computador).
// Não usa Firebase nem Expo: as chaves VAPID são geradas aqui na 1ª vez e ficam só no banco (config_privada).
import { createClient } from "jsr:@supabase/supabase-js@2";
import { envia, novasChaves } from "./webpush.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const cfg = async (k) => (await db.from("config_privada").select("valor").eq("chave", k).maybeSingle()).data?.valor ?? null;

async function chaves() {
  let jwk = await cfg("webpush_vapid_jwk"), pub = await cfg("webpush_vapid_pub");
  if (jwk && pub) return { jwk: JSON.parse(jwk), publica: pub };
  // 1ª vez: grava sem sobrescrever (se duas chamadas chegarem juntas, vale a primeira) e relê do banco
  const n = await novasChaves();
  await db.from("config_privada").upsert([{ chave: "webpush_vapid_jwk", valor: JSON.stringify(n.jwk) }, { chave: "webpush_vapid_pub", valor: n.publica }], { onConflict: "chave", ignoreDuplicates: true });
  jwk = await cfg("webpush_vapid_jwk"); pub = await cfg("webpush_vapid_pub");
  await db.from("plataforma_config").upsert({ chave: "webpush_publica", valor: pub }, { onConflict: "chave" });
  return { jwk: JSON.parse(jwk), publica: pub };
}

async function contato() {
  const { data } = await db.from("plataforma_config").select("valor").eq("chave", "venda_email").maybeSingle();
  const e = String(data?.valor ?? "").trim();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e) ? "mailto:" + e : "https://www.sitevendedor.com";
}

async function mandaNotif(id) {
  const { data: n } = await db.from("app_notificacoes").select("*").eq("id", id).maybeSingle();
  if (!n) return { id, st: "nao_encontrado" };
  const { data: subs } = await db.from("push_inscricoes").select("*").eq("vendedor_id", n.vendedor_id);
  if (!subs?.length) return { id, st: "sem_aparelho" };
  const { count } = await db.from("app_notificacoes").select("id", { count: "exact", head: true }).eq("vendedor_id", n.vendedor_id).eq("lida", false);
  const k = await chaves(), ct = await contato();
  const d = n.dados || {};
  const texto = JSON.stringify({ id: n.id, t: n.titulo, b: n.corpo, tp: n.tipo, slug: d.slug, cid: d.cid ?? null, wa: d.wa ?? null, img: d.img ?? null, n: count ?? 0, em: n.criado });
  const topico = d.cid ? String(d.cid).replace(/[^A-Za-z0-9]/g, "").slice(0, 32) : undefined;
  const out = [];
  await Promise.all(subs.map(async (s) => {
    let r;
    try { r = await envia(s, texto, k.jwk, k.publica, ct, { ttl: n.tipo === "teste" ? 600 : 86400, topico }); }
    catch (e) { r = { status: 0, txt: String(e?.message ?? e).slice(0, 200) }; }
    out.push({ s: s.id, st: r.status });
    if (r.status === 404 || r.status === 410) { await db.from("push_inscricoes").delete().eq("id", s.id); return; }
    const ok = r.status >= 200 && r.status < 300;
    const falhas = ok ? 0 : (s.falhas || 0) + 1;
    if (falhas >= 15) { await db.from("push_inscricoes").delete().eq("id", s.id); return; }
    await db.from("push_inscricoes").update({ ultimo_envio: new Date().toISOString(), ultimo_status: r.status, ultimo_erro: ok ? null : (r.txt || `HTTP ${r.status}`), falhas }).eq("id", s.id);
  }));
  return { id, out };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  const k = await cfg("webpush_key");
  if (!k || req.headers.get("x-webpush-key") !== k) return new Response("forbidden", { status: 403 });
  const b = await req.json().catch(() => ({}));
  if (b.acao === "chave") return Response.json({ publica: (await chaves()).publica });
  if (b.acao === "teste_endpoint" && b.sub) {   // diagnóstico: manda para uma inscrição passada direto (não grava nada)
    const kk = await chaves();
    return Response.json(await envia(b.sub, JSON.stringify({ t: "teste", b: "teste" }), kk.jwk, kk.publica, await contato(), { ttl: 60 }));
  }
  if (!b.notif) return new Response("bad", { status: 400 });
  return Response.json(await mandaNotif(Number(b.notif)));
});
