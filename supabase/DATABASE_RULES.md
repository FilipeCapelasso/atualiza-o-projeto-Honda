# Banco de dados (Supabase) — mapa

Projeto Supabase **`vendashonda`**, região us-east-2, Postgres 17. Levantamento em **2026-11-14** via MCP do Supabase (somente leitura). Nenhum dado de cliente foi copiado para cá.

Totais: 79 tabelas · 4 views · ~330 funções no schema `public` · 74 triggers · 71 policies RLS · 25 agendamentos pg_cron · 4 Edge Functions · buckets de Storage públicos `produtos` e `midia`.

## Princípios (confirmados no esquema)

- **RLS ligado em todas as tabelas.** Muitas não têm policy de propósito: o acesso é só por funções RPC (`SECURITY DEFINER`) ou pelo servidor. Não "consertar" criando policy aberta.
- **Multi-vendedor:** tabelas de negócio têm `vendedor_id` (default `tenant_id()`), ligado a `vendedores(id)`. O `slug` do vendedor vem do cabeçalho `x-vendedor` nas leituras públicas.
- Leitura pública do site do vendedor passa pela view `vendedor_publico` e por RPCs `*_publica`/`ps_publico`/`config_publica`.
- Funções com prefixo: `mestre_*` (painel do dono), `meu_*` (vendedor logado), `ps_*` (plataforma/checkout), `assin_*` (assinaturas), `app_*` (app), `patrao_*` (apresentação), `site_sync_*`/`regiao_b_*` (atualização do catálogo), `honda_*`/`mestre_honda_*` (tabelas nacionais do Consórcio Honda, ver `docs/HONDA_API.md`).
- Alterações de estrutura: **sempre por migration** (`apply_migration`), nunca DDL solto. Lista em [`MIGRATIONS_APLICADAS.md`](MIGRATIONS_APLICADAS.md).

## Tabelas por domínio

| Domínio | Tabelas |
|---|---|
| Catálogo de motos | `catalogo_mestre` (31), `catalogo_fonte`, `catalogo_planos_regiao`, `catalogo_planos_hist`, `catalogo_versoes`, `catalogo_avisos`, `ofertas`, `historico_motos`, `site_sync_log`, `regiao_req`, `regiao_log`, `cnh_req`, `cdi_rates`, `ufs` |
| Vendedores e plataforma | `vendedores` (39), `vendedor_custom` (personalização: publicado/rascunho/anterior), `vendedor_plano`, `vendedor_mensagens`, `ps_destaques`, `lojas`, `concessionarias`, `plataforma_config`, `config_multi`, `site_conteudo`, `vendedor` (legado, 1 linha) |
| Dados do vendedor | `motos` (~1.2 mil, por vendedor, ligadas ao catálogo), `leads`, `fichas`, `contratos`, `pedidos_chat`, `rascunhos`, `simulacoes`, `visitas` |
| Assinaturas e pagamentos | `plans`, `customers`, `orders`, `payments`, `subscriptions`, `payment_events`, `receitas`, `assin_planos`, `assin_pedidos`, `plano_ajustes`, `support_tickets` |
| App, avisos e bots | `app_dispositivos`, `app_dispositivos_dono`, `app_prefs`, `app_notificacoes`, `aviso_wa_fila`, `telegram_fila`, `bot_sessoes`, `bot_log` |
| Engajamento | `votacoes`, `votos`, `atualizacoes`, `patrao_sessoes`, `patrao_respostas` |
| Acesso e segredos (sem conteúdo aqui) | `admins`, `donos`, `painel_donos`, `config_privada`, `segredos`, `vendedor_segredos`, `vendedor_senhas` |
| Sistema | `erros_sistema` |
| Possível legado de outros sistemas *(inferido pelos nomes; não confirmado)* | `categorias`, `produtos`, `produtos_estoque`, `centros`, `sabores`, `pedidos`, `clientes`, `avaliacoes`, `carrinhos_abandonados`, `pix_cobrancas`, `pagamentos`, `configuracoes`, `registros`, `movimentos` |

Relações principais: `vendedores` → (`motos`, `leads`, `fichas`, `contratos`, `pedidos_chat`, `rascunhos`, `visitas`, `simulacoes`, `vendedor_custom`, `vendedor_plano`, `receitas`, …); `motos.catalogo_id` → `catalogo_mestre`; `customers` → `orders` → `payments`; `customers` → `subscriptions` → `plans`; `vendedores.uf` → `ufs`; `vendedores.concessionaria_id` → `concessionarias`.

## Agendamentos (pg_cron, 25)

| Grupo | Frequência (UTC no cron) | Função |
|---|---|---|
| Assinaturas | todo minuto | `ps_expirar`, `ps_reverificar` |
| Pendências do catálogo | a cada 5 min | `ps_catalogo_pendentes` |
| Atualização do catálogo (iniciar → planos → aplicar → publicar → retry) | 4×/dia (+ rodada extra à noite) | `site_sync_*` |
| Atualização do catálogo, fonte alternativa vendedor.site (iniciar → aplicar); só age se o site oficial não atualizou nas últimas 6 h | 3×/dia (11:20, 16:20, 21:20 UTC; aplicar 3 min depois) | `vsite_iniciar`, `vsite_aplicar` |
| Tabelas Honda nacionais (27 UFs): confere a fonte e cria execução se não houve coleta boa em 7 h | toda hora (min 7) | `honda_agendar` |
| Tabelas Honda: avança a fila e chama o coletor `honda-sync` | a cada 2 min | `honda_passo` |
| Região B (preços fora do Acre) | 4×/dia | `regiao_b_iniciar`, `regiao_b_aplicar` |
| Expansão por estado | 4×/dia | `expansao_manter` |
| Fotos e cores oficiais | 4×/dia | chamam as Edge Functions `fotos-honda` e `cores-oficial` |
| CDI | dias úteis, 21h UTC | `sync_cdi` |
| Limpeza | diária | `pb_limpeza`, `ps_limpa_senhas` (horária), apaga `visitas` com mais de 90 dias |

## Edge Functions

`BOTTELEGRAM` (v10), `cores-oficial` (v7), `aviso-whatsapp` (v1), `fotos-honda` (v1). Todas com `verify_jwt=false` (webhooks/cron). Código-fonte **não versionado** ainda.

## Segurança — resumo

O linter do Supabase (2026-11-14) aponta, em resumo: tabelas com RLS sem policy (intencional, acesso por RPC), uma view com `SECURITY DEFINER` (`vendedor_publico`, usada para leitura pública), funções `SECURITY DEFINER` executáveis por `anon`/`authenticated` (modelo de RPC do projeto), duas funções sem `search_path` fixo e a extensão `pg_net` no schema `public`. Detalhes e plano de revisão: [`../docs/KNOWN_ISSUES.md`](../docs/KNOWN_ISSUES.md).

## Estado das migrations

Todas as migrations listadas em `MIGRATIONS_APLICADAS.md` constam como **aplicadas em produção** (é o histórico do próprio Supabase). O SQL de cada uma **não foi exportado** para o Git (pode conter dados sensíveis); ver pendências.
