# Como o espelho `apps/` e o log automático funcionam

Cada repositório de site tem `.github/workflows/registrar-no-hub.yml`. A cada push na `main` (qualquer arquivo), a Action (1) copia os arquivos do site para `apps/<site>/` neste hub e grava `apps/<site>/.origem` (commit de origem) e (2) acrescenta uma linha em `docs/log/<site>.md` com data, commit, mensagem e arquivos alterados. Resultado: este repositório sempre mostra a versão mais recente dos 4 sites, sem trabalho manual.

| Repo de origem | Pasta no hub | Arquivos espelhados |
|---|---|---|
| comercial | `apps/comercial/` | `index.html`, `vercel.json` |
| VITRINE | `apps/vitrine/` | `vitrine.html`, `vercel.json`, `sw.js`, `api/og.js` |
| SITE-CNH | `apps/site-cnh/` | `index.html`, `vercel.json` |
| SITE-CDC | `apps/site-cdc/` | `index.html`, `vercel.json` |
| Termo-Honda-Grupo-Star | `apps/termo-star/` | `index.html` |

## Configuração única (já feita?)

A Action precisa de um segredo `HONDA_SYNC_TOKEN` em **cada um dos 5 repositórios de site**: um token do GitHub com permissão de escrita (Contents: Read and write) **somente** neste repositório hub. Enquanto o segredo não existir, a Action só avisa que o espelho foi ignorado e não falha.

Passos: GitHub → Settings → Developer settings → Fine-grained tokens → repositório `atualiza-o-projeto-Honda` → permissão *Contents: Read and write* → copiar o token → em cada repo de site (inclusive o Termo-Honda-Grupo-Star), Settings → Secrets and variables → Actions → New secret `HONDA_SYNC_TOKEN`.

## Regras

- Nunca editar `apps/` à mão: a próxima sincronização sobrescreve.
- O espelho não substitui a leitura do repositório real quando a tarefa exigir precisão: confira o `.origem`.
- O log automático cobre só os **sites**. Mudanças no **banco** não passam pelo GitHub: confira o Supabase de verdade e registre no `CHANGELOG.md` + `supabase/DATABASE_RULES.md`.
- Mudou algo no banco? O espelho não cobre isso: atualize `supabase/DATABASE_RULES.md` e o changelog.
