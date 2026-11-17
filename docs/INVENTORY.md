# Inventário

Verificado em 2026-11-14 contra os repositórios (branch `main`) e o Supabase.

## Arquivos HTML do projeto

| Site | Arquivo servido | Tamanho | Último commit (origem) |
|---|---|---|---|
| comercial | `index.html` | ~670 KB | `ec7ca63` (2026-11-14) |
| VITRINE | **`vitrine.html`** (não é `index.html`) | ~630 KB | `10b1f7e` (2026-11-14) |
| SITE-CNH | `index.html` | ~63 KB | `5b91a09` (2026-11-09) |
| SITE-CDC | `index.html` | ~60 KB | `0b2469b` (2026-11-07) |
| Termo-Honda-Grupo-Star | `index.html` | ~44 KB | `bc7ccfa` (2026-10-24) |

Duplicatas/variantes: `VITRINE/index_VITRINE_v39-antes-cores.html` é uma versão antiga (backup "antes das cores"); não é referenciada pelo `vercel.json`.

## Integrações

| Integração | Onde aparece | Observação |
|---|---|---|
| Supabase (REST/RPC, Realtime, Storage) | todos os sites, `api/og.js`, `sw.js` | projeto `vendashonda` (us-east-2) |
| Mercado Pago (Pix) | funções `mp_webhook`, tabelas de pagamento | via banco; não inspecionado a fundo |
| Telegram | Edge Function `BOTTELEGRAM`, tabelas `telegram_*`, `bot_*` | avisos e bot de administração |
| WhatsApp (aviso de lead/vendedor) | Edge Function `aviso-whatsapp`, `aviso_wa_fila` | |
| Push no app (Expo) | tabelas `app_*` | app de vendedores (antigo) |
| Avisos Web Push (app instalável do painel) | Edge Function `web-push` (código em `supabase/functions/web-push/`), tabela `push_inscricoes`, `app_push_enviar`, `aviso_preguicosos` (cron 1 min) | sem Firebase/Expo; chaves VAPID em `config_privada` |
| BCB (CDI) | função `sync_cdi`, tabela `cdi_rates` | |
| Fontes Honda (catálogo) | Edge Functions `cores-oficial`, `fotos-honda`, tabela `catalogo_fonte` | leitura periódica |

## Edge Functions (4, todas ativas)

`BOTTELEGRAM`, `cores-oficial`, `aviso-whatsapp`, `fotos-honda`, `mp-webhook`, `web-push`. O código de `web-push` está em `supabase/functions/web-push/`; o das demais **não está versionado** neste repositório (ver `KNOWN_ISSUES.md`).

## Deploy

Vercel, a partir da `main` de cada repositório *(inferido, não confirmado no painel)*. Cabeçalhos de segurança e CSP definidos nos `vercel.json`.

## Itens não acessíveis / não verificados

- Painel da Vercel (projetos, domínios, variáveis de ambiente).
- Código das Edge Functions e dos segredos que elas usam.
- App móvel dos vendedores (as tabelas `app_*` indicam que existe; o código não está nestes 5 repositórios).
