# Projeto Honda — Hub (arquivo mestre)

Central de contexto do **Sistema do Vendedor Honda**. Serve para que qualquer conta Claude (ou pessoa) consiga continuar o projeto lendo este repositório, sem depender do histórico privado de conversas.

> Última atualização: 2026-11-14

## Comece por aqui

1. [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md): visão geral e como as peças se conectam
2. [`docs/TRAINING_GUIDE.md`](docs/TRAINING_GUIDE.md): passo a passo para uma nova sessão Claude
3. [`docs/CHANGELOG.md`](docs/CHANGELOG.md): o que mudou e quando (leia o topo antes de editar)
4. [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md): pendências e riscos
5. [`docs/INVENTORY.md`](docs/INVENTORY.md): inventário de sites, arquivos e integrações
6. [`supabase/DATABASE_RULES.md`](supabase/DATABASE_RULES.md): mapa do banco
7. [`Projeto_Honda_Repositorio_Mestre_Treinamento.md`](Projeto_Honda_Repositorio_Mestre_Treinamento.md): regras de trabalho originais

## Os 5 repositórios

| Repositório | O que é | Arquivo principal |
|---|---|---|
| [comercial](https://github.com/FilipeCapelasso/comercial) | Site de venda da plataforma (planos, checkout, painel do dono) | `index.html` |
| [VITRINE](https://github.com/FilipeCapelasso/VITRINE) | Site de cada vendedor (`/:slug`) e seu painel (`/:slug/admin`) + roteador do domínio | `vitrine.html` |
| [SITE-CNH](https://github.com/FilipeCapelasso/SITE-CNH) | Pré-contrato de consórcio CNH (`/:slug/cnh`) | `index.html` |
| [SITE-CDC](https://github.com/FilipeCapelasso/SITE-CDC) | Ficha cadastral de financiamento CDC (`/:slug/cdc`) | `index.html` |
| **este (hub)** | Documentação + espelho somente leitura dos sites | — |

## Pasta `apps/` = ESPELHO SOMENTE LEITURA

`apps/` contém cópias dos arquivos dos 4 sites, atualizadas **automaticamente** por GitHub Action a cada push na `main` de cada site (ver [`docs/SYNC.md`](docs/SYNC.md)). **Nunca edite `apps/` aqui.** Edite sempre no repositório real do site; o espelho se atualiza sozinho. Cada pasta tem um arquivo `.origem` com o commit de origem.

## Regra de ouro

Nunca colocar senhas, tokens, chaves `service_role`, dados reais de clientes ou segredos em nenhum destes repositórios. **Os repositórios são públicos**: tudo que for escrito aqui é visível na internet.
