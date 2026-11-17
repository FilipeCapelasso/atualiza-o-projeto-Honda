# Integração nacional com a API do Consórcio Nacional Honda (27 UFs)

Criada em 17/11/2026. Fonte prioritária: `https://www.consorcionacionalhonda.com.br` (a base fica em `plataforma_config.honda_base`).

## Situação da fonte em 17/11/2026 (testado de verdade)

| Teste | Resultado |
|---|---|
| Banco (pg_net), 7 URLs: `/`, `/planos/vou-de-honda-mais`, `/api/site/consorcio/planos`, `/api/veiculos/categorias/list/AC/motos`, `.../SP/motos`, `/api/veiculo/plans/SP/cg-160-titan` | **404 "Web Site Not Found"** (página padrão da hospedagem Acquia, atrás da Imperva). Até as 12h40 (Rio Branco) respondia **403 "Access denied"**; desde 16/11 já falhava. |
| Navegador na nuvem (outra rede) | Mesma página "Web Site Not Found" na home, na página do #Vou de Honda+ e em `hondaservicosfinanceiros.com.br`. |
| `consorciohonda.com.br` (endereço citado no Facebook da Honda) | Redireciona para `consorcionacionalhonda.com.br` → 404. |
| WebFetch (pesquisa) | Falha no site (client_error). Um verificador público também marcou o domínio como fora do ar. |
| CDN de arquivos do site (`d138k0nccc9zty.cloudfront.net/.../_nuxt/*.js`) | 200 (só arquivos estáticos; sem tabela de preços). |

**Conclusão:** o site oficial está fora do ar para todo mundo (não é bloqueio contra o nosso servidor). Nenhuma das três rotas pôde ser testada com resposta real da Honda. Não foi usado nenhum cabeçalho falso nem desvio de bloqueio. **Não existem exemplos reais de JSON desta data**; os formatos abaixo vêm do código que lia a mesma API com sucesso até 15/11 (`cnh_aplicar`, `_cnh_escolher`) e do projeto de referência `rochajrdev/consorcio-honda` (clonado e lido; usa as mesmas rotas, GET simples, sem token nem cookie).

## Rotas (centralizadas em `supabase/functions/honda-sync/index.ts`, objeto `ROTAS`)

| Rota | Uso | Situação |
|---|---|---|
| `GET /api/site/consorcio/planos` | Configuração geral dos planos. Também é a "sonda": a 1ª UF de cada execução confere se a fonte está no ar. JSON original guardado em `honda_plans_config` (só quando muda). | 404 hoje |
| `GET /api/veiculos/categorias/list/{UF}/motos` | Lista por categoria (`vehicles: [{label, vehicles:[...]}]`). | 404 hoje |
| `GET /api/veiculos/list/{UF}/motos` | Lista simples (`vehicles:[...]`), usada até 15/11. Plano B automático se a anterior falhar. | 404 hoje |
| `GET /api/veiculo/plans/{UF}/{slug}` | Detalhe da moto: `plans[].name`, `documentation`, `options.withInsurance[]`/`noInsurance[]` com `numberInstallments`, `value`, `credit`, `contemplations`. O slug vem sempre da lista (nada inventado). | 404 hoje |

Não foi possível inspecionar quais outras requisições o site faz ao escolher região, plano, prazo ou seguro, porque o site não carrega. Fica pendente para quando voltar.

## Campos extraídos e guardados

- **Motos** (`honda_vehicles`, por UF+slug): id, slug, nome, categoria, tipo, cilindrada (`power`), foto, selo, crédito/parcela/prazo de referência da lista, JSON original da lista (`item_raw`) e do detalhe (`detalhe_raw` + `detalhe_hash`), URL, datas (primeira vez, visto, coletado, ausente desde), erro.
- **Planos por moto** (`honda_vehicle_plans`): nome original, chave normalizada, documentação incluída, crédito, JSON original do plano, hash.
- **Parcelas** (`honda_installments`): prazo, parcela com seguro, parcela sem seguro, crédito, contemplações, data.
- **Planos vistos** (`honda_plans`): prioridade 1 = `#voudeHonda+` (aceita também "Vou de Honda +"), 2 = `#voudeHonda`, 3 = `Advance`, 9 = outros. Os planos nunca se misturam (chave primária inclui o plano).
- **Por estado** (`honda_regions`): status, erro, última tentativa, última coleta boa, nº de motos/planos/parcelas, rota usada, JSON original da lista, hash da tabela.
- Não guardado porque a fonte não fornece (até onde se sabe): taxa administrativa, fundo de reserva e percentual do seguro separados. Se aparecerem no JSON, já ficam guardados no JSON original.

## Regras de segurança dos dados

- Tudo é validado **antes** de gravar. Não muda nada se: a lista vier vazia; vier com menos da metade das motos de antes; mais da metade dos detalhes vier sem `plans` (estrutura mudou); nenhum detalhe responder; o site estiver fora (a execução é cancelada na sonda).
- Moto cujo detalhe falha mantém os dados anteriores (marca `erro`). Moto que sai da lista é **desativada**, não apagada. Estado com menos de 80% dos detalhes não atualiza a data de "coleta boa".
- Os dados são sempre mostrados com a data da coleta; o painel avisa quando o estado não é lido há mais de 26 h.
- Coletor: timeout 20 s, 3 tentativas com espera crescente (~1,5 s, ~3 s; repete só 5xx/408/429/rede), no máximo 3 pedidos simultâneos, até ~100 s por chamada.
- Coleta só pelo servidor (função de borda + `x-cron-token` em `segredos.honda_sync_token`). Tabelas com RLS e sem acesso de `anon`/`authenticated`; o painel usa só `mestre_honda_painel/consulta/atualizar_agora` (exigem o dono).

## Detecção de alterações (`honda_price_history`)

Tipos: `parcela`, `parcela_sem_seguro`, `credito`, `contemplacoes`, `prazo_novo`, `prazo_removido`, `modelo_novo`, `modelo_saiu`, `modelo_voltou`, `plano_novo`, `plano_removido`, `plano_voltou`, `tabela_uf`, `primeira_coleta` (a 1ª leitura de um estado não gera alarmes por item).

## Agendamento

| Cron | Quando | O que faz |
|---|---|---|
| `honda_agendar` | `7 * * * *` (toda hora) | Se não há execução em andamento e nenhuma coleta boa nas últimas 7 h, cria uma execução (27 UFs: AC primeiro, depois AM/RO/RR, SP e o resto) e chama o coletor. Com o site fora, isso vira 1 consulta por hora; com o site no ar, ~3 coletas completas por dia. |
| `honda_passo` | `*/2 * * * *` | Reabre UF travada (6 min, até 3 tentativas), fecha execuções antigas e chama o coletor só quando há UF pendente. |

Botão **ATUALIZAR TABELAS AGORA**: Admin geral › Catálogo › 🗺️ Tabelas Honda (27 estados) → `mestre_honda_atualizar_agora()` (consulta real à fonte).

Avisos ao dono (Telegram/app): quando o site cai (uma vez), quando volta, e ao fim de uma execução com alterações ou estados com erro.

## Relatório das 27 regiões (17/11/2026)

Nenhuma região coletada: as 27 (AC, AL, AM, AP, BA, CE, DF, ES, GO, MA, MG, MS, MT, PA, PB, PE, PI, PR, RJ, RN, RO, RR, RS, SC, SE, SP, TO) estão como "sem coleta", porque a sonda inicial recebe 404 e cancela a execução. Não dá para confirmar agora se AC, AM, RO e RR têm tabela própria nem se SP difere do Acre. Quando o site voltar, a 1ª execução automática (até 1 h depois) preenche tudo e o painel mostra estado por estado.

## Testes feitos

1. Leitura de números no formato brasileiro (`1.323,66`, `23.083,00`, `R$ 2.072,81`, `349.67`).
2. Gravação de uma UF com 27 motos (valores reais do catálogo de 15/11), em transação desfeita: 149 parcelas, 3 planos, sem alarmes na 1ª coleta.
3. Mudança simulada: parcela 99x da CG 160 TITAN, prazo 12x removido da BIZ 125 ES, NX 500 saindo, moto nova entrando → 5 alterações registradas corretamente.
4. Falhas simuladas: lista vazia, estrutura mudada, lista pela metade → nada alterado (parcelas e valores iguais).
5. Coletor local (Node): lista por categorias e simples, repetição em 503, sem repetição em 404, HTML rejeitado, concorrência máxima 3.
6. **Coletor real contra o site oficial**: sonda recebeu 404, execução cancelada, nada alterado, conexão marcada "fora". Chamada sem chave: 401.
7. **Ponta a ponta com API simulada** (`testes/honda-api-simulada/`, só Acre, 4 motos): coletor leu categorias e detalhes, banco gravou 4 motos e 24 parcelas com valores exatos e JSON original; os outros 26 estados deram 404 e foram registrados como erro sem alterar nada. Dados de teste apagados depois.
8. Rotina agendada real (`honda_agendar`): criou a execução, detectou o site fora, cancelou. `honda_passo` rodando a cada 2 min sem erro.
9. Segurança: pela API pública sem login, painel e botão recusados (permissão negada); funções internas não expostas.
10. Tela no Chrome (1280 e 400 px) com dados simulados e com o site fora: sem erros de JS.

**Não testado** (depende do site voltar): respostas reais das 3 rotas, comparação com valores do site, campos exatos do `/api/site/consorcio/planos` e da rota de categorias, outras requisições do site, coleta real das 27 UFs.
