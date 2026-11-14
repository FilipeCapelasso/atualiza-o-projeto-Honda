# Guia para uma nova sessão Claude

Use quando outra conta (ou outra sessão) for continuar o projeto. A memória das conversas NÃO é compartilhada entre contas: o estado do projeto está nestes arquivos e nos repositórios.

## Início da sessão (5 minutos)

0. Regra fixa das contas: ver "Regra para colar nas configurações" no fim deste arquivo.
1. Atualize os 6 repositórios (`git pull`) e veja o último commit de cada um.
2. Leia `README.md`, `PROJECT_CONTEXT.md`, o **topo** de `docs/CHANGELOG.md` e `docs/KNOWN_ISSUES.md`.
3. Veja `docs/log/<site>.md` (automático) e compare o commit do último registro no changelog com o `git log` do site que vai mexer. Se houver commits novos sem registro, leia-os antes de editar.
4. Para tarefas que tocam o banco, leia `supabase/DATABASE_RULES.md` e consulte o estado real no Supabase (não confie só no documento).

## Durante a tarefa

- Edite **sempre no repositório real do site** (`comercial`, `VITRINE`, `SITE-CNH`, `SITE-CDC` ou `Termo-Honda-Grupo-Star`). Nunca em `apps/` (é espelho).
- Atenção: o arquivo da vitrine é `vitrine.html`, não `index.html`.
- Mudança no banco = migration (`apply_migration`), nunca SQL solto. Sem alterações destrutivas sem autorização explícita do responsável.
- Preserve o isolamento entre vendedores; evite mudança global quando o pedido for individual.
- Nunca grave segredos nem dados reais de clientes em arquivos ou mensagens de commit. Os repositórios são públicos.

## Ao terminar (obrigatório)

1. Valide o que for possível (sintaxe do HTML/JS, abrir a página, consultas de conferência no banco).
2. Faça o commit no repositório do site. O espelho `apps/` se atualiza sozinho (se `HONDA_SYNC_TOKEN` estiver configurado).
3. Adicione uma entrada no topo de `docs/CHANGELOG.md` neste hub no formato do arquivo, dizendo claramente: banco alterado ou não, deploy confirmado ou não verificado.
4. Se mudou o banco, atualize `supabase/DATABASE_RULES.md` e `MIGRATIONS_APLICADAS.md`.
5. Atualize `docs/KNOWN_ISSUES.md` (pendências novas ou resolvidas).

## Frases úteis para o usuário colar na outra conta

- Começar: *"Leia o hub atualiza-o-projeto-Honda (README, PROJECT_CONTEXT, topo do CHANGELOG e KNOWN_ISSUES), confira os últimos commits dos 5 sites e continue de onde parou."*
- Terminar: *"Registre no CHANGELOG do hub o que fizemos e atualize as pendências."*

## Regra para colar nas configurações das contas Claude

> Antes de qualquer modificação ou melhoria no Projeto Honda: (1) confira o Supabase de verdade (projeto vendashonda: tabelas, funções e migrations atuais); (2) leia o hub https://github.com/FilipeCapelasso/atualiza-o-projeto-Honda (README, PROJECT_CONTEXT, topo do docs/CHANGELOG, docs/KNOWN_ISSUES e docs/log/); (3) abra os repositórios reais dos sites (comercial, VITRINE, SITE-CNH, SITE-CDC, Termo-Honda-Grupo-Star), faça git pull e confirme o commit mais recente: se hub e repositório divergirem, vale o repositório real e o Supabase; (4) só então faça o pedido, mexendo apenas no arquivo necessário e sem partir de cópia antiga; (5) no fim, registre no docs/CHANGELOG do hub o que mudou, por quê, se o banco foi alterado e o que ficou pendente.
