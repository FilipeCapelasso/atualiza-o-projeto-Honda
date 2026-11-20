# Pendências e riscos

Atualizado em 2026-11-19. Repositórios **públicos**: não detalhar aqui falhas exploráveis; registrar o tema e tratar os detalhes em conversa privada.

## Pendências de documentação / versionamento

- [ ] Criar o segredo `HONDA_SYNC_TOKEN` nos 5 repositórios de site (ver `SYNC.md`); sem isso o espelho `apps/` não se atualiza sozinho.
- [ ] Versionar o código das 5 Edge Functions que faltam (`BOTTELEGRAM`, `cores-oficial`, `aviso-whatsapp`, `fotos-honda`, `wa-webhook`) em `supabase/functions/`, sem segredos.
- [ ] Exportar o SQL das migrations para `supabase/migrations/` **depois de revisar se há dados sensíveis dentro** (algumas têm nomes que sugerem tokens/senhas).
- [ ] Documentar regras de negócio confirmadas (planos, preços da plataforma, regras de região A/B, prazos) com validação do responsável.
- [ ] Confirmar no painel da Vercel o mapeamento projeto ↔ repositório e as variáveis de ambiente (nomes apenas).
- [ ] Definir onde está o código do app móvel dos vendedores (tabelas `app_*`), se existir.
- [ ] Decidir o destino das tabelas aparentemente legadas listadas em `DATABASE_RULES.md` (não apagar sem confirmação).

- [ ] Revisão completa de 2026-11-19: o relatório com os pontos de segurança foi entregue em conversa privada (não detalhar aqui). Tratar na ordem combinada com o responsável.
- [ ] Tabelas do antigo e-commerce sem nenhuma função que as use (`avaliacoes`, `categorias`, `centros`, `produtos`, `produtos_estoque`, `sabores`, `movimentos`, `pix_cobrancas`, `support_tickets`, `plano_ajustes`, `lf_resultados`, `simulacoes`): decidir arquivar/remover (não apagar sem confirmação).
- [ ] Limpeza de performance sem urgência: 6 índices duplicados, 27 índices nunca usados, 5 chaves estrangeiras sem índice, `regiao_req` sem chave primária, 18 casos de várias policies para a mesma ação.
- [ ] `sync_cdi()` falhou 1× nos últimos 3 dias porque o BCB respondeu 304; tratar 304 como "sem novidade".
- [ ] Os crons novos `honda_regioes_aplicar`, `lf_buscar` e `lf_aplicar` ainda não tinham rodado em 2026-11-19 (foram criados no mesmo dia): conferir `cron.job_run_details` depois da primeira janela.

- [ ] **Avisos de WhatsApp aos vendedores parados:** 139 avisos (contato, chat, ficha, contrato) estão na fila `aviso_wa_fila` com status `aguardando_config` porque o envio de WhatsApp ainda não está configurado. Hoje o vendedor só é avisado por push (poucos aparelhos inscritos) e pelo próprio painel. Decidir: configurar o envio ou ampliar o push.
- [ ] Conferir após a 1ª janela (12:46 e 12:48 UTC de 2026-11-20): `cometa_oficial_aplicar` e `plano_normal_atualizar` em `cron.job_run_details` e `regiao_log`.
- [ ] Decidir se os robôs antigos da Cometa (`cometa_iniciar`, `cometa_buscar`, `cometa_aplicar`) são desativados; a tabela oficial do Amazonas passou a ser a fonte da Cometa.
- [ ] Rascunhos parados há mais de 1 dia: 48 (27 sem aviso). Revisar o aviso de "cliente que parou".

## Riscos operacionais

- Cada site é um arquivo único de ~60 a 690 KB: conflitos de edição simultânea entre contas são fáceis. Regra: uma conta por vez por site; sempre `git pull` antes e conferir o último commit.
- O hub é público e contém o mapa do banco. Considerar torná-lo **privado** (o espelho continua funcionando com o token).
- Não existe teste automatizado nem ambiente de homologação identificados; a `main` vai direto para produção *(inferido)*.
- `VITRINE/index_VITRINE_v39-antes-cores.html` é um backup grande no repositório; avaliar mover/remover (com autorização).

## Segurança (resumo; ver o relatório do linter do Supabase)

- Revisar periodicamente o relatório de segurança do Supabase (`get_advisors`), principalmente depois de cada migration.
- Itens em aberto do último relatório: duas funções sem `search_path` fixo; extensão `pg_net` no schema `public`; revisar se cada função `SECURITY DEFINER` exposta por RPC valida o chamador internamente.
- Nunca colocar chave `service_role`, tokens (Telegram, Mercado Pago, WhatsApp) ou senhas em arquivos do repositório.
