# Pendências e riscos

Atualizado em 2026-11-14. Repositórios **públicos**: não detalhar aqui falhas exploráveis; registrar o tema e tratar os detalhes em conversa privada.

## Pendências de documentação / versionamento

- [ ] Criar o segredo `HONDA_SYNC_TOKEN` nos 4 repositórios de site (ver `SYNC.md`); sem isso o espelho `apps/` não se atualiza sozinho.
- [ ] Versionar o código das 4 Edge Functions (`BOTTELEGRAM`, `cores-oficial`, `aviso-whatsapp`, `fotos-honda`) em `supabase/functions/`, sem segredos.
- [ ] Exportar o SQL das migrations para `supabase/migrations/` **depois de revisar se há dados sensíveis dentro** (algumas têm nomes que sugerem tokens/senhas).
- [ ] Documentar regras de negócio confirmadas (planos, preços da plataforma, regras de região A/B, prazos) com validação do responsável.
- [ ] Confirmar no painel da Vercel o mapeamento projeto ↔ repositório e as variáveis de ambiente (nomes apenas).
- [ ] Definir onde está o código do app móvel dos vendedores (tabelas `app_*`), se existir.
- [ ] Decidir o destino das tabelas aparentemente legadas listadas em `DATABASE_RULES.md` (não apagar sem confirmação).

## Riscos operacionais

- Cada site é um arquivo único de ~60 a 690 KB: conflitos de edição simultânea entre contas são fáceis. Regra: uma conta por vez por site; sempre `git pull` antes e conferir o último commit.
- O hub é público e contém o mapa do banco. Considerar torná-lo **privado** (o espelho continua funcionando com o token).
- Não existe teste automatizado nem ambiente de homologação identificados; a `main` vai direto para produção *(inferido)*.
- `VITRINE/index_VITRINE_v39-antes-cores.html` é um backup grande no repositório; avaliar mover/remover (com autorização).

## Segurança (resumo; ver o relatório do linter do Supabase)

- Revisar periodicamente o relatório de segurança do Supabase (`get_advisors`), principalmente depois de cada migration.
- Itens em aberto do último relatório: duas funções sem `search_path` fixo; extensão `pg_net` no schema `public`; revisar se cada função `SECURITY DEFINER` exposta por RPC valida o chamador internamente.
- Nunca colocar chave `service_role`, tokens (Telegram, Mercado Pago, WhatsApp) ou senhas em arquivos do repositório.
