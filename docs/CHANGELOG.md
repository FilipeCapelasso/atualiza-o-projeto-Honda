# Changelog (mais recente no topo)

## 2026-11-17 — Painel do vendedor: nova aba "Sorteio" (cotas sorteadas pela Loteria Federal)

- **Pesquisa (resumo):** no consórcio, uma das formas de contemplação é o sorteio mensal na assembleia do grupo, baseado na Loteria Federal (extrações às quartas e sábados). Cada cliente tem uma cota; usa-se os últimos 2, 3 ou 4 algarismos do 1º prêmio (dezena/centena/milhar, conforme o tamanho do grupo). Se a cota sorteada não existe, já foi contemplada, está cancelada ou em atraso, busca-se a próxima acima e abaixo, alternando. Só concorre quem está em dia. Quando o número passa do tamanho do grupo cada administradora trata de um jeito. **Regra exata do Consórcio Nacional Honda por grupo: não confirmada** (o regulamento Honda encontrado é de uma promoção de capitalização, não do consórcio). A ferramenta avisa isso na tela.
- **Aba Sorteio (vitrine):** texto "como funciona"; **calculadora** (5 prêmios da extração + participantes do grupo + algarismos) que mostra a cota sorteada, os candidatos por prêmio, e a **fila de busca** (857, 858, 856, 859…); **cotas dos clientes** (nome, WhatsApp, moto, grupo, cota, participantes, situação ativa/contemplada/cancelada) com marcação "é a cota sorteada" / "Na frente: Nª da fila" e botão de WhatsApp; **resultados salvos** por data. A conferência é só uma ajuda: quem confirma é a administradora.
- **Avisos automáticos:** quartas e sábados, às 14h (Brasília) "Hoje tem Loteria Federal" e às 19h40 "Confira o resultado", só para quem tem cotas ativas (tipo de aviso `sorteio`, entra pelo `app_push_enviar`, respeita as preferências de aviso).
- **Banco de dados: alterado.** Migration `sorteio_loteria_cotas` (20261117145036): tabelas `cotas_consorcio` e `lf_resultados` (RLS ligado, políticas por `pode_gerir(vendedor_id)`, só `authenticated`), função `lf_aviso(text)` (sem execute para ninguém) e crons `lf_aviso_dia` (`0 17 * * 3,6` UTC) e `lf_aviso_resultado` (`40 22 * * 3,6` UTC).
- **Testado:** cálculo em exemplos de manuais de administradoras (1º prêmio 18.857 → cota 857; 2.000 participantes usa o milhar; 000 → última cota), tela no Chrome (computador e 400 px). Não testado: o aviso do cron em dia de sorteio real, e uso por vendedor real.
- **Arquivo:** `vitrine/vitrine.html` (commit 52ad4bd). Espelho atualizado.
- **Pendente:** 1) o resultado da Loteria Federal é digitado pelo vendedor: a API da Caixa respondeu 403 (bloqueio) quando o banco tentou ler, e não foi contornada; decidir se usa outra fonte autorizada; 2) confirmar com o responsável a regra de sorteio do Consórcio Honda por grupo (algarismos, o que fazer se passar do tamanho do grupo); 3) aviso automático de "cota na frente" depende de ter o resultado no banco; 4) aba Sorteio não aparece no modo app (só Clientes/Notificações/Personalizar/Configuração).

## 2026-11-17 — Vitrine: nome do vendedor saindo da tela no celular (Richardson e outros)

- **Erro:** no celular, quando o vendedor tem **subtítulo** ou **selo** personalizado no topo (ex.: Richardson), esse texto caía na 1ª coluna da grade do topo e a esticava até quase a tela toda; o nome e a bio ficavam numa coluna de 0 px, empurrados para fora (só aparecia um "R" na borda).
- **Correção:** `.hero .hin.hin>.hsub,.hero .hin.hin>.hbd{grid-column:1/-1}` (bloco `<style id="vfp">`). Vale para todos os vendedores; os sem subtítulo/selo não mudam. Reproduzido e conferido no Chrome (400 px) com os dados reais do Richardson.
- **Banco de dados:** não alterado (lido: `vendedores` e `vendedor_custom` do `richardson`).
- **Arquivo:** `vitrine/vitrine.html` (commit b7bb992). Espelho atualizado.
- **Pendente:** o subtítulo aparece no fim do topo (depois dos números) no celular; se quiser, dá para subir para logo abaixo do título. A barra inferior escura já estava no commit anterior (se ainda viu o botão "Ver motos" branco, era cache: recarregar).

## 2026-11-17 — Vitrine: tema preto redesenhado e motos sem fundo branco

- **Pedido:** quando o vendedor escolhe fundo preto, melhorar o design do site inteiro; motos com fundo branco (exemplo CRF 300F) quebravam a qualidade.
- **Fotos:** só 3 imagens do catálogo tinham fundo branco opaco (CRF 300F, FourTrax/quadriciclo e Biz 125 EX Azul). Recortadas e salvas como WebP com transparência em `vitrine/fx/` (`crf-300f`, `quadriciclo`, `biz-125-ex-azul`). `IMGA()` troca a foto pelo recorte quando o arquivo original é um desses (`FX_FOTO` → `fxU`); os dados no banco e o painel do vendedor continuam com a foto original (nada foi alterado no Supabase). Vale para todos os temas e para todos os vendedores que usam essas fotos.
- **Tema preto (`body.fpr`):** novo bloco `<style id="vfp">` no fim do `vitrine.html`: barra do topo escura translúcida, painel do card em destaque do hero escuro (era branco), cards com palco escuro sob a moto, modal de detalhes/consórcio/financiamento escuros (campos, planos, cores, links, caixa da foto) e barra inferior do celular (WhatsApp/Simular/Ver motos) escura. Tudo escopado em `html body.fpr`, então tema claro não muda.
- **Banco de dados:** não alterado.
- **Testado no Chrome (1280 e 400 px):** preto e claro, cards, hero, modal de detalhes, consórcio e financiamento; sem erros de JS. Não testado em celular real nem com outras fotos de vendedores reais.
- **Arquivos:** `vitrine/vitrine.html` + `vitrine/fx/*.webp` (commit d6dcfc2). Espelho atualizado (inclui `apps/vitrine/fx/`).
- **Pendente:** 1) a foto original da Biz 125 EX Azul tem só 534×350 px: o recorte ficou limpo mas pequeno (ideal subir uma foto maior); 2) fotos novas enviadas com fundo branco continuam brancas (recorte é manual; dá para fazer um recorte automático no envio, se quiser); 3) imagem de compartilhamento (`api/og.js`) e miniaturas do admin ainda usam a foto original; 4) as imagens `/fx/` têm cache de 1 ano: para trocar um recorte, mudar o nome do arquivo; 5) o Pix Automático (Asaas) segue aguardando resposta.

## 2026-11-17 — Mensal automático no cartão (Mercado Pago) para vendedor e supervisor

- **O que é:** o vendedor (R$ 25/mês, o plano único) ou o supervisor (vagas × valor por vaga) assina uma vez no Mercado Pago e o cartão é cobrado todo mês sozinho. Cada cobrança aprovada soma 31 dias e 20 horas ao que ainda falta (mesma regra do Pix), por isso não perde nenhum dia. O Pix de renovação e a compra de vagas por Pix continuam funcionando como antes.
- **Como funciona:** a pessoa toca em "Ativar mensal automático" (Início › Seu plano) ou "Assinar mensal no cartão" (painel do supervisor), é levada ao checkout do Mercado Pago (`/preapproval`, assinatura sem plano, `init_point`), confirma o cartão e volta. A tela confere sozinha a cada 4 s e mostra "ativado". Quando o plano ainda tem mais de 2 dias, a 1ª cobrança é marcada para 2 dias antes do vencimento (sem cobrar em dobro); senão cobra na hora.
- **Banco de dados: alterado.** Migration `assinatura_mensal_recorrente` (20261117123831): tabelas `assin_recorrente` (assinatura: tipo vendedor/supervisor, valor, status pendente/autorizada/pausada/cancelada/expirada, `mp_preapproval_id`, próxima cobrança, ciclos pagos, validade) e `assin_cobrancas` (histórico, 1 linha por ciclo, única por assinatura+ciclo); as duas com RLS ligado e sem acesso direto (nada para `anon`/`authenticated`). Funções `meu_mensal_status/criar/verificar/cancelar` e `sup_mensal_status/criar/verificar/cancelar` (só `authenticated`; o supervisor passa por `_sup_atual()`), internas `_rec_*`, `rec_checar`, `rec_reverificar` (sem execute para ninguém além do dono). `_sup_vagas` passou a somar as vagas das assinaturas com `valido_ate > now()` (chave nova `recorrentes`); `mp_webhook` ganhou o ramo de assinatura. Cron novo `rec_reverificar` (a cada minuto: assinaturas pendentes a cada ~1 min, ativas a cada 30 min ou perto da cobrança).
- **Crédito idempotente:** `rec_checar` consulta `GET /preapproval/{id}` e credita cada ciclo novo de `summarized.charged_quantity` (vendedor: cria um pedido `compra` marcado `recorrente` e roda `ps_ativar`, que prorroga a assinatura, tira a suspensão, grava a receita e credita o parceiro; supervisor: estende `valido_ate`). O Telegram do dono recebe cada nova assinatura, cobrança paga, cancelamento e cartão recusado; o vendedor recebe aviso no app. Se o Mercado Pago pausar/cancelar (cartão recusado 3 vezes), a assinatura muda de estado e o vendedor é avisado para assinar de novo ou renovar por Pix.
- **Função de borda:** `mp-webhook` v3 (também aceita ids de assinatura e repassa o tipo do aviso; ainda responde sempre 200). Cópia em `supabase/functions/mp-webhook/index.ts`.
- **Telas:** vitrine (Início › Seu plano: card "Mensal automático" com ativar/continuar/cancelar, próxima cobrança e histórico; o banner de "plano vence" some se o mensal está ativo) e supervisor (botão "Assinar mensal no cartão" ao lado do Pix, seção "Assinaturas mensais no cartão" com cancelar). Cancelar não perde o que já foi pago: o plano/vagas seguem até o fim do período.
- **Testado:** criação real de assinatura no Mercado Pago pela função do banco e cancelamento (nada cobrado, e-mail de teste neutro); crédito de ciclo do vendedor e do supervisor em transação revertida (dupla chamada não duplica, vencimento e `_sup_vagas` corretos); telas no Chrome (400 px) com dados simulados: ativar, confirmar, cancelar. **Não testado:** uma cobrança real de cartão.
- **Arquivos:** `vitrine/vitrine.html`, `vitrine/supervisor.html` (commit 7e056e4). Espelho atualizado.
- **Pendente:** 1) na 1ª cobrança real, conferir se `charged_quantity` conta só cobranças aprovadas (todo crédito avisa o dono no Telegram, então dá para estornar manualmente se algo vier errado); 2) ativar no painel do Mercado Pago os avisos de "Planos e assinaturas" (o sistema já confere por cron, o aviso só acelera); 3) o plano mudou de valor depois da assinatura? A cobrança segue o valor contratado: refazer a assinatura; 4) painel do dono (mestre) ainda não lista as assinaturas mensais; 5) Pix Automático ficou fora de propósito (escolha do dono: cartão).

## 2026-11-17 — App do vendedor: ícone v2, ficha do cliente, botão Apagar nas notificações

- **Ícone:** os arquivos viraram `app-honda2-*.png` (o Android guardava o antigo por 1 ano). O ícone "adaptável" (`maskable`) agora também é só a asa vermelha da Honda com fundo transparente. O "V" que o vendedor via na tela inicial era a instalação antiga: precisa desinstalar e instalar de novo. iPhone continua com fundo branco (a Apple não aceita transparência).
- **Notificações:** botão **🗑 Apagar tudo** (zera a lista e fecha os avisos que estão na central do celular) e **✕** em cada aviso. "Ver cliente" abre a ficha do cliente do aviso. **Testar aviso** agora dispara em 5 segundos (dá tempo de sair do app e ver o banner).
- **Banner flutuante:** o envio já é urgente (`Urgency: high`, `requireInteraction`, vibração, `silent:false`), mas quem mostra o banner no topo é o Android por app/canal. Em Configuração → App e avisos há o passo a passo (Xiaomi: Notificações flutuantes; outros: categoria Urgente). Não dá para forçar pelo site.
- **Clientes:** cartão compacto (nome, moto, fase, situação, modalidade, WhatsApp/Ligar/Mensagem). Tocando abre a **ficha do cliente** (folha que sobe): atalhos WhatsApp/Ligar/Mensagem, fase e situação, calculadora, barra de campos preenchidos e dados em grupos (Contato, Dados pessoais, Endereço, Trabalho e renda, Banco, Proposta) com toque para copiar cada campo; copiar tudo e excluir no rodapé.
- **Banco de dados:** alterado. Migration `app_limpar_notificacoes` (função `app_limpar_notificacoes(p_ids bigint[] default null)`, security definer, só apaga as notificações do próprio vendedor logado; execute só para `authenticated`).
- **Testado no Chrome (celular 400px):** ficha abre, troca de fase com a ficha aberta, fecha; apagar um aviso e apagar tudo. Não testado em celular real.
- **Arquivos:** `vitrine/vitrine.html`, `sw.js`, `app.webmanifest`, `app-honda2-*.png` (commit 511517e). Espelho atualizado.
- **Pendente:** conferir no celular real o ícone transparente (o launcher da Xiaomi pode desenhar o próprio fundo) e o banner; WhatsApp automático para o vendedor segue dependendo de escolher o provedor.

## 2026-11-16 — App do vendedor: ícone Honda, modo app focado e aviso animado dentro do painel

- **Ícone:** asa da Honda (tirada do logo vetorial que já está no `comercial`, sem o texto HONDA, que fica ilegível em ícone pequeno). Fundo transparente nos ícones do app, da notificação e do computador. No Android a tela inicial coloca o ícone num fundo branco (`app-honda-maskable-512.png`); no iPhone o fundo é branco porque o iOS pinta de preto o que é transparente. Selo da barra de status com a silhueta da asa. Arquivos renomeados para `app-honda-*.png` (as imagens ficam 1 ano em cache, então nome novo garante que todos vejam o ícone novo).
- **Modo app:** aberto pelo ícone instalado (ou com `?app=1`), o painel mostra só **Clientes, Notificações, Personalizar e Configuração** e abre direto em Clientes. Pelo navegador o painel continua completo, agora com a aba Notificações também. Atalhos no ícone: Clientes e Notificações.
- **Aba Notificações (nova):** histórico dos avisos agrupado por dia (Hoje, Ontem...), filtros Todas/Não lidas/Começou/Finalizou/Parou, foto da moto, botão WhatsApp do cliente, marcar como lidas, contador no menu, testar aviso e **quais avisos receber** (começou, finalizou, cliente preguiçoso; som e vibração por aparelho).
- **Aviso animado dentro do painel:** cartão que desce do topo com efeito de mola, ícone animado (sino balançando, ✅ surgindo, 😴 flutuando) e ondas, foto da moto entrando de lado, barra de tempo (pausa ao passar o mouse), som curto e vibração. Funciona **com o painel aberto no navegador**, mesmo sem ter ativado as notificações do sistema: chega pelo Supabase Realtime (`app_notificacoes`) e pelo service worker, sem repetir o mesmo aviso. Com o painel na tela, o Android/computador não mostra também a notificação do sistema (no iPhone mostra sempre, exigência da Apple). Respeita "reduzir movimento".
- **Notificação do sistema:** agora com a **foto da moto** (imagem grande no Android/computador).
- **Banco de dados:** alterado. Migration `avisos_foto_moto_e_pref_preguicoso` (`app_push_enviar` acha a foto da moto citada no aviso; `app_prefs_ler/salvar` aceitam `preguicoso`). Função `web-push` v3 (manda a foto). **Arquivos:** `vitrine/vitrine.html`, `sw.js`, `app.webmanifest`, `app-honda-*.png` (e0b3779); espelho atualizado.
- **Testado no Chrome:** menu com 4 itens no modo app, aba Notificações, aviso animado, sem duplicar, push com o painel na tela vira cartão animado (sem notificação do sistema), instalação sem erros no endereço real. **Falta:** teste no celular real.

## 2026-11-16 — App do vendedor instalável + avisos na hora (Web Push, sem Firebase e sem Expo)

- **O que é:** o painel `/nome/admin` agora instala como app no Android (Chrome → "Instalar app"), no iPhone (Safari → Compartilhar → "Adicionar à Tela de Início", iOS 16.4+) e no computador. O ícone se chama **Meu Painel**. Os avisos chegam com o app fechado, pelo serviço de avisos do próprio navegador (Google/Apple). Não precisa de console do Firebase, expo.dev nem chave nenhuma.
- **Avisos (regras novas):** (1) **✍️ começou a preencher**: assim que o cliente preenche o 1º dado (chat, ficha de financiamento, ficha CDC, pré-contrato CNH); (2) **✅ finalizou**: quando termina; (3) **😴 cliente preguiçoso**: 3 minutos sem mexer e sem terminar (um aviso por cliente, rotina `aviso_preguicosos` a cada minuto). Saiu o aviso intermediário "cliente começou o chat" (ao dar o celular) e os avisos "continua preenchendo". Telegram do vendedor e do dono continua como era (nome + celular, uma vez).
- **Toque no aviso:** no Android/computador abre o **WhatsApp do cliente** com a mensagem pronta ("Olá, Fulano! Aqui é ... Vi que você começou a simulação da BIZ 125..."); botões "Chamar no WhatsApp" e "Abrir painel". No iPhone abre o painel na aba Clientes com a barra verde "Chamar o cliente no WhatsApp". Avisos do mesmo cliente se substituem (não lotam a barra).
- **Painel:** Configuração → **📲 App e avisos** (instalar, ativar, enviar teste mostrando se chegou de verdade, dicas de bateria Xiaomi/Samsung/Motorola, lista de aparelhos com remover). Cartão no Início para quem ainda não ativou. Ao abrir o painel, a inscrição é renovada sozinha e o contador do ícone é zerado.
- **Envio:** Edge Function `web-push` (criptografia RFC 8291 + VAPID feita com WebCrypto, sem bibliotecas). Chaves VAPID geradas pela própria função e guardadas só em `config_privada`; pública em `plataforma_config.webpush_publica` e no `vitrine.html`. **Não trocar a chave**: todos os aparelhos teriam de ativar de novo. Inscrições que o Google/Apple dizem não existir mais (404/410) são apagadas sozinhas. O app Expo antigo continua recebendo pelo mesmo `app_push_enviar`.
- **Testado:** criptografia conferida contra a biblioteca de referência `http_ece`; inscrição real do Chrome recebeu 201 do Google pelos 3 avisos do banco (começou, parou, finalizou); notificações, botões, link do WhatsApp e "o aviso chegou" testados no Chrome; no endereço real o Chrome aceita instalar sem nenhum erro. **Falta:** confirmar num celular de verdade (Android e iPhone).
- **WhatsApp automático para o vendedor:** a fila `aviso_wa_fila`/função `aviso-whatsapp` existe, mas segue parada (64 avisos em `aguardando_config`) porque mandar mensagem de WhatsApp sozinho exige a API oficial da Meta (`WA_TOKEN`, `WA_PHONE_ID`, modelo aprovado) ou um serviço pago de envio. Não mexido.
- **Banco de dados:** alterado. Migrations `web_push_vendedor`, `avisos_primeiro_dado_final_preguicoso`, `web_push_servicos_google`; tabela `push_inscricoes`; colunas `rascunhos.preguica_em`, `rascunhos.tg_avisado`; funções `app_push_enviar` (Web Push), `_rascunho_notificar`, `tg_app_push`, `aviso_preguicosos`, `_wa_cliente`, `_onde_rascunho`, `meu_push_inscrever/remover/status/teste`; cron `aviso_preguicosos` (`* * * * *`). **Arquivos:** `vitrine/vitrine.html`, `sw.js`, `vercel.json` (rota `/:slug/app.webmanifest`), `app.webmanifest`, ícones `app-icon-*.png`, `app-badge.png` (4cfb3c0); espelho atualizado.
- **Pendente:** teste no celular real; opcional: preferências por tipo de aviso na tela; WhatsApp automático depende de decidir o provedor.

## 2026-11-16 — Vitrine: chat não repete a modalidade quando o cliente vem do "Simular consórcio"

- **O que mudou:** no detalhe da moto, a tabela de consórcio tem o botão "Simular e preencher meus dados". Ele abria o chat e, depois do nome e do WhatsApp, o chat perguntava "Qual modalidade de pagamento você prefere?", mesmo o cliente já tendo escolhido consórcio. Agora o botão abre o chat já com Consórcio escolhido (`chatOpen(null, id, 'consorcio')`, que usa o `pagPre` que o chat já tinha) e a pergunta de modalidade é pulada: nome → WhatsApp → cor → parcela do consórcio. Os outros caminhos (botão geral "Fale comigo", "Quero financiamento" etc.) continuam como estavam.
- **Banco de dados:** não alterado. **Arquivo:** `vitrine/vitrine.html` (83e4ab3), espelho atualizado.
- **Pendente:** nada.

## 2026-11-16 — Revisão geral: pagamentos, painel do supervisor, gavetas por loja e limpeza

- **Pagamentos (correções):** (1) os pacotes de vagas do supervisor **não eram reverificados** pela rotina automática (só pelo painel aberto); `ps_reverificar` agora confere planos e pacotes a cada minuto nas primeiras 3 h e a cada 10 min até 25 h, e expira pacotes com mais de 25 h. (2) O Mercado Pago **nunca avisava** o sistema (o link de aviso tinha 279 caracteres, acima do limite de 250, e ia vazio). Criada a função `mp-webhook` (endereço curto, só repassa o id para `mp_webhook`, que consulta o próprio Mercado Pago antes de mudar algo); chave `mp_notify_url` em `plataforma_config`, usada por `ps_criar_pedido` e `sup_comprar`. Testado: aviso registrado e Pix novo saindo com o endereço. (3) Ao pagar vagas, o dono recebe aviso no Telegram (`_sup_checar`). Conferência: 32 pedidos de plano aprovados, nenhum preso; Pix do André Zanes (13 vagas, R$ 260) segue pendente no Mercado Pago.
- **Faturamento:** o ano somava R$ 25 de um lançamento manual com data 27/10; a pedido do dono a data foi corrigida para novembro (`receitas.id=10`, `pago_em` = data do cadastro, 04/11). Mês e ano: R$ 1.065.
- **Admin geral:** aba Vendedores com **gavetas por loja/concessionária** (fechadas; toque abre/fecha; busca abre tudo; botões "Abrir todas"/"Fechar todas"); etiqueta de estado legível no tema claro. Supervisores em **cartão largo** (dados | local e vagas | ações) a partir de 1000 px. Aba **"Pedidos dos vendedores" removida** (menu, busca Ctrl K e contador).
- **Painel do vendedor (vitrine):** chat "Pedido especial ao moderador" removido do Personalizar (abas Cores e Detalhes). Mensagens do banco que mandavam ao "Pedido especial" agora indicam o WhatsApp do administrador (`meu_renovar_orcamento`, `meu_upgrade_orcamento`).
- **Painel do supervisor (`/nome/supervisor`):** visual novo: cabeçalho com logo e local da concessionária, vagas desenhadas uma a uma, faixa de Pix pendente com "Ver Pix", compra com atalhos 1/5/10/25, lista de vendedores com busca, motos, "Copiar link" e "Enviar acesso" (WhatsApp sem senha), histórico em tabela. `sup_painel` passou a devolver local, UF, logo e motos por vendedor.
- **Erros:** os únicos erros registrados na semana vinham de extensões do navegador dos clientes; agora são ignorados no registro (vitrine e comercial).
- **Banco de dados:** alterado — migrations `pagamentos_reverificar_supervisor`, `sup_painel_local_motos`, `remove_ref_pedido_especial`, `mp_notify_url_curta`; função Edge `mp-webhook`; `receitas.id=10`. **Arquivos:** `comercial/index.html` (34b44cf), `vitrine/vitrine.html` e `vitrine/supervisor.html` (bc927d9); espelhos atualizados.
- **Pendente:** funções do chat antigo (`meu_pedido_enviar`, `mestre_pedidos_*`) e a tabela `vendedor_mensagens` ficaram no banco sem uso (histórico preservado); tabela "sem emplacamento" segue sem fonte; avisos de segurança restantes são antigos e de baixo risco (funções protegidas por dentro).

## 2026-11-16 — Admin geral: aba Supervisores redesenhada

- **O que mudou:** a aba Supervisores seguiu o padrão visual do Dashboard (claro, escuro e celular): cabeçalho com atalho "Criar supervisor", 4 números-resumo (supervisores, vagas livres, vendedores criados, vagas vendidas), valor por vaga em cartão próprio, formulário de criação recolhível, busca (aparece com mais de 4 supervisores) e cartões com avatar, situação, local ("📍 Atua em"), barra de vagas em uso, link e ações. O ícone do menu que estava quebrado (quadrado cinza) foi corrigido.
- **Banco de dados:** não alterado. **Arquivo:** `comercial/index.html` (commit 3d9011b); espelho atualizado.
- **Pendente:** painel `/nome/supervisor` e demais abas do admin geral seguem como estavam (escopo escolhido: admin geral + Supervisores).

## 2026-11-16 — Supervisor: todas as lojas e concessionárias, local editável e sincronizado

- **O que mudou:** (1) "Criar supervisor" agora tem um único campo "Onde atua" com as lojas do Acre **e todas as concessionárias salvas**, agrupadas por estado (Cometa/AM, Mônaco/AP, Motoformosa/GO, Honda Freeway/PR), mais "Nova concessionária (digitar)" com estado. (2) Cada supervisor ganhou o seletor "📍 Atua em" na aba Supervisores, e **os vendedores dele acompanham** automaticamente (estado, loja/concessionária, logo e tabela de preços). (3) Na lista de vendedores, trocar loja/concessionária agora ajusta o estado junto (antes mudava só o nome).
- **Banco de dados:** alterado — funções `mestre_vendedor_local`, `mestre_supervisor_sincronizar`, `_sup_herdar` e gatilho `tg_sup_regiao` em `vendedores` (migrations `supervisor_sincroniza_regiao`, `mestre_vendedor_local`). Testado com reversão: supervisor → Mônaco/AP, Star/AC e Motoformosa/GO; o vendedor filho seguiu cada mudança (31 motos reaplicadas em GO). **Arquivo:** `comercial/index.html` (commit c796969); espelho atualizado.
- **Pendente:** melhoria visual geral do admin geral e dos supervisores (aguardando definição de escopo).

## 2026-11-16 — Vitrine: botões Com/Sem emplacamento retirados por enquanto

- **O que mudou:** a mudança dos botões fora do Acre foi desfeita (revert do commit ecdc5ff): a vitrine voltou ao estado anterior, em que os botões só aparecem se a moto tiver a tabela "sem emplacamento" (`planos_alt`) preenchida. Hoje nenhuma tem, então não aparece botão em nenhuma região, e a linha "Com emplacamento · Simular com um plano →" voltou.
- **Banco de dados:** não alterado. **Arquivo:** `vitrine/vitrine.html`; espelho atualizado.
- **Pendente:** quando houver a tabela "sem emplacamento" (dados enviados ou site da Honda liberado), religar os botões nas regiões fora do Acre (com botão "Simular consórcio" abaixo da tabela) e gravar `planos_alt`.

## 2026-11-16 — Atualização dos dados da Honda: só 2x por dia (08h e 13h, horário do Acre)

- **O que mudou:** toda a rotina que lê o site da Honda (valores do consórcio, regiões, expansão, cores/lançamentos e fotos) agora roda só às **08:00** e **13:00** do Acre (13:00 e 18:00 UTC, que é o horário do agendador). Antes rodava 4x por dia (11, 15, 19 UTC e 21:30 UTC). Os agendamentos extras das 21:30 UTC foram **desativados, não apagados** (podem ser reativados).
- **Banco de dados:** alterado — agendamentos (`cron.job`): `site_sync_iniciar/planos/aplicar/retry/publicar`, `regiao_b_iniciar/aplicar`, `expansao_manter`, `catalogo_lancamento`, `catalogo_fotos_honda` em 13,18 UTC; os `_2` (ids 50–53, 57, 58, 60, 64) com `active=false`. **Sites:** sem alteração.
- **Pendente:** a Honda segue respondendo 403 à leitura; a 2ª tabela (sem emplacamento) ainda não é gravada.

## 2026-11-16 — Vitrine: botões Com/Sem emplacamento em todas as regiões (menos Acre)

- **O que mudou:** nos estados fora do Acre, os 2 botões "Com emplacamento" / "Sem emplacamento" agora aparecem sempre em cima da tabela, tanto em "Planos de consórcio" (página da moto) quanto em "Tabela de consórcio" (simulação). A linha "Com emplacamento · Simular com um plano →" saiu, e entrou o botão "Simular consórcio" abaixo da tabela. No Acre não há botões (só Com emplacamento). A parcela escolhida e a mensagem do WhatsApp/chat passam a seguir a tabela selecionada.
- **Banco de dados:** não alterado (colunas `planos_alt` e `emplacamento_alt` já existiam). **Arquivo:** `vitrine/vitrine.html`; espelho atualizado.
- **Pendente:** `planos_alt` está vazio em todas as motos, então "Sem emplacamento" mostra "valores sendo atualizados" (nada é inventado). O site da Honda segue com 403 (desde 11:10 UTC) e `cnh_aplicar`/`regiao_b_aplicar` ainda não gravam a 2ª tabela. Precisa dos valores (planilha/foto da tabela) ou do bloqueio liberado.

## 2026-11-16 — Criar supervisor com região e concessionária + auditoria de pagamento/geração de vendedores

- **O que mudou:** no admin geral (aba Supervisores), "Criar supervisor" agora pede o **estado**: Acre mostra a loja do grupo; outros estados mostram as **concessionárias já salvas** (nome + logo) ou "Outra (digitar o nome)". O supervisor já nasce com UF, nome, id e logo da concessionária, e os vendedores dele herdam isso.
- **Auditoria (testes com reversão):** Pix de 2 vagas gerado no Mercado Pago (R$ 40,00, R$ 20 por vaga); após "pago" saem 2 vagas, cria 2 vendedores (3º é recusado: sem vaga), vendedores herdam AM/Cometa Motocenter/logo, excluir devolve a vaga; usuário sem papel de supervisor recebe "Acesso restrito a supervisores."; `anon` sem EXECUTE em todas as funções `sup_*`/`mestre_sup*`/`_sup_*`.
- **Banco de dados:** alterado — função `mestre_supervisor_criar` (migration `mestre_supervisor_criar_regiao`; agora aceita `uf`, `loja`, `concessionaria_id`, `concessionaria`). **Arquivo:** `comercial/index.html` (commit 6a184e1); espelho atualizado.
- **Pendente:** vaga é pagamento único (sem renovação); tabelas Com/Sem emplacamento seguem vazias (API da Honda bloqueada); nota antiga na imagem do post (canvas) da vitrine.

## 2026-11-16 — Supervisor André Zanes em Manaus (Cometa Motocenter) e herança para os vendedores dele

- **O que mudou:** o vendedor/supervisor `andrezanes` (André zanes) passou de AC para **AM**, concessionária **Cometa Motocenter** (mesmo id e logo do vendedor Victor Nascimento), sem loja do Acre; as motos dele foram reaplicadas pela tabela da região. Todo vendedor criado por supervisor agora herda UF, nome, id e logo da concessionária do supervisor.
- **Banco de dados:** alterado — dados de `vendedores` (andrezanes) e função `sup_criar_vendedor` (migration `sup_criar_vendedor_herda_concessionaria`). Testado com reversão: filho criado saiu AM / Cometa Motocenter / logo / 31 motos. **Sites:** sem alteração de arquivo.
- **Pendente:** se mudar a concessionária do supervisor depois, os vendedores já criados não mudam sozinhos.

## 2026-11-16 — Supervisores: dados de acesso e envio por WhatsApp

- **O que mudou:** no admin geral (aba Supervisores), cada supervisor ganhou "🔑 Dados e enviar": mostra login, senha (guardada no cofre), site, painel de vendedor, painel de supervisor e WhatsApp; botão "Enviar dados no WhatsApp" (abre a conversa com o número do supervisor com a mensagem pronta), "Copiar tudo" e "Gerar nova senha". Também: criar supervisor agora recusa endereço/e-mail já em uso com mensagem clara e sugestão de endereço.
- **Banco de dados:** alterado — função `mestre_supervisor_criar` (validações; migration `mestre_supervisor_criar_valida`). **Arquivo:** `comercial/index.html`; espelho atualizado.
- **Pendente:** o envio é pelo WhatsApp do próprio admin (abre o link wa.me), não automático; o supervisor também pode ver os dados dele só pelo login (senha não é exibida a ele).

## 2026-11-16 — Supervisores (vagas de vendedores por Pix)

- **O que mudou:** novo papel de supervisor. No admin geral (COMERCIAL), aba **Supervisores**: define o valor por vendedor (pago uma vez por vaga), cria supervisor (ou transforma um vendedor existente), libera vagas manuais, desativa ou remove a função. O supervisor é um vendedor completo (site e painel próprios) e ganha `/nome/supervisor` (novo `supervisor.html` na VITRINE, rota e CSP no `vercel.json`): compra vagas por Pix (Mercado Pago, mesmo token do comercial), cria vendedores até o limite de vagas, edita nome e WhatsApp, suspende, gera nova senha e apaga (apagar devolve a vaga). Vendedores novos herdam a região/concessionária do supervisor. E-mail já cadastrado é recusado (não redefine senha de ninguém).
- **Banco de dados:** alterado — tabelas `supervisores`, `sup_vendedores`, `sup_pacotes`, `sup_config` (RLS ligado, sem acesso direto); funções `sup_*` (painel, comprar, verificar, criar/editar/excluir vendedor, senha) e `mestre_supervisor*`/`mestre_sup_preco` (só dono); `mp_webhook` agora também confirma pacotes de supervisor (fluxo dos pedidos intacto). Migration `supervisores_base`. Testado em transação com reversão.
- **Arquivos:** `VITRINE/supervisor.html`, `VITRINE/vercel.json`, `comercial/index.html`; espelhos atualizados.
- **Pendente:** definir o valor por vendedor (sem ele a compra fica bloqueada); vaga é paga uma única vez (sem renovação mensal); a rota usa o mesmo domínio dos vendedores (não `sitevendedor.com` separado); testar um Pix real de ponta a ponta.

## 2026-11-16 — Vitrine: aviso após a tabela do consórcio

- **O que mudou:** depois da tabela de parcelas (detalhe da moto e "Simular consórcio") aparece "Os valores podem sofrer alterações sem aviso prévio e estão sujeitos à atualização no site. Para confirmar o valor exato, entre em contato com um de nossos consultores." e, abaixo, "com Seguro de Vida em Grupo". Substitui as notas antigas.
- **Arquivo:** `VITRINE/vitrine.html`; espelho atualizado. **Banco de dados:** não alterado.
- **Pendente:** a imagem de postagem gerada pela vitrine (canvas) ainda usa a nota antiga.

## 2026-11-16 — Dados por site (vitrine básica, CDC completo) + Com/Sem emplacamento no consórcio

- **O que mudou:** (1) VITRINE: o consórcio no chat agora pede só nome e sobrenome + WhatsApp (a moto, cor e parcela vêm do que o cliente escolheu) e mostra o link do questionário completo (SITE-CNH); financiamento na vitrine continua com dados básicos. (2) SITE-CDC: formulário completo do financiamento restaurado (24 campos em 5 seções, validação, consentimento, envio por WhatsApp). (3) VITRINE: na tabela de consórcio (detalhe e "Simular consórcio") aparecem os botões "Com emplacamento" (#voudeHonda+) e "Sem emplacamento" (#voudeHonda) quando a moto tem a tabela alternativa; sem ela, nada muda.
- **Banco de dados:** alterado — colunas `planos_alt` (jsonb, padrão `[]`) e `emplacamento_alt` (text) em `motos` e `catalogo_mestre` (migration `motos_planos_alt_emplacamento`).
- **Arquivos:** `VITRINE/vitrine.html` (c1472e7), `SITE-CDC/index.html` (134485f); espelhos atualizados.
- **Pendente:** as colunas ainda estão vazias, então os botões não aparecem. A sincronização com o site da Honda (`cnh_aplicar`) ainda não grava a segunda tabela, e o site da Honda responde 403 (bloqueio) desde 2026-11-16 11:10 UTC, então as tabelas não estão atualizando. Falta carregar os valores "sem emplacamento" (sync ou digitação) e propagar do catálogo mestre para os vendedores.

## 2026-11-16 — Ícone universal: asa da Honda em todos os sites

- **O que mudou:** o ícone da aba do navegador (favicon) e o ícone de atalho do celular (apple-touch-icon) dos sites VITRINE (todos os vendedores), SITE-CDC, SITE-CNH e Termo-Honda-Grupo-Star eram o logo do Grupo Star. Agora são só a asa da Honda, sem o texto "HONDA", com fundo transparente (favicon 64x64 e atalho 180x180). O comercial já usava a Honda, mas com o texto e fundo branco no atalho; foi padronizado igual. Vale para qualquer concessionária.
- **Arquivos:** `VITRINE/vitrine.html`, `SITE-CDC/index.html`, `SITE-CNH/index.html`, `comercial/index.html`, `Termo-Honda-Grupo-Star/index.html`; espelhos `apps/*` atualizados à mão. **Banco de dados:** não alterado.
- **Pendente:** navegadores guardam o ícone antigo no cache; pode demorar (ou precisar remover e readicionar o atalho na tela inicial) para trocar. Logos de loja/concessionária dentro das páginas e o nome "Star Motos" em textos não foram alterados. No iPhone, ícone de atalho transparente aparece com fundo preto.

## 2026-11-16 — Admin geral: trocar o e-mail de login do vendedor

- **O que mudou:** na tela do vendedor (Admin geral), em "Acesso ao painel", novo campo "novo e-mail de login" + botão "Trocar e-mail" (com confirmação). A senha continua a mesma. Bloqueia e-mail inválido ou já usado por outra conta, outro vendedor ou outro cadastro de cobrança.
- **Banco de dados:** alterado — função `mestre_vendedor_email(p_id, p_email)` (SECURITY DEFINER, só o admin geral; executável só por `authenticated`). Atualiza `auth.users.email`, `auth.identities` (email), `customers.email` do vendedor e `vendedores.email` quando preenchido (hoje 39 de 40 estão nulos; o login real fica em `auth.users`). Testada com rollback.
- **Arquivo:** `comercial/index.html`; espelho `apps/comercial` atualizado à mão.
- **Pendente:** o vendedor com sessão aberta pode precisar entrar de novo; `equipe_vendedores`/`painel_donos` (e-mails de outras pessoas) não são alterados.

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
