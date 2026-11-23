# Contexto do projeto

Estado verificado em **2026-11-14**. Itens marcados *(inferido)* vêm do código, não de confirmação do responsável.

## O que é

Plataforma que dá a cada vendedor de motos Honda o seu próprio site de vendas (catálogo, simulação de consórcio/financiamento, WhatsApp, fichas e contratos), com painel para o vendedor e um painel mestre para o dono. Os vendedores assinam um plano pago. Há vendedores no Acre e, desde 2026-11-12, fora do Acre (expansão por estado, com regiões de preço A e B).

## Como as peças se conectam

```
Navegador / robô de prévia (WhatsApp, Instagram...)
            │
   domínio único  ── roteado pelo vercel.json do repo VITRINE
            │
   /                    → site do repo comercial   (via sitevendedor.vercel.app)
   /comercial/*         → site do repo comercial
   /:slug               → vitrine.html             (site do vendedor)
   /:slug/admin         → vitrine.html             (painel do vendedor)
   /:slug/cdc           → site do repo SITE-CDC    (via sitecdc.vercel.app)
   /:slug/cnh           → site do repo SITE-CNH    (via sitecnh.vercel.app)
   (link do aviso de cookies) → repo Termo-Honda-Grupo-Star (termosgrupostar.vercel.app, página estática)
   /:slug (robôs)       → api/og.js                (prévia do link por vendedor)
            │
        Supabase (projeto "vendashonda")  ← todos os sites falam direto com ele pelo navegador
```

- Mapeamento projeto Vercel ↔ repositório *(inferido pelos nomes)*: `sitevendedor`=comercial, `sitecdc`=SITE-CDC, `sitecnh`=SITE-CNH. **Não verificado no painel da Vercel.**
- Cada site é **um único `.html` grande** (HTML+CSS+JS embutidos), sem build. Deploy = push na `main` *(inferido: Vercel)*.
- Todos usam a mesma instância Supabase. A chave pública (anon) fica no código por design; a `service_role` nunca pode aparecer em repositório.
- `slug` = identificador do vendedor na URL (`^[a-z0-9-]{2,40}$`). O banco isola os dados de cada vendedor por esse vínculo (`vendedor_id`, funções `tenant_id()`/RLS).

## Peças por repositório

- **comercial**: `index.html` (~670 KB), `vercel.json` (cabeçalhos de segurança + CSP), ícones/imagens.
- **VITRINE**: `vitrine.html` (~630 KB), `index_VITRINE_v39-antes-cores.html` (backup antigo, ~470 KB; fica no GitHub mas não é publicado, por causa do `.vercelignore`), `sw.js` (cache de fotos do Supabase Storage no aparelho), `api/og.js` (função serverless de prévia de link), `vercel.json` (roteamento + CSP), imagens.
- **SITE-CNH** / **SITE-CDC**: `index.html` + `vercel.json` (só `/:slug` → `/index.html` e `?v=slug` → `/slug`).

- **Termo-Honda-Grupo-Star**: só `index.html` (~44 KB), página estática de Política de Privacidade e Termo de Ciência do Grupo Star; sem Supabase, sem formulário, sem `vercel.json`. Domínio `termosgrupostar.vercel.app` *(inferido pela CSP e pelo link da vitrine)*.

## Banco (resumo)

104 tabelas, 4 views, 432 funções, 77 triggers, 82 policies RLS, 37 agendamentos (pg_cron, 27 ativos), 8 Edge Functions, 2 buckets públicos (números de 2026-11-19). Detalhes em [`supabase/DATABASE_RULES.md`](supabase/DATABASE_RULES.md).

## Rotinas automáticas importantes

- Atualização do catálogo (valores/planos/fotos/cores das motos) várias vezes ao dia, horários de Brasília aproximados: 11h, 15h, 19h e 21h.
- Verificação de assinaturas (expirar/reverificar) a cada minuto.
- Sincronização da taxa CDI em dias úteis.

## Não confirmado

Regras comerciais Honda (preços, parcelas, carências) estão no banco/código; **nenhuma foi confirmada pelo responsável nesta documentação**. Não inventar valores.

## Painéis do Admin Geral guardados no banco (desde 2026-11-22)
- As abas **Catálogo** (antigo "Admin Geral | Catálogo") e **Calculadora** do Admin Geral não ficam mais no `comercial/index.html`. O HTML de cada uma fica em base64 na tabela `painel_privado` (linhas `catalogo` e `calculadora`) e o site busca com `sb.rpc('mestre_painel_privado', {p_nome})`, que só o dono executa.
- **Para mudar um desses painéis:** pegue o base64 atual da tabela (como dono ou pelo SQL Editor), decodifique, edite, codifique de novo e grave com `update painel_privado set conteudo = '<base64>', atualizado_em = now() where nome = 'catalogo';`. Não volte a embutir no HTML.
- **Arquivos não publicados:** cada repositório tem um `.vercelignore`; o que estiver listado nele fica só no GitHub.

