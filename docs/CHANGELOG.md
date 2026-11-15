# Changelog (mais recente no topo)

## 2026-11-15 — Gerência geral: tema escuro premium, menu lateral e gráficos

- **Objetivo:** redesenhar todo o painel do dono (escuro, vermelho Honda e dourado), com menu lateral no computador, barra inferior no celular e painel de receita com gráficos reais.
- **Arquivos alterados:** `comercial/index.html` (camada CSS v44 sob `#adm#adm`, `body.adm-on #ov` e `#cmd` para janelas e busca rápida; abas agrupadas em Gestão, Vitrine e Sistema com rótulo curto no celular; `heroRev`, `lxArea`, `lxBars`, `lxTip`; mini-admin embutido de catálogo/ofertas/pedidos passou a usar o modo escuro que já existia no código dele, ligado ao trocar `(prefers-color-scheme:none)` por `all` em `agSrc`; cartões de faturamento do mês e do ano saíram da grade e foram para o painel de receita). Espelho `apps/comercial/` atualizado à mão (commit 09348d6).
- **Banco de dados:** ALTERADO (função nova, só leitura) — migration `mestre_series_dashboard`: `mestre_series(p_dias)` devolve receita por dia, novos vendedores por dia, receita por mês e por origem; só o dono acessa (`eh_dono()`), `anon` sem permissão. Nenhum dado foi alterado.
- **Validações executadas:** navegador simulado a 1366 px e 390 px em todas as abas, ficha do vendedor, busca rápida e login: auditoria automática de fundos claros sem sobras e sem erros de JavaScript. Não testado com login real do dono nem com o mini-admin carregado com dados reais (no teste ele respondeu erro de permissão simulado).
- **Pendências:** conferir no site real depois do deploy (Ctrl+F5); abas de catálogo/ofertas/pedidos de clientes em modo escuro só vistas sem dados.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-15 — Dashboard: faixa "Vendedores por plano" e pedido pendente zerado

- **Objetivo:** mostrar abaixo dos cartões quantos vendedores há por plano (mensal, 2 meses, 6 meses, anual), sócios e parceiros; zerar o contador de pedidos pendentes.
- **Arquivos alterados:** `comercial/index.html` (função `planosFaixa`, CSS `.pf`; o plano é calculado pela duração real da assinatura, então Walter, que pagou R$ 50 por 63 dias, entra em "2 meses"). Espelho `apps/comercial/` atualizado à mão (commit 266b366).
- **Banco de dados:** dado alterado, sem mudar estrutura: pedido `a3c06be2…` (marcos, R$ 25, aguardando) passou a `cancelado`; era duplicado, o pedido seguinte do mesmo vendedor já estava aprovado.
- **Observação:** "Faturamento do ano" (R$ 1.090) é R$ 50 maior que o do mês (R$ 1.040) por 2 receitas manuais de R$ 25 de Rodrigo Bastos em 27 e 31/10. Nada foi apagado; aguardando decisão do dono.
- **Validações executadas:** navegador simulado: faixa renderizada, abas do admin sem erro de JavaScript.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Mapa 3D: concessionárias ligadas aos vendedores, automático

- **Banco de dados:** ALTERADO (aprovado pelo dono) — migration `mapa_concessionarias_vinculo_automatico`: colunas `honda_concessionarias.conc_id` e `loja_id`; endereços, telefones e coordenadas (nível da rua, Nominatim) de Cometa Motocenter (Manaus) e Moto Formosa Matriz (Formosa-GO); gatilho `tg_hconc_auto` em `concessionarias` e `lojas` cria o registro no mapa sozinho (sem derrubar o cadastro se falhar); `mestre_mapa` localiza o vendedor pela cidade da concessionária dele e conta vendedores por concessionária. Nenhum arquivo de site alterado.
- **Validações executadas:** `mestre_mapa`: 38 de 38 vendedores com cidade (Victor em Manaus, Daniel em Formosa); concessionárias com 23, 7, 6, 1 e 1 vendedores; gatilho testado com concessionária fictícia (criou 1 registro; teste desfeito).
- **Pendências:** as 5 concessionárias continuam "não verificadas" na fonte oficial da Honda.

## 2026-11-14 — Mapa 3D: visual mais realista e pino de concessionária

- **Objetivo:** concessionária como pino com casa (vermelho = verificada, preto = não verificada); visual mais realista.
- **Arquivos alterados:** `comercial/index.html` (ícone desenhado no canvas; satélite ligado por padrão com rótulos; fundo de espaço e atmosfera no globo; prédios 3D da OpenMapTiles a partir do zoom 14 com botão "Prédios 3D"; brilho nos vendedores ativos; relevo 1,8×; contornos e siglas claros sobre o satélite; botão "Localizar pelo endereço" no cadastro de concessionária, via Nominatim/OpenStreetMap); `comercial/vercel.json` e `vitrine/vercel.json` (CSP: `nominatim.openstreetmap.org` em connect-src). Espelhos atualizados à mão.
- **Banco de dados:** NÃO alterado nesta etapa. PENDENTE (aguardando aprovação do dono no Supabase): migration `mapa_concessionarias_vinculo_automatico` — endereços de Cometa Motocenter (Av. Max Teixeira, 1604 - Flores, Manaus, (92) 3632-7000) e Moto Formosa Matriz (Av. Tancredo Neves, 980 - Setor Bosque, Formosa-GO, (61) 3631-0918), vínculo concessionária↔loja/concessionária do vendedor, criação automática no mapa para cada concessionária ou loja nova, e vendedor localizado pela cidade da concessionária dele.
- **Validações executadas:** navegador simulado com a CSP de produção, globo, satélite, prédios e pino conferidos em imagem; sem erros de JavaScript.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Mapa 3D: worker servido pelo próprio site

- **Causa:** em produção o worker do MapLibre vindo do jsDelivr falhava ("Worker failed to load") por causa da CSP; o mapa não terminava de carregar.
- **Arquivos alterados:** `comercial/maplibre-gl-worker-6.18.0.mjs` (novo, cópia oficial da versão 6.18.0, licença BSD-3) e `comercial/index.html` (`setWorkerUrl` apontando para o próprio site; aviso se o mapa demorar mais de 30 s). Espelho `apps/comercial/` atualizado à mão.
- **Regra:** ao trocar a versão do MapLibre (`ML_V`), trocar também o arquivo do worker com a MESMA versão.
- **Banco de dados:** não alterado.
- **Validações executadas:** página real `www.sitevendedor.com/comercial/` com a CSP de produção: globo, satélite, relevo e limites dos estados carregados sem bloqueio; teste local com a mesma CSP e o admin simulado completo sem erros.
- **Deploy:** Vercel pela `main`; worker conferido em produção (200, application/javascript).

## 2026-11-14 — Admin geral: aba Brasil vira mapa 3D

- **Objetivo:** trocar o mapa plano (SVG) por um mapa 3D navegável com vendedores, concessionárias, mapa de calor e tabela sincronizada.
- **Tecnologia:** MapLibre GL JS 6.18.0 (WebGL, código aberto BSD-3, sem chave), carregado do jsDelivr só quando a aba abre. Globo com atmosfera, relevo 3D (Terrain Tiles da Mapzen na AWS Open Data, formato terrarium), sombreamento, fundo cartográfico OpenFreeMap "positron" (OpenStreetMap, gratuito, sem chave) e satélite Sentinel-2 cloudless 2016 da EOX (CC BY 4.0). Mapbox e Cesium não foram usados: exigem conta/chave e têm custo por uso; Three.js exigiria reconstruir um motor de mapas.
- **Arquivos alterados:** `comercial/index.html` (módulo v43: `brMount`, `brMapa`, `brLayers`, `brDados`, tabela, painel do estado, cadastro de concessionárias; o mapa antigo virou `brasilSvg` e é mostrado se o WebGL ou a internet falhar; ícones das abas Brasil e Parceiros); `comercial/br-uf.json` (novo, 240 KB: limites dos 27 estados simplificados com mapshaper, fonte IBGE via giuliano-oliveira/geodata-br-states, MIT); `comercial/vercel.json` e `vitrine/vercel.json` (CSP: `worker-src blob:`, `style-src` e `connect-src` para jsdelivr, OpenFreeMap, relevo AWS e EOX). Espelhos `apps/` atualizados à mão.
- **Banco de dados:** ALTERADO — migrations `mapa_brasil_base`, `mapa_brasil_funcoes`, `mapa_cidade_endereco_regex`: tabela `municipios` (5.571 municípios com coordenadas, IBGE via kelvins/municipios-brasileiros, MIT, carregada por `net.http_get`); tabela `honda_concessionarias` (nome, endereço, cidade, UF, lat/lon, precisão, telefone, site, fonte, verificada, verificado_em; RLS sem política, só por funções); funções `mestre_mapa` (só dono), `mestre_hconc_salvar`, `mestre_hconc_excluir`, `municipio_coord`, `_chave_cidade`, `_cidade_do_endereco`. Nenhum dado de vendedor foi alterado.
- **Como o vendedor é localizado:** cidade do cadastro de compra (customers.city) ou cidade do endereço da loja dele; ponto no centro da cidade (IBGE), espalhado em volta para não sobrepor, sempre marcado como "posição aproximada". Sem cidade: conta no estado, sem ponto. Hoje: 36 de 38 localizados (Rio Branco e Cruzeiro do Sul); Victor (AM) e Daniel (GO) sem cidade.
- **Concessionárias:** 5 cadastradas, TODAS "não verificadas". Star Motos e Acre Motos com coordenada do endereço (Nominatim/OSM), Juruá Motocenter no nível da rua, Cometa e Motoformosa sem endereço (não aparecem no mapa). A rede Honda oficial NÃO foi importada: o localizador oficial não oferece dados abertos; há cadastro, "marcar no mapa", "centro da cidade" e importação por lista para completar e verificar.
- **Validações executadas:** Chrome sem interface com WebGL (SwiftShader) e tiles reais: globo, relevo, agrupamento, calor, colunas, satélite, troca globo/regional, seleção de estado pela tabela e pelo mapa, cartões de vendedor e concessionária, voltar à aba sem recriar o mapa; 1366 px e 390 px; todas as outras abas do admin abertas em sequência sem erro de JavaScript. CSP conferida em produção (cabeçalhos de `/`, `/comercial/` e `sitevendedor.vercel.app`). Não testado com login real do dono.
- **Pendências e riscos:** depende dos serviços gratuitos OpenFreeMap, AWS Terrain Tiles e EOX; sem internet ou WebGL aparece o mapa simples. Atualiza sozinho a cada 60 s com a aba aberta.
- **Deploy:** Vercel pela `main`; arquivos novos conferidos em produção.

## 2026-11-14 — Parceiro: dias extras agora funcionam mesmo sem assinatura prévia

- **Objetivo:** conferir o fluxo de compra por link de parceiro. Teste no banco (revertido) com pedido de `ref=daniel`: ativação ok, indicação registrada, mas o parceiro não tinha assinatura e os +5 dias se perdiam.
- **Banco de dados:** ALTERADO — migration `parceiro_creditar_cria_assinatura`: se o parceiro não tem assinatura, cria uma sem cobrança (vence em 5 dias); se já tem, soma 5 dias a partir do maior entre o vencimento e agora. Parceiro continua sem suspensão por vencimento. Nenhum arquivo de site alterado.
- **Validações executadas:** simulação no banco: pedido → `pagamento_aprovado`, 1 indicação, assinatura criada com vencimento em 5 dias, parceiro não suspenso. NÃO testado: o Pix real no Mercado Pago e o aviso automático de pagamento.
- **Deploy:** só banco.

## 2026-11-14 — Aba Parceiros: frase do acordo ao lado do título

- **Objetivo:** mostrar "Não pagam nada · +5 dias por indicado que compra · 10 indicados = R$ 50 · 20 = R$ 150" junto do título, para tirar print e mostrar aos parceiros.
- **Arquivos alterados:** `comercial/index.html` (só o cabeçalho da aba Parceiros). Espelho `apps/comercial/` atualizado à mão.
- **Banco de dados:** não alterado.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Parceiro: link bonito `/comercial/<nome>`

- **Objetivo:** o link `.../comercial/?ref=nome` dava 404. Agora o link do parceiro é `https://www.sitevendedor.com/comercial/<endereço-do-parceiro>`.
- **Causa:** o roteador (`vitrine/vercel.json`) não tratava `/comercial/` com barra final nem `/comercial/<nome>`.
- **Arquivos alterados:** `vitrine/vercel.json` (duas regras novas: `/comercial/` e `/comercial/:slug` → site comercial com `?ref=`); `comercial/index.html` (lê o parceiro do caminho ou de `?ref=`, mostra a faixa "Você foi indicado por …", link gerado na aba Parceiros no novo formato). Espelhos `apps/vitrine/` e `apps/comercial/` atualizados à mão.
- **Banco de dados:** ALTERADO — migration `parceiro_nome_publico` (função `parceiro_nome`, devolve só o nome de um parceiro ativo).
- **Validações executadas:** em produção, `/comercial/daniel`, `/comercial/?ref=daniel` e `/comercial` respondem 200 com a página nova. Compra real com indicação não testada.
- **Pendências e riscos:** um endereço de parceiro inexistente abre o site normal sem faixa e sem crédito.
- **Deploy:** Vercel pela `main`; resposta 200 conferida.

## 2026-11-14 — Admin geral: aba Brasil e programa Parceiro

- **Objetivo:** (1) ver no mapa do Brasil quantos vendedores há em cada estado; (2) nova categoria de vendedor "Parceiro": não paga, indica outros vendedores por um link e ganha dias e prêmios.
- **Regra do acordo (como foi implementada):** cada vendedor indicado que COMPRA pela primeira vez dá +5 dias na assinatura do parceiro; 10 indicados = R$ 50 (uma vez); 20 indicados = R$ 150 (uma vez, além dos R$ 50). Cada vendedor só conta para um parceiro e só na primeira compra. Parceiro não é suspenso por vencimento e não entra na conta de pagantes. Os prêmios em dinheiro são só registrados; o pagamento é feito por fora e marcado como pago na aba.
- **Arquivos alterados:** `comercial/index.html` (abas Brasil e Parceiros; botão "Marcar como parceiro" na ficha do vendedor; grupo/filtro Parceiros; `?ref=` do link vira `ref` no pedido). Espelho `apps/comercial/` atualizado à mão.
- **Banco de dados:** ALTERADO — migration `programa_parceiro`: `vendedores.tipo` aceita `parceiro`; tabelas `parceiro_indicacoes` e `parceiro_premios` (RLS ligada, sem política: só por funções); funções `parceiro_creditar` (chamada dentro de `ps_ativar`, com proteção para nunca derrubar a ativação), `mestre_parceiros`, `mestre_premio_pagar`, `parceiro_resumo`, `mestre_vendedor_tipo` (aceita parceiro); `ps_criar_pedido` guarda `ref` em `orders.dados`; `ps_expirar` ignora parceiros; `mestre_meta` trata parceiro como sócio.
- **Validações executadas:** simulação no banco com 11 indicados (revertida): 11 indicações, 1 prêmio (R$ 50), +55 dias, repetir o mesmo pedido não conta em dobro. Telas conferidas em navegador simulado, sem erros. Não testado com compra real.
- **Pendências e riscos:** o parceiro ainda não tem painel próprio com as contas dele (a função `parceiro_resumo` já existe). Se o parceiro não tiver assinatura cadastrada, os dias não têm onde ser somados (a indicação é registrada mesmo assim). Link: `<site comercial>/?ref=<endereço do parceiro>`.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Admin geral: abas voltam a funcionar + dono escolhe a loja de cada vendedor

- **Objetivo:** abas Catálogo/Ofertas/Pedidos de clientes davam "permission denied"; e o dono precisa corrigir a loja de vendedores que digitaram errado.
- **Causa:** o mini-painel embutido (iframe) usava a chave de login padrão, diferente da do site comercial (`sb-comercial-auth`), então chegava sem sessão do dono.
- **Arquivos alterados:** `comercial/index.html` (`agSrc` passa a usar a mesma chave de login; detecção de sessão expirada que leva à tela de login; seletor "Loja" no modal do vendedor lista todas as concessionárias). Espelho `apps/comercial/` atualizado à mão (commit eb4be9f).
- **Banco de dados:** ALTERADO — migration `vendedor_escolher_concessionaria_pelo_dono` (função `mestre_vendedor_concessionaria`, só o dono executa).
- **Pendências e riscos:** se a sessão do dono expirou, entrar de novo em /#admin. Não verificado em produção.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Painel do vendedor: cliente duplicado vira um card só

- **Objetivo:** o mesmo cliente aparecia em vários cards (contato, ficha CDC, pré-contrato CNH, chat, rascunho), uns com dados incompletos. Agora vira um card com os dados reunidos.
- **Arquivos alterados:** `vitrine/vitrine.html` (função `vdMerge`, `VRAW` guarda os registros originais; `VD` passa a ser a lista já reunida; ajustes em vdLoad, vdAplica, vdSt, vdFase, vdDel, filtros e contadores). Espelho `apps/vitrine/` atualizado à mão.
- **Regra:** mesma pessoa (últimos 9 dígitos do telefone ou CPF; sem os dois, mesmo nome) + mesma moto + cor igual ou vazia em um dos lados. Fica como principal o registro mais completo (CNH > CDC > chat > contato > rascunho); campos vazios são preenchidos com os dos outros. Cor ou moto diferentes continuam cards separados.
- **Banco de dados:** NÃO alterado. Nada é apagado nem unido no banco. Mudar a fase atualiza todos os registros do cliente; "Excluir" num card reunido apaga todos os registros dele (com aviso e contagem).
- **Validações executadas:** regra testada em script com os casos Ester, Lorranna, Alison (cores diferentes) e mesma pessoa com outra moto; card renderizado no navegador simulado, sem erros. Não testado com dados reais.
- **Pendências e riscos:** o aviso de novos clientes (contador) ainda conta registros brutos, então pode somar a mais por um instante. "Situação" muda só o registro principal.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Vitrine: ajustes visuais seguros (do prompt de melhoria visual)

- **Objetivo:** aplicar só o que do prompt de melhoria visual é seguro e real no código atual.
- **Arquivos alterados:** `vitrine/vitrine.html`: prazo do plano com mais de 1 ano passa a aparecer em anos/meses/dias (função `plcDur`, só exibição); dica dos vídeos vira "Toque para assistir" em telas de toque; CTAs do topo com altura mínima de 48px. Espelho `apps/vitrine/` atualizado à mão.
- **Banco de dados:** não alterado.
- **Validações executadas:** navegador simulado sem erros de console; conta de anos/meses/dias conferida em script (2026-11-14 até 2100-01-01 = 73 anos, 1 mês, 18 dias).
- **Pendências e riscos:** não feitos: 3D, conversão de imagens para AVIF/srcset, skeletons, agrupar cliente duplicado. Motivos na conversa com o dono (precisam de decisão ou infraestrutura que o projeto não tem).
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Motoformosa: logo para fundo escuro, sem caixa branca

- **Objetivo:** logo da concessionária no mesmo padrão visual da Star Motos (sem caixa branca, grande, sobre o fundo escuro do topo).
- **Arquivos alterados:** `vitrine/logo-motoformosa.png` (versão branca + vermelha, transparente), `vitrine/vitrine.html` (logos hospedadas como `/logo-*.png` ganham a classe `hlg-lim`: sem caixa, maiores, nome maior; outras logos continuam na caixa branca). Espelho `apps/vitrine/` atualizado à mão.
- **Banco de dados:** não alterado (a URL da logo continua a mesma).
- **Validações executadas:** navegador simulado, desktop e celular, sem erros de console. Não testado em produção.
- **Pendências e riscos:** a logo é cacheada pelo navegador; pode precisar de Ctrl+F5. Novas logos curadas devem seguir o padrão `/logo-<loja>.png` em versão para fundo escuro.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Logo automática por concessionária (Motoformosa)

- **Objetivo:** a logo da concessionária passa a ser colocada pelo sistema; o vendedor não envia mais logo. Logo da Motoformosa tratada (fundo removido, alta resolução) e aplicada a todos os vendedores dessa loja.
- **Arquivos alterados:** `vitrine/vitrine.html` (painel sem envio/remoção de logo; topo mostra o nome da concessionária mesmo sem logo; CSS da caixa da logo no celular), novo `vitrine/logo-motoformosa.png`. Espelho `apps/vitrine/` atualizado à mão.
- **Banco de dados:** ALTERADO. Migration `logo_concessionaria_automatica`: `tg_vendedor_concessionaria` copia sempre `concessionarias.logo_url` para o vendedor (não promove mais a logo do vendedor para a loja); `tg_guard_vendedores` impede o vendedor de alterar `concessionaria_logo`; `concessionarias.motoformosa.logo_url` apontando para `https://www.sitevendedor.com/logo-motoformosa.png`.
- **Como cadastrar a logo de uma nova concessionária:** colocar o PNG transparente na raiz do repositório vitrine e gravar a URL em `concessionarias.logo_url` (ou pelo admin geral). Os vendedores da loja herdam no próximo salvamento; para os já existentes, atualizar `vendedores.concessionaria_logo` da loja.
- **Validações executadas:** teste no navegador simulado (desktop e celular) com a logo; sem erros de console. Não testado em produção.
- **Pendências e riscos:** Cometa Motocenter ainda usa a logo enviada antes pelo vendedor (sem tratamento). Vendedores de lojas sem logo cadastrada mostram só o nome.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Comercial: vendedores por região e remoção de 2 seções

- **Objetivo:** no site comercial, listar os vendedores por região (Acre primeiro; ao expandir, as demais regiões) e retirar as seções "O que o seu cliente vê. E o que você controla." e "Do Pix ao site no ar, em três passos".
- **Arquivos alterados:** `comercial/index.html` (commits cdac624 e 264343b: sem a contagem ao lado do nome da região): seções removidas, `drawDest()` agrupa por região, novo CSS `v34-regioes`. Espelho `apps/comercial/` atualizado à mão.
- **Banco de dados:** ALTERADO. Migration `ps_publico_destaques_por_regiao`: a função `ps_publico()` agora devolve `uf` e `regiao` em cada item de `destaques` (vazio vira AC).
- **Validações executadas:** teste no navegador simulado (desktop e celular) com dados fictícios, sem erros de console. Não testado com dados reais em produção.
- **Pendências e riscos:** o segredo `HONDA_SYNC_TOKEN` não está configurado nos repositórios dos sites, então a GitHub Action não espelha nem registra o log. Enquanto isso o hub é atualizado à mão. O espelho do comercial estava parado no commit ec7ca63 até esta entrada.
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-14 — Log automático de todo push nos sites

- **Objetivo:** todo push em qualquer site passa a ser registrado sozinho no hub.
- **Arquivos alterados:** nos 5 repositórios de site, `.github/workflows/sync-honda.yml` foi substituído por `registrar-no-hub.yml` (roda em todo push na `main`; espelha `apps/<site>/` e escreve `docs/log/<site>.md`). No hub: `docs/log/README.md`, `docs/SYNC.md`, `docs/TRAINING_GUIDE.md` (regra para as contas), `README.md`.
- **Banco de dados:** não alterado. Mudanças no banco continuam manuais (changelog + DATABASE_RULES).
- **Validações executadas:** YAML dos 5 workflows validado; trecho que grava o log testado em repositório temporário (mensagens com crases, `$` e `&` saem corretas).
- **Pendências e riscos:** só funciona depois de criar o segredo `HONDA_SYNC_TOKEN` nos 5 repositórios. Não testado de ponta a ponta no GitHub (depende do segredo).
- **Deploy:** não verificado.

## 2026-11-14 — Inclusão do site Termo-Honda-Grupo-Star

- **Objetivo:** incluir o 5º site no hub.
- **Arquivos alterados:** hub (`README.md`, `PROJECT_CONTEXT.md`, `docs/*`, `apps/termo-star/`); no repo do termo: `CLAUDE.md` e `.github/workflows/sync-honda.yml`.
- **Sites/módulos afetados:** nenhum arquivo do site foi alterado.
- **Banco de dados:** não alterado (o site não usa banco).
- **Validações executadas:** YAML do workflow validado; conferido que o site não tem formulário nem chamadas externas.
- **Pendências e riscos:** mesmo segredo `HONDA_SYNC_TOKEN` necessário no repo do termo.
- **Deploy:** não verificado.

Formato definido em `Projeto_Honda_Repositorio_Mestre_Treinamento.md` (seção 8). Não preencher campos com suposição: usar "não verificado".

## 2026-11-14 — Hub de contexto e espelho dos sites

- **Objetivo:** permitir que duas (ou mais) contas Claude trabalhem no mesmo projeto sem refazer levantamento nem editar duas vezes.
- **Arquivos alterados:** `README.md`, `PROJECT_CONTEXT.md`, `docs/*`, `supabase/DATABASE_RULES.md`, `supabase/MIGRATIONS_APLICADAS.md`, `apps/*` (espelho). Nos 4 repositórios de site: `CLAUDE.md` e `.github/workflows/sync-honda.yml`.
- **Sites/módulos afetados:** nenhum arquivo de site (HTML/JS) foi alterado; apenas documentação e workflow adicionados.
- **Banco de dados:** não alterado (somente leitura).
- **Alterações realizadas:** inventário dos 5 repositórios e do Supabase; documentação; espelho de `index.html`/`vitrine.html` em `apps/`; Action de sincronização automática.
- **Validações executadas:** conferência dos tamanhos e commits de origem dos arquivos espelhados; validação de sintaxe YAML dos workflows.
- **Resultado:** documentação criada. Espelho automático só passa a funcionar depois que o segredo `HONDA_SYNC_TOKEN` for criado em cada repositório de site (ver `docs/SYNC.md`).
- **Pendências e riscos:** ver `docs/KNOWN_ISSUES.md`.
- **GitHub:** enviado para a `main` de cada repositório (ver commits).
- **Deploy:** Vercel redeploya os sites a cada push, mas o conteúdo servido não mudou (apenas arquivos novos de documentação); não verificado no painel.

## Linha do tempo anterior (resumida a partir das migrations do banco)

- **2026-10-29 a 11-01:** base multi-vendedor, links por slug, plataforma de vendas (planos/pedidos), personalização do site por vendedor, limites de mídia por plano, isolamento entre vendedores.
- **2026-11-02 a 11-05:** votações, atualizações para vendedores, contagem anônima de visitas, aviso no Telegram quando a atualização de valores falha, plano único, catálogo com fonte oficial (consórcio Honda), apresentação do "patrão".
- **2026-11-07 a 11-10:** lojas/logos globais, domínio único para os links, app de vendedores com push, fotos por cor, ofertas no topo da vitrine, dados completos de consórcio, débito automático, frase do dia.
- **2026-11-11 a 11-12:** regiões de preço (A/B), expansão fora do Acre, categoria de vendedor (normal/alta), endurecimento de segurança das funções, avisos de WhatsApp.
- **2026-11-13 a 11-14:** simulações de consórcio/CDC, região de preço do vendedor, visitas v2, checkout com senha escolhida, auditoria de segurança/desempenho, registro de erros do front, reconhecimento de concessionárias.

Últimos commits dos sites antes desta data: comercial `ec7ca63` (admin geral agrupado por concessionária, com UF e busca); VITRINE `10b1f7e` (logo + nome da concessionária no topo para vendedores de fora do Acre); SITE-CNH `5b91a09`; SITE-CDC `0b2469b`.
