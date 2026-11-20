# Banco de dados (Supabase) — mapa

Projeto Supabase **`vendashonda`**, região us-east-2, Postgres 17. Levantamento em **2026-11-14** via MCP do Supabase (somente leitura). Nenhum dado de cliente foi copiado para cá.

Totais (conferido em 2026-11-19): 105 tabelas · 4 views · 432 funções no schema `public` (352 `SECURITY DEFINER`) · 77 triggers · 82 policies RLS · 38 agendamentos pg_cron (28 ativos) · 142 migrations · 8 Edge Functions · buckets de Storage públicos `produtos` e `midia`.

## Princípios (confirmados no esquema)

- **RLS ligado em todas as tabelas.** Muitas não têm policy de propósito: o acesso é só por funções RPC (`SECURITY DEFINER`) ou pelo servidor. Não "consertar" criando policy aberta.
- **Multi-vendedor:** tabelas de negócio têm `vendedor_id` (default `tenant_id()`), ligado a `vendedores(id)`. O `slug` do vendedor vem do cabeçalho `x-vendedor` nas leituras públicas.
- Leitura pública do site do vendedor passa pela view `vendedor_publico` e por RPCs `*_publica`/`ps_publico`/`config_publica`.
- Funções com prefixo: `mestre_*` (painel do dono), `meu_*` (vendedor logado), `ps_*` (plataforma/checkout), `assin_*` (assinaturas), `app_*` (app), `site_sync_*`/`regiao_b_*` (atualização do catálogo), `honda_*`/`mestre_honda_*` (tabelas nacionais do Consórcio Honda, ver `docs/HONDA_API.md`).
- Alterações de estrutura: **sempre por migration** (`apply_migration`), nunca DDL solto. Lista em [`MIGRATIONS_APLICADAS.md`](MIGRATIONS_APLICADAS.md).

## Tabelas por domínio

| Domínio | Tabelas |
|---|---|
| Catálogo de motos | `catalogo_mestre` (32; coluna `excluir_ufs` = UFs que não recebem o modelo, gatilho `a0_excluir_uf`), `catalogo_fonte`, `catalogo_planos_regiao`, `catalogo_planos_hist`, `catalogo_versoes`, `catalogo_avisos`, `ofertas`, `historico_motos`, `site_sync_log`, `regiao_req`, `regiao_log`, `cnh_req`, `cdi_rates`, `ufs` |
| Vendedores e plataforma | `vendedores` (39), `vendedor_custom` (personalização: publicado/rascunho/anterior), `vendedor_plano`, `vendedor_mensagens`, `ps_destaques`, `lojas`, `concessionarias`, `plataforma_config`, `config_multi`, `site_conteudo`, `vendedor` (legado, 1 linha) |
| Dados do vendedor | `motos` (~1.2 mil, por vendedor, ligadas ao catálogo), `leads`, `fichas`, `contratos`, `pedidos_chat`, `rascunhos`, `simulacoes`, `visitas` |
| Assinaturas e pagamentos | `plans`, `customers`, `orders`, `payments`, `subscriptions`, `payment_events`, `receitas`, `assin_planos`, `assin_pedidos`, `plano_ajustes`, `support_tickets` |
| App, avisos e bots | `app_dispositivos`, `app_dispositivos_dono`, `app_prefs`, `app_notificacoes`, `aviso_wa_fila`, `telegram_fila`, `bot_sessoes`, `bot_log` |
| Engajamento | `votacoes`, `votos`, `atualizacoes` |
| Acesso e segredos (sem conteúdo aqui) | `admins`, `donos`, `painel_donos`, `config_privada`, `segredos`, `vendedor_segredos`, `vendedor_senhas` |
| Sistema | `erros_sistema` |
| Possível legado de outros sistemas *(inferido pelos nomes; não confirmado)* | `categorias`, `produtos`, `produtos_estoque`, `centros`, `sabores`, `pedidos`, `clientes`, `avaliacoes`, `carrinhos_abandonados`, `pix_cobrancas`, `pagamentos`, `configuracoes`, `registros`, `movimentos` |

Relações principais: `vendedores` → (`motos`, `leads`, `fichas`, `contratos`, `pedidos_chat`, `rascunhos`, `visitas`, `simulacoes`, `vendedor_custom`, `vendedor_plano`, `receitas`, …); `motos.catalogo_id` → `catalogo_mestre`; `customers` → `orders` → `payments`; `customers` → `subscriptions` → `plans`; `vendedores.uf` → `ufs`; `vendedores.concessionaria_id` → `concessionarias`.

## Agendamentos (pg_cron, 37 em 2026-11-19; a tabela abaixo é um resumo por grupo)

| Grupo | Frequência (UTC no cron) | Função |
|---|---|---|
| Assinaturas | todo minuto | `ps_expirar`, `ps_reverificar` |
| Pendências do catálogo | a cada 5 min | `ps_catalogo_pendentes` |
| Região A (AC, AM, RO, RR) + Motores e Máquinas, lidos do site oficial (iniciar → planos → aplicar → retry → publicar) | 2×/dia: 12:00 e 20:00 UTC = 07:00 e 15:00 Rio Branco (+5, +10, +13, +15 min) | `site_sync_*` |
| Fonte reserva vendedor.site (só Acre/região A): só age se o site oficial NÃO atualizou nas últimas 26 h | 3×/dia (11:20, 16:20, 21:20 UTC; aplicar 3 min depois) | `vsite_iniciar`, `vsite_aplicar` |
| Cometa Motocenter Manaus: tabela própria `COMETA-AM` lida do site da loja (iniciar → buscar → aplicar); só vendedores da Cometa a recebem | 2×/dia (11:00 e 19:00 UTC = 06:00 e 14:00 Rio Branco; buscar +1 min, aplicar +4 min) | `cometa_iniciar`, `cometa_buscar`, `cometa_aplicar` |
| Tabelas Honda nacionais (27 UFs): coleta pelo coletor `honda-sync` | 2×/dia: 12:25 e 20:25 UTC = 07:25 e 15:25 Rio Branco | `honda_agendar` |
| Tabelas Honda: avança a fila e chama o coletor `honda-sync` | a cada 2 min | `honda_passo` |
| Região B (23 estados) a partir da coleta oficial + conferência de que cada estado tem a tabela da sua região; roda sozinha ao fim da coleta e de novo às 12:45/20:45 UTC (pula se já aplicou) | 2×/dia | `honda_regioes_aplicar` (`regiao_b_*` desligados) |
| `#voudeHonda` (sem +) por região em `catalogo_planos_normal`, validado contra o `#voudeHonda+`, e reaplicação nas motos das lojas que escolheram `#voudeHonda` ou os dois | `plano_normal_atualizar` | 12:48 e 20:48 UTC |
| Expansão por estado | 2×/dia (12:55 e 20:55 UTC) | `expansao_manter` |
| Fotos e cores oficiais | 2×/dia (cores 12:20/20:20, fotos 12:50/20:50 UTC) | chamam as Edge Functions `fotos-honda` e `cores-oficial` |
| CDI | dias úteis, 21h UTC | `sync_cdi` |
| Limpeza | diária | `pb_limpeza`, `ps_limpa_senhas` (horária), apaga `visitas` com mais de 90 dias |

## Edge Functions

8 funções ativas em 2026-11-19: `BOTTELEGRAM` (v10), `cores-oficial` (v7), `aviso-whatsapp` (v1), `fotos-honda` (v1), `wa-webhook` (v1), `mp-webhook` (v3), `web-push` (v3), `honda-sync` (v2). Todas com `verify_jwt=false` (webhooks/cron) e cada uma confere uma chave/segredo própria no código. Código versionado aqui: `honda-sync`, `mp-webhook`, `web-push`. **Não versionadas ainda:** `BOTTELEGRAM`, `cores-oficial`, `aviso-whatsapp`, `fotos-honda`, `wa-webhook`.

## Cliente sem moto não conta e não aparece

Regra do dono (19/11/2026): quem não escolheu a moto **não é contado, não aparece para o vendedor nem no Admin Geral e não gera aviso**. Vale para `leads`, `fichas`, `contratos`, `pedidos_chat` e `rascunhos`.
- **Definição:** `public._cliente_com_moto(moto_nome)` (vazio, nulo, "Ainda não escolhi", "Não informada", "Sem moto"… = sem moto).
- **Onde é aplicada:** as policies de leitura das 5 tabelas (`contratos_sel`, `fichas_sel`, `leads_sel`, `p_sel`, `r_sel` = `pode_gerir(vendedor_id) AND _cliente_com_moto(moto_nome)`); as funções `mestre_pedidos`, `mestre_ranking`, `mestre_vendedores`, `dono_resumo`, `bot_contagem`; os avisos `_rascunho_notificar` e `aviso_preguicosos`; e os gatilhos de aviso (`tg_aviso_*`, `tg_app_push`), com `WHEN (_cliente_com_moto(new.moto_nome))`.
- **Dado não é apagado:** quando o cliente passa a ter moto, ele aparece sozinho. Ao criar uma nova função/tela que liste ou conte clientes, **incluir `_cliente_com_moto`**; as funções `SECURITY DEFINER` não passam pela policy.
- `checkup_entrega` (diagnóstico interno) não filtra de propósito.

## Segurança — resumo

O linter do Supabase (2026-11-14, reconferido em 2026-11-19 sem novas categorias) aponta, em resumo: tabelas com RLS sem policy (intencional, acesso por RPC), uma view com `SECURITY DEFINER` (`vendedor_publico`, usada para leitura pública), funções `SECURITY DEFINER` executáveis por `anon`/`authenticated` (modelo de RPC do projeto), duas funções sem `search_path` fixo e a extensão `pg_net` no schema `public`. Detalhes e plano de revisão: [`../docs/KNOWN_ISSUES.md`](../docs/KNOWN_ISSUES.md).

## Estado das migrations

Todas as migrations listadas em `MIGRATIONS_APLICADAS.md` constam como **aplicadas em produção** (é o histórico do próprio Supabase). O SQL de cada uma **não foi exportado** para o Git (pode conter dados sensíveis); ver pendências.
