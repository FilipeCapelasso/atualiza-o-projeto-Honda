# Changelog (mais recente no topo)

## 2026-11-16 — Comercial: faixa "Você foi indicado por ..." só no link do parceiro

- **O que mudou:** a faixa aparecia em qualquer visita ao link padrão porque a indicação fica guardada 30 dias no navegador (`hn_ref2`). Agora a faixa só aparece quando o endereço aberto traz o parceiro (`/comercial/<slug>` ou `?ref=<slug>`), com o nome do parceiro. No link padrão não aparece. A indicação guardada continua valendo para creditar o parceiro na compra.
- **Arquivo:** `comercial/index.html`; espelho `apps/comercial` atualizado à mão. **Banco de dados:** não alterado.
- **Pendente:** se quiser, dá para também apagar a indicação guardada ao abrir o link padrão (hoje o crédito ao parceiro dura 30 dias).

## 2026-11-16 — Preço à vista por vendedor: campo rápido em "Minhas motos" + sincronização da promoção

- **O que mudou:** (1) no admin do vendedor, cada moto em "Minhas motos" ganhou o campo "À vista R$" com botão Salvar (aceita 16490, 16.490 ou 16490,50; vazio remove). Grava em `motos.preco`, que a vitrine já exibe como "À vista" no catálogo e no detalhe. O campo dentro de "Editar" continua existindo. (2) Sincronizados os preços da promoção Black Friday (`ofertas.preco_por`) em `motos.preco` das 8 motos de cada um dos 36 vendedores do Acre (288 motos), só onde não havia preço à vista (nenhum tinha). O vendedor pode alterar ou apagar depois.
- **Arquivo:** `VITRINE/vitrine.html`; espelho `apps/vitrine` atualizado à mão. **Banco de dados:** alterado — migration `sincroniza_preco_avista_promocao_acre` (UPDATE de dados em `motos.preco`, sem mudança de estrutura).
- **Pendente:** a sincronização foi pontual (não acompanha mudanças futuras da promoção nem vendedores novos do Acre); outros estados não receberam preço. Confirmar no celular real.

## 2026-11-16 — Vitrine: revertida a mudança "preço BF fora do catálogo" (a pedido)

- **O que mudou:** cancelado o commit 90be3b9 (preço Black Friday só no carrossel/card BF). A vitrine voltou exatamente ao estado anterior (397cf89, conteúdo idêntico).
- **Arquivo:** `VITRINE/vitrine.html`; espelho `apps/vitrine` atualizado à mão. **Banco de dados:** não alterado.
- **Pendente:** nada.

## 2026-11-16 — Vitrine: preço Black Friday só no carrossel e no card BF (fora do catálogo)

- **O que mudou:** os preços promocionais (só à vista, só Acre) apareciam também nos cards do catálogo e no detalhe da moto. Agora aparecem somente no carrossel do topo e no card "Aproveitar oferta"; catálogo e detalhe mostram só consórcio/preço normal. `ofM(m,bf)` só devolve oferta BF quando chamado pelo carrossel/card BF. Auditoria geral (advisors, erros, testes de borda) sem outros bugs.
- **Arquivo:** `VITRINE/vitrine.html` (commit 90be3b9); espelho `apps/vitrine` atualizado à mão. **Banco de dados:** não alterado.
- **Pendente:** confirmar no celular real; KUROMI fora da promoção (não está no catálogo).

## 2026-11-16 — Vitrine: deslizar o dedo troca a moto do carrossel do topo

- **O que mudou:** no celular, passar o dedo para o lado na foto ou na descrição do card do topo muda a moto (esquerda = próxima, direita = anterior, volta ao começo/fim). Funciona para o carrossel normal e para o da Black Friday. Rolar a página para cima/baixo continua normal; a troca automática pausa enquanto o dedo está na tela. Os pontinhos continuam funcionando.
- **Arquivo:** `VITRINE/vitrine.html`; espelho `apps/vitrine` atualizado à mão. **Banco de dados:** não alterado.
- **Pendente:** testado com toque simulado; confirmar no celular real.

## 2026-11-16 — Card Black Friday: botão X sempre visível no celular

- **O que mudou:** no celular o card da promoção usava a altura total da tela (com a barra de endereço do navegador), e o topo com o X ficava escondido. Agora a altura usa a área realmente visível (`dvh`), então o cabeçalho com o X fica sempre à vista, mesmo rolando o card. Tocar fora do card ou apertar Esc também fecha.
- **Arquivo:** `VITRINE/vitrine.html`; espelho `apps/vitrine` atualizado à mão. **Banco de dados:** não alterado.
- **Pendente:** testado em navegador simulado; confirmar no celular.

## 2026-11-16 — Black Friday: preços à vista, card próprio e preço por região

- **O que mudou:** os preços da promoção Black Friday são só à vista (marcados "à vista"; a linha "ou consórcio" some nesses cards). "Aproveitar oferta" no carrossel agora abre um card próprio (não o detalhe da moto) com foto, cores (tocar na cor troca a foto quando há foto daquela cor), valor promocional à vista (De/Por), brindes, preço à vista de cada uma das 3 regiões/endereços do Acre (Rio Branco e Cruzeiro do Sul; Interior do Acre e Boca do Acre com endereço de Rio Branco; Boca do Acre com endereço de Boca do Acre), aviso de região e o botão "Tenho interesse", que abre o WhatsApp do vendedor com a moto, a cor escolhida e o valor, e grava um lead (tipo `contato`). No detalhe normal da moto, o bloco da promoção ganhou o botão "Ver cores e preços por região".
- **Banco de dados:** alterado (migration `promocao_black_friday_regioes`): coluna `ofertas.precos_regiao` (3 valores por moto), chave `promo_bf_regioes` em `plataforma_config`, `config_publica` devolve os dois.
- **Arquivo:** `VITRINE/vitrine.html`; espelho `apps/vitrine` atualizado à mão.
- **Pendente:** BIZ 125 KUROMI continua fora (não existe no catálogo mestre). Os preços por região não têm tela de edição no admin geral (só pelo banco). Testado só em navegador simulado.

## 2026-11-16 — Promoção Black Friday (só Acre) no carrossel do topo + botão no admin geral

- **O que mudou:** reaproveitado o sistema de ofertas que já existia (aba Ofertas do admin geral e carrossel do topo da vitrine). Entraram 8 motos da tabela promocional Black Friday com "De R$ / Por R$" (preço de Rio Branco/Cruzeiro do Sul), foto e nome da moto, brindes (emplacamento total, capacete GOW, frete grátis, revisões e trocas de óleo) no detalhe da moto e o aviso "Consulte sua região, poderá haver alteração de valor conforme a região!" no carrossel e no detalhe. A diferença de preço entre regiões não é mostrada. Só aparece para vendedores com UF = AC (Star Motos, Acre Motos e Juruá); os demais estados não veem nada. Admin geral > Ofertas ganhou o card "Promoção Black Friday · só Acre" com botão Ligar/Desligar (desligado, tudo some dos sites na próxima abertura; dá para ligar de novo). Limite de 6 ofertas passou a contar só as ofertas comuns (a campanha tem 8).
- **Banco de dados:** alterado (migration `promocao_black_friday_acre`): `ofertas.campanha` e `ofertas.so_acre`; 8 linhas em `ofertas`; chaves `promo_bf_ativa`, `promo_bf_aviso`, `promo_bf_brindes` em `plataforma_config`; funções `config_publica`, `_oferta_salvar` e `mestre_ofertas` atualizadas; novas `mestre_promo_bf` e `mestre_promo_bf_ligar`.
- **Arquivos:** `VITRINE/vitrine.html`, `comercial/index.html` (painel embutido da aba Ofertas); espelhos atualizados à mão.
- **Pendente:** BIZ 125 KUROMI (R$ 21.990 por R$ 19.990) ficou de fora porque não existe no catálogo mestre; precisa ser cadastrada (com foto) para entrar. Os preços das outras regiões (interior/Boca do Acre) não foram guardados. Testado só em navegador simulado; deploy não verificado.

## 2026-11-15 — Financiamento: "Possui habilitação?" é a última pergunta e envia na hora

- **O que mudou:** na vitrine (formulário de financiamento) e na ficha CDC, a pergunta de habilitação fica por último e começa sem resposta marcada. Ao o cliente responder Sim ou Não, o site salva e leva ao WhatsApp do vendedor na hora (sem botão). Vitrine: campo vem em "Selecione", sem enviar se não responder. CDC: a pergunta passou para depois da entrada, e o aceite da Política de Privacidade subiu para antes dela (precisa estar marcado para o envio automático; se não estiver, aparece aviso e basta marcar e tocar de novo em Sim/Não). Chat da vitrine: a última pergunta de financiamento agora é "Você possui habilitação?" com Sim/Não.
- **Arquivos:** `VITRINE/vitrine.html`, `SITE-CDC/index.html`; espelhos atualizados à mão.
- **Banco de dados:** não alterado.
- **Validações:** navegador simulado (celular): vitrine e CDC enviam ao responder, sem resposta bloqueiam com aviso; sem erros de JavaScript. Sem teste no aparelho nem com o banco real.
- **Pendente:** SITE-CNH não foi alterado (a pergunta de habilitação é só do financiamento).

## 2026-11-15 — Correção de receita duplicada (Rodrigo Bastos) e webhook do WhatsApp

- **O que mudou:** apagada a receita manual duplicada id 7 (R$ 25, 31/10) do vendedor `bastoshonda`; ele pagou uma vez só, ficou a id 10 (27/10). Criada a Edge Function `wa-webhook` (verificação da Meta + status de entrega dos avisos) e a chave `wa_verify_token` em `config_privada`.
- **Por quê:** a diferença de R$ 50 entre faturamento do mês e do ano vinha dos dois lançamentos de outubro; o usuário confirmou que foi um pagamento só. O webhook é pedido pela etapa de produção do WhatsApp da Meta.
- **Banco de dados:** alterado (1 linha apagada em `receitas`; 1 linha em `config_privada`; função `wa-webhook` publicada). Nenhum site alterado.
- **Pendente:** aviso automático por WhatsApp (3 avisos) parado: a conta da Meta está restrita até a verificação da empresa (CNPJ/MEI); o usuário vai decidir. Segredos `WA_TOKEN`/`WA_PHONE_ID` ainda não configurados; 30 avisos antigos na fila `aviso_wa_fila` (status `aguardando_config`) devem ser descartados antes de ligar.

## 2026-11-15 — Ao concluir qualquer cadastro, o cliente vai sozinho ao WhatsApp do vendedor

- **O que mudou:** ao terminar o preenchimento, o site salva os dados (espera até 2,5 s) e leva o cliente ao WhatsApp do vendedor na mesma aba, sem botão, no celular e no computador, com a mensagem pronta contendo todos os dados informados. Vale para: ficha CDC (`SITE-CDC`), pré-contrato CNH (`SITE-CNH`), formulário de financiamento da vitrine e conversa (chat) da vitrine, que já fazia isso. Se o navegador não abrir sozinho, aparece um botão de reserva. Se o banco falhar, os dados ficam na fila de reenvio e o cliente também vai ao WhatsApp com a mensagem completa.
- **Vitrine, financiamento:** retirada a pergunta "cor da moto" (formulário e chat quando a modalidade é financiamento; no chat, quem escolhe a modalidade depois da moto também não vê a cor se escolher financiamento). O nome passou a ser pedido uma vez só, como "nome e sobrenome" (o chat não pergunta mais "nome completo" depois).
- **Arquivos alterados:** `VITRINE/vitrine.html`, `SITE-CDC/index.html`, `SITE-CNH/index.html`. Espelhos `apps/vitrine`, `apps/site-cdc` e `apps/site-cnh` atualizados à mão.
- **Banco de dados:** não alterado.
- **Validações:** navegador simulado (celular): formulário e chat de financiamento da vitrine, CDC e CNH levam ao link do WhatsApp com a mensagem; sem erros de JavaScript. Não testado com o banco real nem no aparelho (abertura do app do WhatsApp). Deploy não verificado.
- **Pendente:** os botões soltos de WhatsApp (ex.: repasse de consórcio) continuam sendo botões, pois não têm formulário. Termo e site comercial não foram alterados.

## 2026-11-15 — Ficha CDC mais rápida: 6 perguntas

- **O que mudou:** a ficha de financiamento (`/:slug/cdc`) passou a pedir só: nome e sobrenome, CPF, data de nascimento, telefone do titular, se o titular tem CNH (Sim/Não) e se tem valor de entrada (Sim/Não; se Sim, abre o campo "Quanto"). Emojis nos rótulos. Textos agora dizem "6 informações".
- **Entrada:** guardada na coluna `entrada` (texto) das fichas e leads: o valor (ex.: "R$ 3.500,00") ou "Sem entrada". A pergunta é obrigatória.
- **Arquivos alterados:** `SITE-CDC/index.html`. Espelho `apps/site-cdc/` atualizado à mão (commit 433c16f), pois a Action ainda não tinha espelhado.
- **Banco de dados:** não alterado.
- **Validações:** navegador simulado (celular e computador), caminhos Sim e Não gravam a ficha com a entrada certa, sem erros de JavaScript. Teste com o banco real não feito. Deploy não verificado.

## 2026-11-15 — Site comercial: indicação que "grudava" e botões de contato

- **Causa:** o código do parceiro (`hn_ref`) ficava salvo para sempre no navegador. Quem abriu uma vez o link de um parceiro (por exemplo, em teste) via "Você foi indicado por ..." em todas as visitas seguintes, e o pedido também carregava essa indicação.
- **Correção:** a indicação agora é salva com data (`hn_ref2`) e vale 30 dias. O valor antigo `hn_ref` é descartado. Efeito colateral: quem tinha entrado por um link de parceiro antes desta mudança perde a indicação ao voltar sem o link.
- **Novo:** botões WhatsApp (68 97400-5458) e Instagram (@_capelasso_) no rodapé do site comercial.
- **Arquivos alterados:** `comercial/index.html`. Espelho `apps/comercial/` atualizado à mão (commit 2833272).
- **Banco de dados:** não alterado.
- **Validações:** navegador simulado (computador e celular): indicação antiga some, indicação nova funciona, indicação com mais de 30 dias expira. Deploy não verificado.

## 2026-11-15 — Ordem dos vendedores exibidos no site comercial

- **O que mudou:** nova seção "Vendedores no site comercial" em Configurações do admin geral, com lista para arrastar (ou usar setas e "levar ao topo") e botão "Salvar ordem". Mostra quais ficam visíveis de início (8 primeiros do Acre).
- **Banco de dados (alterado):** coluna `ps_destaques.ordem` (int, nula = ordem antiga por data); `ps_publico()` agora ordena os destaques por `ordem` (nulos por último) e depois `updated_at`; `ps_admin_destaques()` devolve `ordem` e `upd`; nova função `mestre_destaques_ordem(uuid[])` (só o dono; anon sem acesso). Migration `destaques_ordem_site_comercial`.
- **Arquivos alterados:** `comercial/index.html`. Espelho `apps/comercial/` atualizado à mão (commit 2a16b7c).
- **Regra do site:** o Acre aparece antes; a ordem vale dentro de cada estado. Quem ainda não tem ordem salva continua pela data, depois de quem tem.
- **Validações:** navegador simulado (claro e escuro, computador e celular); salvar ordem não testado com o banco real. Deploy não verificado.

## 2026-11-15 — Gerência geral: tema claro como padrão e botão de tema

- **Causa:** pedido do dono para usar o tema branco e deixar o escuro de lado.
- **Arquivos alterados:** `comercial/index.html` (visual claro com a mesma estrutura de menu lateral e gráficos; o escuro virou opcional pela classe `dk`; botão "Tema escuro/claro" no topo, escolha salva no navegador em `hn_tema`; as telas de Catálogo/Ofertas/Pedidos seguem o tema ao recarregar). Espelho `apps/comercial/` atualizado à mão (commit 43fe10c).
- **Banco de dados:** não alterado.
- **Validações executadas:** navegador simulado a 1366 px e 390 px nos dois temas, sem erros de JavaScript.
- **Pendente:** conferir no painel real as abas Catálogo, Ofertas e Pedidos de clientes no tema claro; deploy não verificado.

## 2026-11-15 — Dashboard: meta em tema escuro, datas do gráfico e visão por loja

- **Causa:** cartões da "Meta de vendedores" ficavam brancos (regra antiga `.meta-g div`); as datas do gráfico apareciam como texto ISO completo (o banco devolve data com hora); vendedores com concessionária própria (Victor e Daniel) caíam em "Sem loja definida" porque a visão por loja só olhava as lojas cadastradas.
- **Arquivos alterados:** `comercial/index.html` (CSS dos cartões da meta; `lxDia` usa só os 10 primeiros caracteres; `lojasV30` agrupa quem não tem loja pelo nome da concessionária e só deixa "Sem loja definida" para quem não tem nenhuma; grade de números em 4 colunas, 8 em telas muito largas). Espelho `apps/comercial/` atualizado à mão (commit 08f381c).
- **Banco de dados:** não alterado.
- **Validações executadas:** navegador simulado a 1366 px, sem erros de JavaScript e sem fundos claros. O agrupamento por concessionária não foi visto com dados reais (a simulação não tem vendedor com concessionária).
- **Deploy:** Vercel pela `main`; não verificado.

## 2026-11-15 — Gerência geral: largura total, realce da linha e celular

- **Causa:** o painel ficava preso à esquerda em telas largas (container com largura máxima) e a linha da tabela de vendedores ficava branca ao passar o mouse (regra antiga `tr.rw:hover td` com fundo claro).
- **Arquivos alterados:** `comercial/index.html` (container do admin com 100% da largura e menu lateral proporcional; realce dourado escuro na linha; ações rápidas em linha com rolagem e alvos de toque de 44 px no celular). Espelho `apps/comercial/` atualizado à mão (commit c93fe65).
- **Banco de dados:** não alterado.
- **Validações executadas:** navegador simulado a 2400 px e 390 px, sem erros de JavaScript e sem fundos claros.
- **Deploy:** Vercel pela `main`; não verificado.

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
