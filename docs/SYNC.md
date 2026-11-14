# Como o espelho `apps/` funciona

Cada repositório de site tem `.github/workflows/sync-honda.yml`. A cada push na `main` que altere os arquivos do site, a Action copia esses arquivos para `apps/<site>/` neste hub e grava `apps/<site>/.origem` (commit de origem). Resultado: este repositório sempre mostra a versão mais recente dos 4 sites, sem trabalho manual.

| Repo de origem | Pasta no hub | Arquivos espelhados |
|---|---|---|
| comercial | `apps/comercial/` | `index.html`, `vercel.json` |
| VITRINE | `apps/vitrine/` | `vitrine.html`, `vercel.json`, `sw.js`, `api/og.js` |
| SITE-CNH | `apps/site-cnh/` | `index.html`, `vercel.json` |
| SITE-CDC | `apps/site-cdc/` | `index.html`, `vercel.json` |

## Configuração única (já feita?)

A Action precisa de um segredo `HONDA_SYNC_TOKEN` em **cada um dos 4 repositórios de site**: um token do GitHub com permissão de escrita (Contents: Read and write) **somente** neste repositório hub. Enquanto o segredo não existir, a Action só avisa que o espelho foi ignorado e não falha.

Passos: GitHub → Settings → Developer settings → Fine-grained tokens → repositório `atualiza-o-projeto-Honda` → permissão *Contents: Read and write* → copiar o token → em cada repo de site, Settings → Secrets and variables → Actions → New secret `HONDA_SYNC_TOKEN`.

## Regras

- Nunca editar `apps/` à mão: a próxima sincronização sobrescreve.
- O espelho não substitui a leitura do repositório real quando a tarefa exigir precisão: confira o `.origem`.
- Mudou algo no banco? O espelho não cobre isso: atualize `supabase/DATABASE_RULES.md` e o changelog.
