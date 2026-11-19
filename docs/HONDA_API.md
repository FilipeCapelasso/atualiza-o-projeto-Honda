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
| `honda_agendar` | `25 12,20 * * *` (07:25 e 15:25 Rio Branco, desde 19/11) | Se não há execução em andamento e nenhuma coleta boa nas últimas 7 h, cria uma execução (27 UFs: AC primeiro, depois AM/RO/RR, SP e o resto) e chama o coletor. |
| `honda_regioes_aplicar` | ao fim da coleta + `45 12,20 * * *` | Aplica a **região B** (tabela de SP) em `catalogo_planos_regiao` só onde o valor mudou, reaplica nos vendedores da região B e confere que cada um dos 27 estados tem exatamente a tabela da sua região (`hash_tabela`); estado diferente → aviso ao dono e contratação pausada nele. A região A continua vindo de `site_sync_*`/`cnh_aplicar` (07:00 e 15:00). |
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

## Situação em 19/11/2026: site oficial voltou

- Coletor leu as 27 UFs com sucesso (execução 41, 18/11 22:07 Rio Branco): 28 motos, 3 planos, 249 parcelas por estado.
- As tabelas formam exatamente 2 grupos (mesmo `hash_tabela`): **AC, AM, RO, RR** = região A; **os outros 23** = região B (referência SP). Bate com `ufs.regiao_preco`.
- Comparação com o sistema: região B idêntica; região A idêntica exceto CG 160 FAN 24x (oficial 1204,78; sistema 1204,79 desde o ajuste manual de 18/11). Corrige sozinha na leitura das 07:00.
- O site não envia `ETag`/`Last-Modified` nem avisa mudanças: é preciso ler para saber. Ler não grava nada; só o que mudou é gravado.
- A tabela própria da Cometa (COMETA-AM) bate com a oficial do AM nos prazos em comum.

## Fonte secundária: o que foi testado em 19/11/2026

Testes reais feitos pelo banco (`pg_net`), com a fonte oficial no ar. Nenhum cabeçalho falso e nenhum desvio de bloqueio.

| Candidata | Resultado |
|---|---|
| `hondaservicosfinanceiros.com.br` (com e sem `www`) | **200 nas 4 rotas** (`planos`, `categorias`, `lista`, `detalhe`), conteúdo **idêntico byte a byte** ao oficial (mesmo MD5). Porém os cabeçalhos mostram a **mesma infraestrutura** (nginx + Varnish + Imperva): numa queda geral cai junto — foi o que aconteceu em 17/11. Serve contra falha de um host só (DNS, certificado, regra de WAF por host), não contra queda do serviço. |
| `acqstg.consorcionacionalhonda.com.br` e `acqdev.…` | 404 "Web Site Not Found". Só servem PDFs estáticos antigos (regulamentos). Não têm a API. |
| `api.consorcionacionalhonda.com.br` | O nome não existe (DNS não resolve). |
| `consorciohonda.com.br` | 200, mas devolve o HTML do site nas rotas `/api/...`. Não serve como API. |
| CDN `d138k0nccc9zty.cloudfront.net/api/...` | 403 (AccessDenied). A CDN só entrega arquivos estáticos, não a API. |
| `sitemap.xml` e payload do Nuxt (`_payload.json`) | 404. Não há cópia estática da tabela. |
| Wayback Machine (`archive.org`) | Nenhum snapshot das rotas da API. |
| Dados abertos do Banco Central (`dadosabertos.bcb.gov.br`, 81 conjuntos com "consórcio") | Só estatísticas agregadas (cotas ativas por região, administradoras, filiais). **Não existe tabela de preço por modelo/região.** Não serve como fonte de preço. |
| `honda.com.br` (preço da moto) | Akamai responde **403 ao IP do banco**, com e sem User-Agent identificado. Mas a Edge Function `fotos-honda` lê o site normalmente (última leitura boa em 18/11): é alcançável **pelo runtime das funções**, não pelo `pg_net`. Infraestrutura **independente** do site do consórcio (Akamai vs Imperva). |

## A tabela regional é calculável (validado)

A tabela de cada região é derivável do **crédito (preço da moto)** mais uma tabela de percentuais. Os percentuais **não variam por região** — só o crédito varia.

```
parcela_sem_seguro = arredonda( credito × (1 + taxa[plano, prazo, grupo do modelo]) ÷ prazo , 2 )
parcela_com_seguro = arredonda( parcela_sem_seguro × (1 + seguro[prazo]) , 2 )
```

**Validação:** aplicando os percentuais de SP ao crédito de cada UF e comparando com as **6.723 parcelas reais das 27 UFs**: erro máximo **R$ 0,01**, nenhuma linha acima de 1 centavo.

`#voudeHonda` (igual para todo modelo e toda UF) e `Advance`:

| Prazo | 12 | 18 | 24 | 36 | 48 | 60 | 72 (Advance) | 80 | 99 |
|---|---|---|---|---|---|---|---|---|---|
| Taxa | 21,5% | 22% | 22,5% | 24,5% | 25,5% | 27% | 21% | 30% | 35% |

Seguro (igual nos dois planos): 12 → 0,346% · 18 → 0,519% · 24 → 0,692% · 36 → 1,039% · 48 e 72 → 1,442% · 60 → 1,731% · 80 → 2,308% · 99 → 2,856%.

`#voudeHonda+` tem **3 faixas por modelo** (a faixa é do modelo, não da região); diferenças de 0,01 pp são só arredondamento:

| Faixa (modelos em 19/11) | 12 | 18 | 24 | 36 | 48 | 60 | 80 | 99 |
|---|---|---|---|---|---|---|---|---|
| BIZ 125 ES/EX, CG 160 FAN ESDI, CG 160 START, ELITE 125 | 32,43% | 32,98% | 33,53% | 35,70% | 36,79% | 38,43% | 41,70% | 47,15% |
| CG 160 TITAN, HONDA ADV, NXR 160 BROS ABS/CBS, PCX STD ABS/CBS | 31,22% | 31,76% | 32,30% | 34,46% | 35,54% | 37,16% | 40,40% | 45,80% |
| CB300F TWISTER ABS, SAHARA 300 ABS/ADVENTURE, XR 300L TORNADO, XRE 190 | — | — | 30,46% | 32,59% | 33,66% | 35,26% | 38,45% | 43,77% |

**Importante:** esses percentuais valem para a leitura de 19/11/2026. A Honda pode mudá-los. Por isso a regra é **recalcular a tabela de percentuais a cada coleta boa** (sai de graça dos dados que já chegam) e nunca deixá-la fixa no código.

## Espelho interno que já existe

O banco já guarda o JSON original da **última coleta boa**: `honda_regions.lista_raw` (27 UFs) e `honda_vehicles.detalhe_raw` (756 motos). Em falha nada é apagado, então o sistema já continua com a última tabela boa. O que **não** existe é um arquivo datado (só a versão mais recente é mantida, sobrescrita a cada coleta) nem um caminho para atualizar a tabela enquanto a fonte está fora.

## Fonte secundária: busca ampliada em 19/11/2026 (manhã)

Testes reais com a fonte principal no ar, por três saídas de rede diferentes (banco via `pg_net`, estação de análise e navegador), sem cabeçalho falso e sem desvio de bloqueio.

### Candidatas testadas agora

| Candidata | Resultado |
|---|---|
| `www.hondaservicosfinanceiros.com.br` | **200** nas rotas `planos` e `detalhe` (reconfirmado hoje). Mesmo JSON do host principal. Mesma infraestrutura (Imperva): serve como **segundo host**, não como fonte independente. |
| `clientes.consorcionacionalhonda.com.br` | Existe e está no ar, mas responde **503** (página do Imperva) às rotas da API e à home quando chamado pelo banco. Área do cliente, não tem a tabela. |
| `sistemas.consorcionacionalhonda.com.br` | **DNS não resolve mais** (só aparece em PDFs antigos indexados). |
| `www2.consorcionacionalhonda.com.br` | DNS resolve (AWS, 54.232.236.14), mas o balanceador responde **503 "Access prohibited"**. |
| `api.honda.com.br` | Existe (mesmo IP Imperva do site do consórcio) e é um roteador de API: responde **404 "Could not route request"** em todos os caminhos testados. Nenhuma rota pública de preços. Mesma infraestrutura. |
| `www.honda.com.br` | **403 (Akamai) para o IP do banco**; alcançável pelo runtime das Edge Functions (a `fotos-honda` usa). Publica só o **Preço Público Sugerido nacional (referência SP/DF)**, que **não é o crédito do consórcio**: a diferença AC↔SP dos créditos vai de −0,16% a −1,03% e **não é proporção fixa**, então não dá para derivar a região A a partir da região B. |
| `acqstg.…` / `acqdev.…` | Confirmado de novo: só PDFs estáticos antigos; `404` nas rotas da API e até no PDF de regulamento que estava indexado. |
| Regulamento oficial em PDF (`/sites/default/files/.../regulamento_ago24.pdf`) | **200, 827 KB**, baixado e lido. Cita a "Planilha de Consórcio I" (taxa de administração e fundo de reserva por prazo e modelo), mas **a planilha não sai em texto** nessa versão e o documento é de 2024, anterior aos planos atuais. Não serve como fonte automática de parcela. |
| `/api/site/consorcio/planos` (JSON oficial, 151 campos lidos um a um) | **Não traz percentual algum** (nem taxa de administração, nem fundo de reserva, nem seguro). Só textos e imagens da tela. O detalhe da moto também não: os campos são `credit`, `numberInstallments`, `value`, `contemplations`, `planoID`, `noInsurance`. |

### Conclusão

**Não existe segunda fonte oficial que publique a tabela regional do consórcio.** Todo endereço Honda que tem a tabela está atrás da mesma porta de entrada (Imperva). O que existe, e foi confirmado hoje, é **mais de um caminho até a mesma fonte oficial** — o que protege contra bloqueio por IP (o que aconteceu em 16/11), e não contra queda geral (17/11).

### Fórmula reconferida contra a API oficial em 19/11/2026

`parcela = arredonda( arredonda(credito × (1 + taxa) ÷ prazo, 2) × (1 + seguro), 2 )`

| Caso | Oficial | Calculado | Diferença |
|---|---|---|---|
| AC · CG 160 TITAN · #voudeHonda+ · 99x | 349,67 | 349,66 | −0,01 |
| AC · CRF 300F · #voudeHonda · 99x | 370,99 | 370,98 | −0,01 |
| SP · XRE 190 · #voudeHonda+ · 99x | 396,85 | 396,83 | −0,02 |

Diferença de 1 a 2 centavos (arredondamento do percentual). Serve para conferir e para completar modelo novo, **não** para substituir a leitura.

### Planos por modelo: #voudeHonda+ não cobre tudo

Lido na API oficial em 19/11/2026:

| Modelo | Planos que a Honda publica |
|---|---|
| CG 160 TITAN (e os outros 15 modelos) | `#voudeHonda` **e** `#voudeHonda+` |
| **POP 110i ES** e **POP 110i ES +10%** | **só `#voudeHonda`** (12 a 80 meses) |
| **CRF 300F** | **só `#voudeHonda`** (24 a 99 meses) |

No catálogo do sistema, POP e CRF 300F estão com `plano_fonte = #voudeHonda`, de acordo com a fonte. A CRF 250F já está com tabela marcada `"estimado": true`.

A faixa de percentual do `#voudeHonda+` é **por modelo**, e POP 110i e CRF 300F não estão em nenhuma faixa publicada. Dá para calcular por semelhança (a CRF 300F tem exatamente os mesmos prazos da faixa de 300 cc; a POP, os da faixa de 125 cc), mas isso é **suposição**, não dado oficial: precisa de confirmação da administradora antes de ir para a tela do cliente.
