# Changelog (mais recente no topo)

## 2026-11-24 — Aviso "Expansão": indicação por link + ranking (1º/2º/3º)

- **O que é:** card vermelho no topo da aba Notificações do admin do vendedor (vitrine.html `/:slug/admin`): "ATENÇÃO — O sistema está em expansão!", link de indicação do próprio vendedor com botão Copiar, contador de pessoas que **pagaram** pelo link (sem região nem dados do comprador) e pódio com 1º R$ 200, 2º R$ 100, 3º 2 meses grátis do plano. Mostra nome abreviado (ex.: "Ana S.") e quantidade; destaca "você".
- **Link:** `https://www.sitevendedor.com/?ref=<slug>`. A captura do `ref` já existia no comercial (`refGet`, 30 dias, vai em `orders.dados.ref`); não mudou o checkout.
- **Banco (migration `exp_ranking_indicacao`):** função `exp_ranking()` (SECURITY DEFINER; EXECUTE só `authenticated`/`service_role`). Conta clientes distintos de pedidos `pagamento_aprovado` com `dados.ref` = slug do vendedor; ignora upgrade, o próprio vendedor/e-mail, suspensos e parceiros (que têm o esquema próprio `parceiro_*`). Desempate: quem chegou primeiro. Retorna só o próprio total/posição e o top 3.
- **Testado:** visual do card (celular) com dados simulados; permissões da função (anon sem acesso). Não testado ao vivo logado nem com compra real (0 pedidos com ref aprovados hoje).
- **Pendente:** regras/prazo e forma de pagamento dos prêmios (definir com o dono); conferir o card logado no primeiro uso.

## 2026-11-23 — Concessionária Nordeste Motos: logo sem fundo

- **Logo:** a imagem enviada (335x597, letras e anel brancos sobre vermelho) foi tratada: fundo vermelho removido (PNG transparente, branco puro), redesenhada em 4x com bordas nítidas e cortada no círculo (1291x1293, 160 KB). Arquivo `logo-nordestemotos.png` na raiz do repositório **vitrine** (`https://www.sitevendedor.com/logo-nordestemotos.png`).
- **Como aparece:** o nome `logo-xxx.png` ativa o modo "logo curada": sem caixa branca, direto no fundo do site (preto/vermelho), com leve brilho, ao lado do nome "Nordeste Motos". Serve para logos claras; para logos escuras usar `conc-xxx.png` (caixa branca).
- **Banco (dados, sem migration):** `concessionarias` id `nordeste` (SE): `logo_url` preenchido; o vendedor `cleiton-santana` (único nela) acompanhou (`concessionaria_logo`). Nome já era "Nordeste Motos".
- **Testado no ar** (celular e computador): logo transparente ao lado do nome, sem erro de script. Pendente: nada.

## 2026-11-23 — Concessionária MotoSul: logo e nome

- **Logo:** a imagem enviada (240x240, fundo branco) foi tratada: fundo removido (PNG transparente), redesenhada em 4x com bordas nítidas e cortada no conteúdo (837x460, 49 KB). Arquivo `conc-motosul.png` na raiz do repositório **vitrine** (publicado em `https://www.sitevendedor.com/conc-motosul.png`).
- **Por que `conc-…` e não `logo-…`:** nomes `logo-xxx.png` ativam o modo "logo curada" (sem caixa, para logos claras). A MotoSul tem letras pretas e some no fundo escuro; com `conc-…` ela aparece dentro da caixa branca, ao lado do nome, como a Moto Campo.
- **Banco (dados, sem migration):** `concessionarias` id `motosul`: nome "Motosul" → **"MotoSul"** e `logo_url` preenchido; o vendedor `cleiton` (único nela) acompanhou (`concessionaria`, `concessionaria_logo`). Atenção: `mestre_concessionaria_salvar` normaliza o nome (viraria "Motosul" de novo); para manter "MotoSul" alterar direto no banco.
- **Testado no ar** (site do cleiton, celular e computador): logo na caixa branca ao lado de "MotoSul". Pendente: nada.

## 2026-11-23 — Admin geral: criar concessionária pelo perfil do vendedor

- **Motivo:** o dono colocou um vendedor numa concessionária errada e a certa não existia no sistema; só dava para escolher as 6 já cadastradas.
- **Tela (comercial/index.html):** no perfil do vendedor, o campo **Loja** ganhou a última opção **"➕ Criar nova concessionária…"**. Abre uma janela com Nome e Estado (UF, já vem o do vendedor); ao confirmar, cria a concessionária e já coloca o vendedor nela. Se o nome já existir, usa a existente e avisa. No Acre não cria (lá valem as lojas do grupo). A opção só aparece no perfil do vendedor, não na tela de supervisores.
- **Banco (migrations `mestre_concessionaria_criar` e `mestre_concessionaria_criar_corrige_uf`):** função `mestre_concessionaria_criar(p_nome, p_uf)`: só o dono (`_exige_dono`), EXECUTE só para authenticated e service_role (anon e público sem acesso; conferido), valida nome e UF, evita duplicar pelo nome-chave (mesma regra de `conc_chave`), gera o id sozinha.
- **Testado:** janela abre com a UF do vendedor; valida campos vazios; cancelar volta o campo; criar chama `mestre_concessionaria_criar` e depois `mestre_vendedor_local` com `c:<id>`; erro do banco aparece na janela; sem erro de script. No banco, o teste foi feito com uma concessionária "Teste" (SP) que **foi apagada** (continuam as 6 reais).
- **Não testado ao vivo logado** (exige login do dono): conferir na primeira vez. Banco alterado: sim (função nova). Pendente: nada.

## 2026-11-23 — Link dos termos: termossistemahonda.vercel.app

- O dono trocou o domínio do projeto dos termos na Vercel para `termossistemahonda.vercel.app` (o antigo `termosgrupostar.vercel.app` passou a dar 404). Atualizado em **vitrine** (vitrine.html e `frame-src`/CSP do vercel.json), **site-cdc** e **site-cnh**. Conferido no ar: a página abre com o título "Vendas Honda"; o link gerado pela vitrine fica `…/?loja=NomeDaLoja`. Banco: não alterado.
- Observação: o comercial não usa o link. `PROJECT_CONTEXT`/docs que citam o endereço antigo devem ser lidos como o novo.

## 2026-11-23 — Termos: marca "Vendas Honda" no lugar de "Grupo Star"

- A página dos termos agora se chama **Vendas Honda** (título, topo, texto, rodapé) e usa a asa da Honda como logo (a estrela do Grupo Star saiu). **Star Motos (Grupo Star)** continua aparecendo só como a empresa que opera a plataforma (quadro de identificação, CNPJ e e-mail de privacidade), porque o texto legal precisa nomear uma empresa de verdade, não só uma marca. Dados em `EMPRESA` no script (`nome`, `operadora`).
- **Link:** ainda `termosgrupostar.vercel.app`. O dono quer trocar (ex.: `termossistemahonda.vercel.app`, conferido livre na Vercel em 23/11). Falta ele adicionar o domínio no projeto da Vercel; depois trocar `POLITICA_URL` na vitrine, CDC e CNH e o `frame-src`/CSP dos sites, e manter o endereço antigo funcionando por um tempo. Banco: não alterado.

## 2026-11-23 — Termos: política flexível para qualquer loja/concessionária (atuais e futuras)

- **Motivo:** o texto falava só em "vendedor independente" e Grupo Star. Para lojas e concessionárias de outros estados (e as que ainda vão entrar), faltava dizer quem é a Loja no tratamento dos dados e deixar claro o que é simulação x contratação.
- **termo-honda-grupo-star/index.html (conteúdo jurídico, atualizado a pedido do dono; recomenda-se revisão por advogado/encarregado):**
  - Seção 1: papéis ampliados: **Vendedor e, quando houver, a Loja (loja ou concessionária de qualquer cidade/estado)** como controladores; Grupo Star continua operadora. Seção 6 inclui a Loja entre quem recebe os dados; seção 8 permite pedir direitos ao Vendedor ou à Loja.
  - Novas seções: **11 Simulações, propostas e contratação** (valores informativos, simulação não é aprovação, regras do consórcio, contrato é com a instituição/administradora/Loja, dados verdadeiros, pagar só em canais oficiais), **12 Comunicações** (ofertas e como parar), **13 Alterações e contato** (versão em vigor, lei brasileira, e-mail de privacidade). Seção 5: aviso de incidente de segurança (ao titular e à ANPD).
  - A página aceita `?loja=Nome` e mostra "Este site é atendido pela loja ou concessionária X" (só texto, limpo de HTML, máx. 80 caracteres). Sem o parâmetro, o texto continua valendo para qualquer loja. Data de atualização: 23/11/2026.
- **vitrine/vitrine.html:** `polUrl()` monta o link dos termos com o nome da loja (Acre: loja do vendedor; fora do Acre: concessionária). Vale para o link do rodapé e o do aviso de cookies. Sites CDC/CNH continuam abrindo a página sem parâmetro (texto genérico).
- **Testado:** página sem parâmetro, com loja e com tentativa de código no nome (aparece só como texto); links gerados para dois vendedores reais (Brasmoto, Motoformosa); sem erro de script. Banco: não alterado.
- **Pendente:** revisão jurídica do texto; confirmar se a Loja/supervisor realmente enxerga os pedidos do vendedor (o texto diz que a Loja recebe os dados do atendimento); passar `?loja=` também no CDC e CNH se quiser.

## 2026-11-23 — Vitrine: tabela de parcelas do consórcio escura no tema escuro

- **Motivo:** com o vendedor no tema escuro ("Fundo da página: preto"), o quadro das parcelas do consórcio (80x, 60x, 48x…) ficava com fundo **branco** e os valores quase invisíveis.
- **O que mudou (só CSS em vitrine.html, bloco `v53`, vale só com `body.fpr`):** cartões de parcela escuros com leve brilho; parcela escolhida em destaque vermelho (borda, brilho, texto claro); botão de seleção redondo próprio; "Valor da carta de crédito" virou uma faixa com o valor em vermelho; "Parcela escolhida" maior; selo "com Seguro de Vida em Grupo" em dourado. Vale também para o quadro "com/sem emplacamento" da tela de detalhes.
- **Testado (celular e computador):** tema escuro com a tabela escura e troca de parcela funcionando; tema claro idêntico ao anterior; sem erro de script. Banco: não alterado. Pendente: nada.

## 2026-11-22 — Comercial: link "Área do dono" removido do rodapé

- O rodapé do site de vendas agora tem só "Planos" e "Dúvidas". Não sobrou nenhum link para o admin na página pública; o Admin Geral continua funcionando pelo endereço direto (`.../#admin`), que o dono já usa. A tela de login do admin mantém o título "Área do dono" (só aparece dentro do `#admin`).
- Testado: página pública sem nenhum link para o admin; `#admin` abre a tela de login normalmente; sem erro de script. Banco: não alterado.

## 2026-11-22 — Segurança: painéis do Admin Geral fora do HTML público, robots.txt contra IAs, arquivos internos fora do ar

- **Motivo:** o dono testou o site com outra IA (ChatGPT). Ela não entrou em nada (o próprio relatório diz que painel, banco, APIs e permissões ficaram "não acessados"), mas leu o texto da barra do Admin Geral, que ia escondido no HTML público.
- **O que estava exposto e foi corrigido (comercial/index.html):**
  - Dois painéis do Admin Geral iam embutidos em base64 para **qualquer visitante**: "Admin Geral | Catálogo" (186 KB) e a Calculadora (97 KB). Sem segredos (só a chave pública anon), mas era o código inteiro desses painéis. Agora ficam na tabela `painel_privado` e carregam pela função `mestre_painel_privado(nome)`, que só o dono executa. A página pública caiu de 855 KB para 573 KB (abre mais rápido para o cliente).
  - A barra do topo do admin ("Admin Geral", "Buscar vendedor, aba ou ação…", "ao vivo", "Tema escuro", "Ver site", "Sair") saiu do HTML; entra pelo JavaScript só quando se abre `#admin`.
- **Banco (migration `seguranca_painel_privado`):** tabela `painel_privado(nome, conteudo, atualizado_em)` com RLS e sem policies, sem acesso de anon/authenticated; função `mestre_painel_privado(text)` com `_exige_dono()`, EXECUTE só para authenticated e service_role. Conteúdo carregado do commit `f00ec87` do repositório comercial (mesmo tamanho e md5 do que estava no HTML).
- **`robots.txt` (nos 5 repositórios):** pede a ~30 robôs de IA (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider etc.) que não leiam o site. Google, Bing e as prévias de link (WhatsApp, Facebook, Instagram, Telegram) continuam liberados; só os painéis (`/*/admin`, `/*/supervisor`) ficam fora da indexação. **Confirmado ao vivo:** o leitor de páginas do Claude recusou abrir www.sitevendedor.com por causa do robots.txt.
- **`.vercelignore` (nos 5 repositórios):** os arquivos continuam no GitHub, mas não são mais publicados: `CLAUDE.md` (descrevia a arquitetura para quem abrisse /CLAUDE.md), a cópia antiga `index_VITRINE_v39-antes-cores.html` (estava, sim, publicada no domínio, ao contrário do que o PROJECT_CONTEXT dizia) e capturas de tela sem uso (`admin_geral_branco/premium.png`, `painel_vendedor_premium.png`, `topo_*.png`, `computador_novo_e_celular_antigo.png`). A `conc-campo.png` continua publicada: a vendedora paula usa.
- **Testado:** página pública com 41 cards e sem o texto do admin fora dos scripts; `#admin` monta a barra (tema ok) sem erro; painéis vindos do banco **idênticos** aos de antes (catálogo e calculadora); erro do banco mostra mensagem e a aba se recupera na tentativa seguinte; banco recusa visitante (sem permissão), vendedor logado que não é dono ("Somente o administrador geral…") e leitura direta da tabela.
- **Não verificado ao vivo (precisava de aprovação):** que /CLAUDE.md e /index_VITRINE_v39-antes-cores.html dão 404 depois do deploy. O dono abriu nada ainda como dono: conferir as abas Catálogo e Calculadora no primeiro uso.
- **Cloudflare (correção de recomendação anterior):** a Vercel recomenda **não** colocar proxy (Cloudflare laranja) na frente dela; o proxy desliga a Bot Protection da Vercel. O caminho certo é o **Firewall da Vercel**: regras gerenciadas "AI Bots" (gratuita) e "Bot Protection". Precisa ser ligado pelo dono no painel da Vercel (não há acesso da Vercel nesta sessão).
- **Banco alterado:** sim. **Pendente:** dono ligar o Firewall da Vercel nos projetos; conferir os 2 links acima; ligar "proteção contra senha vazada" no Auth.

## 2026-11-22 — Comercial: o "+ N vendedores" só aparece no fim da lista expandida

- O texto "+ N vendedores que também vendem com o sistema" foi movido para dentro da área que abre com "Ver mais N vendedores", depois do último vendedor. Com a lista fechada ele não aparece. Se houver 8 vendedores ou menos (sem "Ver mais"), aparece logo abaixo da grade. Só mudança em comercial/index.html; banco não alterado.
- Testado: fechado (área com altura 0, texto invisível), aberto (texto depois do último card, 41 cards), sem erro de script.

## 2026-11-22 — Comercial: texto do número extra encurtado

- O fim da lista passou a dizer só "+ N vendedores que também vendem com o sistema" (saiu "e preferem não aparecer aqui", a pedido do dono). Só texto, em comercial/index.html. Banco: não alterado. O número em Configurações continua devendo ser real.

## 2026-11-22 — Comercial: número de vendedores que não aparecem na lista (editável no admin geral)

- **Correção do registro anterior:** a entrada "lista única" dizia que o "+ valor" não foi feito. Agora foi feito, depois do dono esclarecer que o número representa vendedores **reais** do sistema que não querem aparecer no site comercial (cadastrados pessoalmente ou que pediram para sair).
- **Banco (migration `comercial_vendedores_extra_config`):** nova chave `vendedores_extra` em `plataforma_config`; `mestre_config_salvar` aceita `vendedores_extra` (inteiro de 0 a 100000; negativo vira 0; texto é recusado; só o dono) e `ps_publico` devolve `vendedores_extra`. Funções alteradas por substituição de texto (permissões mantidas: `mestre_config_salvar` continua sem acesso do visitante).
- **Site comercial:** no fim da lista aparece "+ N vendedores que também vendem com o sistema e preferem não aparecer aqui" (não aparece se for 0). O contador do topo vira "mais de 41 vendedores já vendem com o sistema" quando N > 0 (e "41 vendedores…" exato quando é 0).
- **Admin geral → Configurações:** novo cartão "Vendedores que não aparecem na lista" com o campo Quantidade. O texto lembra que o número deve ser real.
- **Ocultar um vendedor específico:** já existia (admin → vendedor → "Mostrar este vendedor na página inicial", tabela `ps_destaques.ativo`); nada novo.
- **Testado:** DB (12 salva, -5 vira 0, "abc" recusado, valor de teste apagado); site com extra 0, 12 e 1 (singular/plural, posição depois da lista, contador), sem erro de script; scripts do arquivo sem erro de sintaxe. O cartão do admin não foi aberto logado (exige login do dono): conferir na primeira vez.
- **Banco alterado:** sim. **Pendente:** o dono definir o número real em Configurações.

## 2026-11-22 — Comercial: seção de vendedores em lista única, com UF no card

- **O que mudou (comercial/index.html, `drawDest`):** os vendedores aparecem numa lista só, sem os títulos por região (os do AC primeiro). Cada card mostra a UF (AC, etc.) entre o nome e o botão "Visitar site". O contador passou a dizer "N vendedores já vendem com o sistema". Continua o "Ver mais N vendedores" depois dos 8 primeiros.
- **O que NÃO foi feito, de propósito:** somar um número definido pelo dono ("+ valor") ao contador e ao fim da lista. O pedido era fazer o vendedor que visita o site achar que há mais assinantes do que há; isso seria publicidade enganosa e não foi implementado. O contador é sempre o número real de vendedores exibidos (hoje 41). Não foi criado campo no admin geral.
- **Testado:** página real com o arquivo novo: 41 cards, 0 títulos de região, contador correto, UF visível, sem erro de script. **Banco alterado:** não.

## 2026-11-22 — Segurança: menos API pública no banco, CSP nas fichas e bloqueio de salvar/imprimir

- **Banco (migrations `seguranca_reduz_api_publica_anon` e `seguranca_reduz_api_publica_anon_corrige_public`):** o visitante sem login (`anon`) perdeu o acesso a 8 funções que não são para ele.
  - 3 funções que só o administrador geral usa (salvar concessionária, ver versões da tabela Honda, ligar/desligar a promoção). Elas já validavam por dentro, então isto é defesa em profundidade. **Detalhe importante:** tirar só de `anon` não bastava, porque o Postgres concede `EXECUTE` a `PUBLIC` ao criar uma função; foi preciso tirar de `PUBLIC` e devolver para `authenticated` e `service_role`. Vale conferir isso em revisões futuras.
  - O módulo de assinatura antigo (`assin_*`, 5 funções), substituído pelo fluxo atual (`ps_*`/`orders`): a tabela `assin_pedidos` nunca teve nenhum registro e nenhum site chama. O ponto mais sensível era o `assin_consultar`, que devolvia plano, valor, status e o endereço do vendedor para quem acertasse o número do pedido e 4 dígitos do WhatsApp, sem limite de tentativas. Para religar o fluxo: `grant execute on function ... to anon`.
- **Cabeçalhos (CDC, CNH e termos):** as duas fichas (dados pessoais do cliente) **não tinham Content-Security-Policy**; agora têm, liberando exatamente o que elas usam (Supabase, jsdelivr, fontes do Google, viacep para o CEP, imagens https, `blob:`/`data:`). A página de termos **não tinha cabeçalho de segurança nenhum** (não existia `vercel.json`): ganhou HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options e CSP própria. A vitrine ganhou `X-Frame-Options: SAMEORIGIN` (a CSP já tinha `frame-ancestors`).
- **Nos 4 sites (navegador):** o bloco `anti-inspecao` passou a bloquear também **Ctrl+S / Cmd+S** (salvar a página), **Ctrl+P / Cmd+P** (imprimir e "salvar como PDF"), os atalhos extras do inspecionar (Ctrl+Shift+E/M/P/S) e **arrastar as fotos** para fora da página. Continuam livres: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+F, Ctrl+Z, as letras e o menu do clique direito dentro de campos de texto.
- **Limite honesto (registrar para não esquecer):** o bloqueio no navegador é só incômodo. Quem usa o menu do próprio navegador (⋮ → Salvar página como), outro navegador, `curl` ou um script continua salvando e lendo tudo o que o navegador recebe — inclusive o HTML e o JavaScript dos sites. Não existe jeito de impedir isso: o que o site mostra ao cliente, o cliente recebe. A proteção que vale é a do banco (RLS, permissões por papel, funções que checam quem chama) e ela está em pé.
- **Testado:** atalhos bloqueados e os comuns livres nos 4 sites; clique direito liberado em campos; arrastar foto bloqueado e arrastar texto livre; CDC e CNH abertos com a CSP real servida de verdade — carregaram supabase-js, fontes e a chamada ao Supabase **sem nenhum bloqueio de CSP** e sem erro de script; página de termos abriu inteira (8.450 caracteres, 12 links) com a CSP nova, nada bloqueado. Nenhum dado de teste criado.
- **Banco alterado:** sim (só permissões de execução). **Pendente:** ligar "proteção contra senha vazada" no Auth do Supabase (só o dono faz); Cloudflare (WAF/Turnstile) para limite por IP e bloqueio de robôs — é o único jeito real de conter varredura em massa. Se algum vendedor precisar imprimir pelo painel, dá para liberar o Ctrl+P só na área logada em um minuto.

## 2026-11-21 — Catálogo: removido o selo "Lançamento" da POP 110i ES

- **O que mudou (banco):** o selo "Lançamento" foi apagado do catálogo geral (1 moto, POP 110I ES) e das cópias dos vendedores (7 motos: rafael, daniel, andrezanes, dilorran, robson, paula, victor). O card deixa de mostrar a etiqueta.
- **Por quê:** pedido do dono.
- **Conferido:** nenhuma função do banco recoloca esse selo; nenhum vendedor tinha personalizado. O vendedor ainda pode pôr um selo próprio no painel.
- **Banco alterado:** sim (só a coluna `selo`). Nenhum arquivo de site mudou.

## 2026-11-21 — Vitrine: as duas POP 110i ES fixas nas 2 primeiras posições

- **O que mudou (vitrine.html, função `lista`):** os modelos cujo nome começa com "POP 110I ES" (a POP e a POP +10%) passam sempre para o início da lista, a "POP 110I ES" primeiro e a "+10%" em seguida. No computador (4 colunas) ficam lado a lado na primeira linha; em tablet (2 colunas) também; no celular a grade é de 1 coluna, então ficam uma embaixo da outra.
- **Por quê:** pedido do dono, para as duas POP serem as primeiras que o cliente vê.
- **Regras:** vale quando o cliente não escolheu outra ordenação (menor preço, A–Z etc.); nas vitrines de alta cilindrada (categoria `alta`) a ordem não muda. Não mexe na ordem salva no painel de cada vendedor.
- **Testado:** páginas reais de dois vendedores com o arquivo novo: POP e POP +10% nas posições 1 e 2, mesma linha, sem erro de script.
- **Banco alterado:** não. **Pendente:** se quiser as duas lado a lado também no celular, é preciso passar a grade do celular para 2 colunas (muda o visual de todos os cards).

## 2026-11-21 — Catálogo: XR 300L Tornado agora com a cor Preta (fotos do site da loja)

- **O que mudou (banco, via `_mestre_aplicar`):** a XR 300L Tornado passou a ter **Vermelho + Preto** no catálogo geral, com as fotos oficiais da loja (grupostarmotos.com.br). Propagado para os **44 vendedores** que têm a moto; nenhum tinha a foto personalizada, então todos receberam.
- **Por quê:** no site do **consórcio** da Honda a Tornado sai só em vermelho, mas a loja publica a preta no próprio site. O pedido foi mostrar a preta também. As imagens são as duas do site da loja (vermelha e preta, mesmo enquadramento), referenciadas direto por https (o CSP do site já libera imagem https).
- **Testado:** no site ao vivo, o card mostra "Vermelho, Preto"; nos detalhes, tocar em "Preto" troca a foto para a moto preta e o WhatsApp já vai com "na cor Preto". Sem erro.
- **Banco alterado:** sim (catalogo_mestre da Tornado + 44 motos). Nenhum arquivo de site mudou.
- **Atenção:** se a Honda publicar uma versão nova da Tornado no site oficial, a rotina automática de cores pode reconstruir a moto a partir do oficial (só vermelho) e tirar a preta — ela guarda a versão anterior e avisa. Se isso acontecer, é só reaplicar a preta.
- **Foto vermelha anterior (oficial), caso precise voltar:** midia/1792458608273-f7kuy-9725R1GDJOIelnIw38tNeGd3NZJpWu9cTnar723K.png
- **Pendente:** se quiser, puxar do site da loja as cores/fotos que faltam em outras motos (ex.: as que aparecem com "1 cor").

## 2026-11-20 (fim da tarde) — Anti-inspeção nos 4 sites (pedido do dono)

- **O que mudou (vitrine, comercial, site-cdc, site-cnh):** bloco `anti-inspecao` no `<head>` que bloqueia o clique direito e os atalhos F12, Ctrl+Shift+I/J/C/K, Ctrl+U e Cmd+Option+I/J/C/U. Campos de texto continuam com o menu normal (colar, copiar) e o teclado comum não é afetado.
- **Limite honesto:** é só um incômodo para curiosos. Quem usa o menu do navegador, outro navegador, `curl` ou um script continua vendo o que o navegador recebe. A proteção real está no banco (RLS e funções que checam quem chama). Para desativar, apagar o bloco `<script id="anti-inspecao">`.
- **Testado:** clique direito bloqueado fora de campos e liberado em campos; atalhos bloqueados; Ctrl+C/V/F e letras livres; sem erro de script ao abrir os 4 sites.
- **Banco alterado:** não. **Não incluído:** a página de termos (termo-honda-grupo-star).

## 2026-11-20 (tarde) — Removida a apresentação "patrão" do banco

- **O que mudou:** a apresentação "patrão" não é mais usada, então foi apagada do banco: as funções `patrao_*` e `mestre_patrao*`, as tabelas `patrao_sessoes` e `patrao_respostas` e as duas chaves `patrao_*` da `plataforma_config` (migration `remove_apresentacao_patrao`). Isso também elimina um item de segurança em aberto da auditoria do mesmo dia.
- **Não mexido:** a conta de vendedor ligada à apresentação continua existindo (só saiu o que a apresentação guardava).
- **Conferido:** nenhum site, trigger, cron ou função usa mais o que foi apagado.
- **Banco alterado:** sim. **Pendente:** a pasta local `work/patrao_r` (página antiga) não está em repositório e pode ser descartada.

## 2026-11-20 — Segurança: auditoria geral e 4 correções no banco

- **Auditoria:** banco (permissões, RLS, funções), Edge Functions, os 6 repositórios e o histórico do git, logs, cabeçalhos do Vercel e `api/og.js`. Nenhum segredo nos repositórios (só a chave pública anon) e nenhum ponto de XSS encontrado. Os detalhes técnicos das brechas ficam fora deste repositório público.
- **O que mudou (banco, migrations `seguranca_revoga_funcao_interna_e_tabela_catalogo`, `seguranca_limites_checkout_e_webhook_mp`, `seguranca_corrige_alias_limite_ps_criar_pedido`):**
  - Checkout (`ps_criar_pedido`): limite de tentativas por e-mail/WhatsApp (24 h) e no total (1 h) e campo-isca anti-robô (`site`); o checkout normal não muda.
  - Webhook do Mercado Pago (`mp_webhook`): valida o formato do id e limita por minuto; continua liberado para o Mercado Pago e sempre responde ok.
  - Função interna `honda_tabela_versionar` agora só roda pelo cron e pela Edge Function `honda-sync`.
  - Tabela `catalogo_planos_normal`: permissões de anon/authenticated removidas (o RLS já bloqueava).
- **Testado:** acessos de anon negados onde deveriam, checkout chega até a validação do plano, limites disparam e liberam outro cliente, cron `honda_tabela_versionar` OK. Dados de teste desfeitos (pedidos 38, eventos 10, como antes).
- **Banco alterado:** sim (só permissões e as duas funções acima). Nenhum arquivo de site mudou.
- **Pendente (dono):** ligar "proteção contra senha vazada" no Auth do Supabase; para limite por IP/CAPTCHA/bloqueio de robôs, colocar Cloudflare (WAF/Turnstile) na frente do domínio.

## 2026-11-20 — Vitrine: chat em tela cheia no computador, com fundo novo

- **O que mudou (vitrine):** no computador (tela a partir de 721 px) o chat com o vendedor deixou de ser uma janela de 540 px e passou a **ocupar a tela toda**: topo com logo/nome do vendedor e botão de fechar no canto direito, conversa numa coluna central (900 px; 980 px em telas ≥ 1500 px; 1100 px em telas ≥ 2000 px) e campo de resposta embaixo. Fundo novo: escuro com brilhos vermelho (cor do site), verde e azul de movimento lento, linhas diagonais finas e a coluna da conversa levemente destacada. Balões do vendedor em branco, do cliente em verde; respostas rápidas em vidro. Letras maiores em telas grandes. Rola só a conversa (a página atrás fica travada).
- **Celular:** igual ao que era (nada mudou). Temas Alta/Premium continuam valendo (linha dourada no topo).
- **Correção junto:** quando o vendedor não tem foto, o avatar de letra aparecia esticado/oval no topo e quadrado nas mensagens; agora é redondo.
- **Testado:** 2560×1270, 1920×1080, 1366×768, 1024×768, 800×600 e celular 390×844: sem rolagem lateral, sem erro de script.
- **Banco alterado:** não.
- **Pendente:** nada deste item. (Os demais pendentes seguem em `docs/KNOWN_ISSUES.md`.)

## 2026-11-20 — Vitrine: card da tabela de consórcio menor e cabeçalho com logo e Instagram

- **O que mudou (vitrine):** no cartão que abre ao tocar numa moto, o topo agora mostra **logo da concessionária + foto do vendedor + telefone + @Instagram** (a logo é a da concessionária nos vendedores de fora do Acre e a da loja nos do Acre; some se não houver logo). A tela "Tabela de consórcio" ficou menor: largura de 600 px no computador (antes 1060 px), foto da moto mais baixa (150 px), linhas e textos mais compactos.
- **Instagram:** o campo já existia; só aparece se o vendedor preencher em Meu site › Redes sociais. A Paula (Moto Campo) está **sem Instagram salvo** no banco; o exemplo mostra @paulapireshonda, mas não gravei no cadastro dela.
- **Banco alterado:** não.
- **Pendente:** Paula (ou o dono) preencher o Instagram.

## 2026-11-19 (noite) — Revisão geral do sistema

- **Rotinas agendadas (cron):** todas as ativas rodaram com sucesso na última execução. Os crons novos (`cometa_oficial_aplicar`, `plano_normal_atualizar`) ainda não tiveram janela; primeira em 12:46/12:48 UTC.
- **Dados dos clientes até o vendedor:** leads (124), fichas (4), contratos (3), pedidos do chat (108), rascunhos (258) e simulações (3): **nenhum registro sem vendedor**. Teste de isolamento no banco como vendedor logado (marcos, pereira, isravel, shayron): cada um vê só os seus pedidos e rascunhos, 0 de outros vendedores. Cliente do chat sem moto escolhida fica oculto do painel por regra (migration `clientes_sem_moto_ocultos`).
- **Catálogo e tabelas:** 0 motos sem catálogo, 0 com tabela fora da sua região, 0 com emplacamento errado, 0 modelos sem foto ou sem plano; as 27 UFs do site oficial lidas com sucesso nas últimas 14 h.
- **Repositórios:** vitrine, comercial, site-cdc, site-cnh e termo-honda-grupo-star atualizados (`git pull`), sem alterações pendentes.
- **Achado principal:** 139 avisos de WhatsApp aos vendedores parados em `aviso_wa_fila` (`aguardando_config`). Ver `docs/KNOWN_ISSUES.md`.
- **Correção feita:** removida a permissão de chamada pública da função de gatilho `tg_motos_excluir_uf` (criada hoje).
- **Banco alterado:** apenas essa permissão. Sites sem alteração.
- **Pendente:** ver `docs/KNOWN_ISSUES.md` (WhatsApp, rascunhos parados, crons antigos da Cometa, limpeza de performance, segurança tratada em conversa privada).

## 2026-11-19 (noite) — Cometa Manaus passa a seguir a tabela oficial da Honda para o Amazonas (2×/dia)

- **Regra de ouro (confirmada pelo dono):** cada região/localização segue a tabela do site oficial da Honda. A Cometa fica em Manaus (AM), **não no Acre**; a tabela dela agora vem do **Amazonas oficial**, não do site da própria Cometa.
- **O que foi feito:** nova função `cometa_oficial_aplicar()` (cron `cometa_oficial_aplicar`, job 87, **12:46 e 20:46 UTC = 07:46 e 15:46 em Rio Branco**, logo depois da coleta do site oficial). Lê `honda_vehicles` (uf = AM), escolhe o plano de cada modelo como a região B (`catalogo_fonte`), valida (números, prazos, faixa contra a região A) e grava em `catalogo_planos_regiao` região `COMETA-AM`, com histórico em `catalogo_planos_hist` e registro em Admin geral › Regiões (`regiao_log`). Só aplica se a leitura de AM for da coleta mais recente (menos de 12 h) e ao menos 90% dos modelos forem válidos; senão não altera nada e avisa o dono. Depois reaplica nos vendedores Cometa (`regiao_reaplicar`).
- **Conferência feita:** as 27 UFs do site oficial seguem a tabela da sua região (nenhum aviso). A tabela oficial de AM hoje é **idêntica** à do AC nos 249 prazos lidos. Primeira aplicação: 28 modelos lidos, 4 ajustados (CG 160 FAN/START/TITAN ganharam o prazo oficial de 99 meses; CRF 300F, centavos); 8 motos dos 2 vendedores Cometa reaplicadas. POP 110i ES (simples) e +10% já estavam iguais ao oficial.
- **Banco alterado:** sim. Migration `cometa_manaus_tabela_oficial_honda_amazonas`; cron novo. Sites sem alteração.
- **Pendente (decisão do dono):** os jobs antigos `cometa_iniciar`/`cometa_buscar`/`cometa_aplicar` (11:00–11:04 e 19:00–19:04 UTC) ainda leem o site da Cometa e podem sobrescrever a tabela às 06:04/14:04 de Rio Branco; a rotina oficial corrige às 07:46/15:46. O ideal é desativá-los; não foi feito sem autorização.

## 2026-11-19 (noite) — POP 110i ES: Acre = lojas Star Motos, Juruá Motocenter e Acre Motos; tabelas por região; POPs lado a lado

- **Esclarecimento do dono:** "região Acre" são as 3 lojas **Star Motos (23), Juruá Motocenter (6) e Acre Motos (8)**, que não vendem a POP simples. Conferido no banco: são exatamente os 37 vendedores com `uf = 'AC'` (loja_id das 3 lojas), então a exclusão `excluir_ufs = {AC}` já cobre só elas. Vendedores de AM, AP, ES, GO e MT (concessionárias Cometa, Mônaco, Brasmoto, Moto Formosa, Moto Campo) recebem.
- **Tabelas separadas como no site oficial:** conferido nas 27 UFs lidas do site oficial: a POP 110i ES tem **duas tabelas** — região A (AC, AM, RO, RR: 80x R$ 196,91, crédito R$ 11.844) e região B (as outras 23 UFs: 80x R$ 197,73, crédito R$ 11.893), idênticas dentro de cada região. No sistema: A = `catalogo_mestre.planos`, B = `catalogo_planos_regiao` ('B'), e agora também **Cometa Manaus** = `catalogo_planos_regiao` ('COMETA-AM'), semeada igual à região A porque a Cometa ainda não publica este modelo no mapa (`cometa_mapa`); passa a ser atualizada sozinha quando o mapa existir.
- **POPs lado a lado:** no catálogo geral e nas motos dos 6 vendedores, **POP 110I ES (ordem 0)** e **POP 110I ES +10% (ordem 1)** ficam em sequência, no topo; as demais motos desceram uma posição.
- **Banco alterado:** sim (dados): `catalogo_mestre.ordem`, `motos.ordem` dos 6 vendedores, nova linha COMETA-AM em `catalogo_planos_regiao`. Sem migration nova.
- **Sites:** sem alteração.
- **Pendente:** preço próprio da Cometa para a POP simples (precisa mapear o plano da Cometa em `cometa_mapa`; hoje usa a tabela da região A).

## 2026-11-19 (noite) — Novo modelo: POP 110i ES (simples), sem o Acre

- **O que mudou:** a **POP 110i ES** (sem "+10% de documentação") entrou no catálogo geral (`catalogo_mestre`, slug oficial `pop-110i-es`), com nome e tabela próprios (não é a "POP 110I ES +10%"). Selo "Lançamento", categoria Street, só `#voudeHonda` (sem emplacamento, pela regra fixa), seguro prestamista nos dois valores. Tabela oficial: região B (referência SP) 80x R$ 197,73 com seguro / R$ 193,26 sem, crédito R$ 11.893; região A (referência AC) 80x R$ 196,91 / R$ 192,47, crédito R$ 11.844; prazos 12–80 meses (7 linhas por região).
- **Quem recebeu:** todos os vendedores **fora do Acre (uf ≠ AC)** — hoje 6 (AM ×2 Cometa, AP, ES, GO, MT). Os 37 vendedores do Acre ficam sem a moto. Interpretei "região Acre" como `uf = 'AC'`; os de AM/RO/RR (mesma tabela de preço do Acre) **recebem**. Se o dono quiser tirar também esses, basta incluir as UFs em `catalogo_mestre.excluir_ufs`.
- **Como o Acre fica de fora para sempre:** nova coluna `catalogo_mestre.excluir_ufs` e gatilho `a0_excluir_uf` em `motos` (função `tg_motos_excluir_uf`): qualquer criação de moto (novo vendedor, sincronização do catálogo, cópia) é descartada se a UF do vendedor estiver na lista do modelo.
- **Atualização automática:** `catalogo_fonte` (`pop-110i-es`) deixou de ser "ignorar" e aponta para o novo modelo; a leitura do site oficial (2×/dia) e `honda_regioes_aplicar` mantêm a região B (`catalogo_planos_regiao`) e as demais rotinas.
- **Fotos/descrição:** reaproveitadas da POP 110i ES +10% (mesma moto: Azul, Branco, Vermelho). Trocar por fotos próprias é opcional.
- **Banco alterado:** sim. Migration `pop_110i_es_simples_sem_acre`; depois `mestre_sincronizar_vendedor` para todos e `regiao_reaplicar_todos('B')` (16 motos região B reaplicadas). Conferido: 6 motos criadas, valores iguais ao oficial, 0 no Acre.
- **Sites alterados:** nenhum.
- **Pendente:** os 2 vendedores Cometa (AM) ficaram com a tabela oficial da região A (a Cometa não tem tabela própria para este modelo); trocar por fotos próprias se quiser.

## 2026-11-19 (noite) — Regra fixa: modelos só #voudeHonda não têm emplacamento

- **Regra:** modelo que a Honda publica **só no `#voudeHonda`** (POP 110i ES +10%, CRF 300F e CRF 250F; no banco: `catalogo_mestre.plano_fonte = '#voudeHonda'`) **nunca mostra emplacamento**, em nenhuma loja e em nenhum modo (`#voudeHonda+`, `#voudeHonda` ou os dois). Antes a POP aparecia "Com emplacamento" e a CRF 300F "Sem emplacamento".
- **Como:** o gatilho `e_plano` (função `tg_motos_plano`) grava `emplacamento = ''` nas motos desses modelos a cada gravação; o catálogo mestre também ficou com `''`. Assim a regra vale mesmo quando uma leitura externa (vendedor.site, site oficial) reescrever o campo. Reaplicado nas 129 motos existentes (3 modelos × 43 vendedores).
- **Banco alterado:** sim. Migration `regra_sem_emplacamento_modelos_so_voudehonda`. Os modelos com `#voudeHonda+` não mudaram.
- **Sites:** sem alteração (a vitrine já esconde o texto quando o campo é vazio).
- **Pendente:** nada.

## 2026-11-19 (noite) — Tabela de consórcio em duas colunas e visual do celular

- **O que mudou (vitrine):** quando a loja vende **os dois planos**, a tela "Tabela de consórcio" mostra duas colunas lado a lado: **Sem emplacamento (#voudeHonda)** à esquerda e **Com emplacamento (#voudeHonda+)** à direita, com uma única escolha de parcela entre as duas. O botão que alternava os planos deixou de existir nesse modo. Nos detalhes da moto, o mesmo par de colunas aparece em formato de leitura; "a partir de" usa a menor parcela (sem emplacamento). O chat de consórcio lista as opções com "· sem/com emplacamento", e a mensagem de WhatsApp informa o plano escolhido.
- **Visual (celular e computador):** cartões por plano (cabeçalho escuro para #voudeHonda e vermelho para #voudeHonda+), linhas de toque grandes (mín. 52 px), parcela escolhida destacada, barra fixa no rodapé com "Parcela escolhida" e o botão principal, foco visível no teclado, leitor de tela (grupos de opção com nome, aviso da parcela escolhida) e sem animação com "reduzir movimento".
- **Planos únicos:** os modos #voudeHonda+ e #voudeHonda usam o mesmo cartão em coluna única.
- **Banco alterado:** não.
- **Pendente:** conferir no celular real do responsável e com o vendedor que escolher "Os dois".

## 2026-11-19 (noite) — Plano de consórcio por concessionária (#voudeHonda+ / #voudeHonda / os dois)

- **O que mudou:** algumas concessionárias vendem só o `#voudeHonda` (sem emplacamento). Agora o dono escolhe, **por concessionária e por loja do Acre**, entre `#voudeHonda+` (padrão), `#voudeHonda` ou **os dois** (cliente alterna por botão na vitrine). Todos os vendedores da loja passam a mostrar as parcelas do plano escolhido. No `#voudeHonda` o texto "com emplacamento" some; o seguro prestamista vale nos dois.
- **Quem muda:** só o dono, em Admin geral › Expandir › "Plano de consórcio de cada loja" (RPC `mestre_plano_modo_salvar`). O vendedor não altera.
- **Como funciona:** as tabelas `#voudeHonda` por região (A = AC, B = estado de referência) vêm da coleta oficial (`honda_installments`) e ficam em `catalogo_planos_normal`; a função `plano_normal_atualizar()` roda 12:48/20:48 UTC, valida (precisa ser menor que o `#voudeHonda+` e ter os mesmos prazos) e reaplica. O gatilho `e_plano` em `motos` grava na moto do vendedor o plano ativo (`plano_ativo`: null = +, `n` = normal, `ambos` = +, com o normal em `planos_alt`). Só vale para modelos que a Honda publica nos dois planos (16); Advance, POP e CRF 300F não mudam. **Cometa fica de fora** (tabela própria).
- **Banco alterado:** sim. Migrations `plano_consorcio_por_concessionaria_voudehonda` e `plano_consorcio_gatilho_planos_alt_vazio`: colunas `plano_modo` (concessionarias, lojas) e `plano_ativo` (motos), tabela `catalogo_planos_normal`, funções `vend_plano_modo`, `tg_motos_plano`, `plano_modo_reaplicar(_todos)`, `plano_normal_atualizar`, `mestre_plano_modos`, `mestre_plano_modo_salvar`, gatilho em `vendedores`, cron `plano_normal_atualizar`.
- **Sites alterados:** vitrine (texto de emplacamento, botão `#voudeHonda+ | #voudeHonda`) e comercial (painel do dono).
- **Estado atual:** todas as lojas continuam em `#voudeHonda+` até o dono escolher. Testado no banco com reversão (Moto Campo, região B: 60x CG 160 TITAN = R$ 538,14 no + e R$ 498,28 no normal).
- **Pendente:** o dono definir o plano de cada loja; conferir `plano_normal_atualizar` depois da primeira janela das 12:48 UTC.

## 2026-11-19 (noite) — Logo da Moto Campo e checkout por região → concessionária

- **O que mudou:** logo da concessionária **Moto Campo** (id `campo`, MT) refeita em alta resolução com fundo transparente (`conc-campo.png`, repositório VITRINE, servida em `https://www.sitevendedor.com/conc-campo.png`) e gravada em `concessionarias.logo_url` e na vendedora `paula`. Como a logo está no cadastro de concessionárias, todo vendedor futuro que escolher ou digitar essa concessionária recebe a logo sozinho (trigger `tg_vendedor_concessionaria` + `concessionaria_resolver`).
- **Comercial (checkout):** a **região (estado)** passou a ser o primeiro campo; ao escolher um estado fora do Acre, aparecem as concessionárias já cadastradas naquele estado (cards com logo); o vendedor toca em uma, ou digita o nome (a lista filtra) ou informa uma nova. Acre continua com as lojas do grupo.
- **Por que:** pedido do responsável (logo para futuros cadastros; vendedor escolhe região e depois a concessionária).
- **Banco alterado:** sim. Migration `concessionarias_catalogo_publico_e_logo_moto_campo`: nova função `ps_concessionarias()` (pública, devolve id, nome, UF e logo das concessionárias) e `logo_url` da `campo`.
- **Nota:** o nome do arquivo não começa com `logo-` de propósito: arquivos `logo-*.png` recebem o estilo sem caixa branca (feito para logos claras), e a Moto Campo é vermelha.
- **Pendente:** logos das outras concessionárias sem logo (Brasmoto, Mônaco, Honda Freeway) quando o responsável enviar.

## 2026-11-19 — Painel do vendedor: categoria "Sites" e revisão de todos os preenchimentos

**Revisão (sem mudança de código):** todo preenchimento grava no sistema do vendedor e leva o cliente sozinho ao WhatsApp dele:
- vitrine: chat (consórcio, financiamento, à vista, cartão) → `registrar_pedido_chat` + abre o WhatsApp; formulário Financiamento → `leads` + abre; consórcio pela tabela, Black Friday e repasse → `leads` + abre;
- SITE-CDC e SITE-CNH: grava `fichas`/`contratos` + `leads` e abre o WhatsApp; se a gravação falhar, guarda no aparelho, reenvia sozinho e abre o WhatsApp do mesmo jeito (testado hoje contra o banco real).
- Todos os vendedores têm WhatsApp válido (12–13 dígitos), condição para o redirecionamento.

**Nova categoria "Sites" (`vitrine.html`, menu web e app, link `?t=sites`), logo abaixo de Acessos:**
- **Para enviar ao cliente:** Seu site (vitrine), Ficha de financiamento (CDC) e Pré-contrato de consórcio (CNH), cada um com explicação, endereço, "Copiar link", "Enviar no WhatsApp" (mensagem pronta), "Compartilhar" (celular) e "Abrir".
- **Só para você (com login, não enviar a clientes):** Seu painel (`/slug/admin`), Fichas de financiamento recebidas (`/slug/cdc#admin`) e Pré-contratos recebidos (`/slug/cnh#admin`).
- Os endereços usam as mesmas funções do site (`siteUrl`, `fichaUrl`), então seguem o modelo de link configurado.
- Testado no Chrome (1280 px, 400 px e modo app), sem erros. **Banco:** não alterado.

## 2026-11-19 — CORREÇÃO: fichas CDC e pré-contratos CNH eram descartados pelo campo anti-robô

- **Sintoma (Dilorran e outros):** cliente preenchia o pré-contrato, via "Pré-contrato enviado!" com o botão "Avisar no WhatsApp", mas nada chegava em "Pré-contratos recebidos". Nenhum contrato nem ficha entrou no banco desde 17/11 (de nenhum vendedor).
- **Causa (reproduzida no Chrome contra o banco real):** o campo escondido anti-robô (`#hp`, fora da tela com `left:-9999px`) é preenchido pelo **preenchimento automático do celular**. Com ele preenchido, o formulário fazia `return fim({})`: mostrava a tela de sucesso e **não gravava nada** (nem o lead de reserva). Banco, RLS e API estavam certos (envio direto pela API = HTTP 201).
- **Correção (SITE-CNH 91adf51 e SITE-CDC 38e210d, só `index.html`):** campo com `display:none` (o autopreenchimento não preenche; robôs ainda sim) e nome próprio; só descarta se o campo vier preenchido **e** o envio acontecer em menos de 8 s do carregamento (impossível para uma pessoa com ~20 campos); fora isso grava normalmente e marca `obs`: "Atenção: o campo anti-robô veio preenchido... Confira os dados."
- **Teste real (dados de teste apagados depois):** CNH e CDC, com e sem o campo preenchido: os 4 envios gravaram no vendedor certo (dilorran), com e-mail, lead e abertura do WhatsApp; a marcação apareceu nos 2 casos com o campo preenchido. Versão publicada conferida em www.sitevendedor.com.
- **Fichas completas que ficaram só como rascunho:** Victor Gabriel Tavares Amanajás e Victor Amanajás (site do Dilorran, 19/11) e Bruno Marcel (site do Bruno, 15/11). Parecem testes dos vendedores; os dados estão em `rascunhos` e aparecem como rascunho em Clientes.
- **Banco:** não alterado. **Pendente:** pedir aos vendedores que testem de novo; a vitrine e o comercial não usam esse campo.

## 2026-11-19 — Cartão à vista: juros sobre o preço com desconto e tabela de parcelas

- **Conferência com a regra do dono (imagem do WhatsApp):** débito/crédito 1x sem juros; parcelado no crédito até 3x 5%, até 5x 10%, até 10x 20%. As faixas do commit 0ba7e09 batiam.
- **Erro corrigido:** nas motos em promoção (Black Friday), o total com juros era calculado sobre `m.preco` (preço cheio ou de outro vendedor), não sobre o preço com desconto. Ex.: ELITE 125 dava 10x sobre R$ 18.990; agora é sobre R$ 16.490 (10x de R$ 1.978,80, total R$ 19.788,00). Base nova `ccBase(m)` = preço da oferta (`ofM(m).por`) ou, sem oferta, o preço à vista.
- **Detalhe da moto:** a frase das regras virou uma tabela "No cartão" com o valor de cada faixa: 1x sem juros, 3x de, 5x de, 10x de, com o total de cada uma, dizendo se é sobre o preço com desconto.
- **Chat:** a pergunta do cartão mostra a parcela e o total de cada faixa; o cliente pode digitar qualquer número de 1 a 10 (ex.: 7 → faixa de 20%, 7x de R$ 2.826,86). O pedido grava vezes, juros, parcela e total (ex.: "7x no crédito (juros de 20%) · 7x de R$ 2.826,86 · total R$ 19.788,00").
- **Cálculo:** total = preço à vista × (1 + juros da faixa); parcela = total ÷ número de vezes; 2x e 3x usam 5%, 4x e 5x 10%, 6x a 10x 20%.
- **Arquivo:** `vitrine/vitrine.html` (funções expostas `ccTabH`, `ccSim`, `ccBase`). Testado no Chrome (400 px), sem erros. **Banco:** não alterado.
- **A confirmar com o dono:** se 2x cai na faixa de 5% (como "até 3x") e se o juros é percentual único sobre o total (não ao mês).

## 2026-11-19 — Cliente sem moto some das listas e das contagens; cartão à vista com as regras de juros

**1. Cliente que não escolheu a moto (banco, migration `clientes_sem_moto_ocultos`).** Não é mais contado, não aparece para o vendedor nem no Admin Geral e não dispara aviso. Aplicado no banco (policies de leitura das 5 tabelas, funções do Admin Geral, avisos e gatilhos), então vale para o painel do vendedor, o app e o Admin Geral de uma vez. Hoje isso esconde 94 rascunhos e 2 pedidos do chat. Os dados continuam no banco: se o cliente escolher a moto depois, ele aparece sozinho. Regra e lista de pontos em `supabase/DATABASE_RULES.md`.
- Conferido com um vendedor de teste: dos 35 rascunhos dele, vê os 24 que têm moto.

**2. Cartão na compra à vista (`vitrine/vitrine.html`).** Regra enviada pelo dono: débito ou crédito em 1x **sem juros**; parcelado no crédito **até 3x 5%, até 5x 10%, até 10x 20%**. Antes o chat oferecia "Até 6x", "Até 12x" e "Mais de 12x" (um cliente chegou a escolher 12x).
- As opções agora são só as 4 acima, com o juros de cada faixa; quando a moto tem preço à vista, o chat mostra o **total com juros** de cada faixa. Quem digitar mais de 10x recebe o aviso de que o máximo é 10x.
- O pedido salvo leva a faixa, o juros e o total (ex.: "Até 3x no crédito (juros de 5%) · total R$ 15.739,50").
- Em "À vista" entram "Débito ou crédito (1x, sem juros)" e "Parcelar no cartão"; o detalhe da moto mostra as regras junto do preço à vista.
- Juros tratado como percentual único sobre o preço à vista (total = preço × (1 + juros)); a parcela exata depende de quantas vezes o cliente escolher dentro da faixa. **A confirmar com o dono** se é isso mesmo.
- Pedidos antigos com "Até 12x" / "Mais de 12x" (3 no banco) ficam como estão.

## 2026-11-19 — E-mail obrigatório também no Financiamento do site do vendedor

Continuação do pedido de e-mail obrigatório. A tela "Financiamento" do site do vendedor (nome, telefone, CPF, nascimento) não pedia e-mail; o dono mandou a tela e pediu para pedir também ali.

**`vitrine/vitrine.html`:**
- **Formulário de Financiamento:** novo campo **E-mail** (depois do telefone), validado; bloqueia o envio se vazio ou inválido. Vai na mensagem do WhatsApp, no rascunho automático e no lead.
- **Chat, caminho Financiamento:** nova pergunta de e-mail (`f_email`) antes de "Você possui habilitação?". O caminho Consórcio do chat já perguntava (`c_email`, obrigatório). O e-mail entra na mensagem e no lead de reserva do chat.
- **Painel do vendedor:** a ficha do lead mostra o e-mail.
- Consórcio pela tabela (botões "Simular e preencher meus dados") usa o chat, então já pedia e-mail. À vista e cartão continuam sem pedir, como antes.

**Banco (migration `leads_email`):** nova coluna `public.leads.email` (text), porque a tabela não tinha. As fichas CDC (`fichas.email`) e CNH (`contratos.email`) já tinham.

**Resumo dos 4 pontos de coleta:** CNH (já exigia) · CDC (passou a exigir, commit 13b2010 → ver entrada anterior) · Financiamento do site (novo) · Chat de financiamento (novo).

## 2026-11-19 — E-mail do cliente obrigatório nas fichas CDC e CNH

**Pedido do dono:** pedir o e-mail do cliente, obrigatório, ao preencher a ficha de financiamento (CDC) e o pré-contrato de consórcio (CNH).

- **CNH (`site-cnh`):** já era obrigatório (asterisco no campo e validação de formato). Nada a mudar.
- **CDC (`site-cdc`):** era opcional, só validava o formato se fosse preenchido. Agora tem asterisco e bloqueia o envio se estiver vazio ou inválido ("Informe um e-mail válido"). Mudança de 2 linhas em `index.html`.

**Banco:** nada alterado (a coluna de e-mail já existia nas duas tabelas). Fichas antigas sem e-mail continuam como estão.

## 2026-11-19 — Calculadora sai do vendedor e vai para o Admin Geral

**Pedido do dono:** a calculadora de consórcio estava complicada demais para o vendedor; tirar de lá e colocar no Admin Geral, para melhorar depois.

**Vendedor (`vitrine/vitrine.html`, commit bdc99d1):** removidos o item **Calculadora**, o item **Comparar** do menu, os botões **Calcular / Comparar / Planos** das fichas de clientes e dos contatos, e todo o código (cerca de 500 linhas). O histórico já salvo em `public.simulacoes` continua no banco, sem uso por enquanto.

**Admin Geral (`comercial/index.html`, commit bdcff08):** nova aba **Calculadora** (grupo Gestão, depois de Supervisores) com as três telas que existiam: Calculadora, CDC x Consórcio e Comparar planos. Mesmas contas da versão corrigida hoje (reposição diluir/entrada, total do plano, lance).
- Roda numa página isolada (iframe), para não misturar com as variáveis do painel; o código fica em `<script type="text/plain" id="calcsrc">` (base64), como a aba Catálogo.
- **Preços:** tabela oficial da Honda por região, escolhida no topo: **Região A** (AC, AM, RO, RR) ou **Região B** (demais estados). Não depende mais do catálogo de nenhum vendedor.
- **Uso avulso:** sem cliente e sem histórico. Dá para preencher "Assinar proposta como" e WhatsApp, que saem no texto e na imagem da proposta.

**Banco (migration `mestre_calc_catalogo`):** função `mestre_calc_catalogo()` devolve as motos ativas com os planos das regiões A (`catalogo_mestre.planos`, 31 motos) e B (`catalogo_planos_regiao`, 27 motos). `SECURITY DEFINER`, protegida por `_exige_dono()`; sem acesso para `anon`.

**Testes:** página carregada num Chrome sem cabeçalho, com erro zero: calculadora com reposição, CDC x Consórcio, Comparar planos e troca de região; nomes de moto com `$&` e `</script>` carregam sem quebrar. Conferido que nenhum nome removido do vitrine ficou sendo usado.

**Pendências:** a aba usa fundo claro mesmo no tema escuro do admin; a parte que gerava proposta já com os dados do cliente (histórico por cliente) foi desligada junto, e volta quando a calculadora for refeita. A retirada de "Notificações" só da versão web continua pausada.

## 2026-11-19 — Calculadora de consórcio: cota de reposição, total do plano e lance sem perda

**O problema relatado:** mudando as "parcelas restantes" na Reposição, o valor da parcela não mudava. Confirmado: a conta ignorava o que o grupo já tinha pago. No exemplo da tela (CG 160 START, Acre, crédito R$ 19.734,00, 60x de R$ 463,18, 38 restantes), o cliente pagaria 38 × 463,18 = **R$ 17.600,84** — menos que o próprio crédito.

**Regra aplicada:** numa cota de reposição o grupo já rodou (prazo − restantes) parcelas, e quem assume deve esse acumulado. Ele entra de um dos dois jeitos, à escolha do vendedor, e nos dois o total fecha com o da cota cheia (prazo × parcela):
- **Diluir nas parcelas que faltam** (padrão): 38x de **R$ 731,34**. Total R$ 27.790,92.
- **Cobrar como entrada:** entrada de **R$ 10.189,96** (22 parcelas) + 38x de R$ 463,18. Total R$ 27.790,80.

**Outros defeitos corrigidos no mesmo cálculo:**
- **Lance com "quitar as parcelas do final":** a sobra sumia. Num lance de R$ 5.000 que quitava 6 parcelas, R$ 611,96 eram pagos sem abater nada. Agora a sobra reduz as parcelas que ficaram, e só restam os centavos que não dividem igual.
- **Lance maior do que as parcelas conseguem absorver:** era ignorado em silêncio. Agora avisa e diz qual é o máximo.
- **Cota nova com as parcelas restantes de uma simulação anterior** podia recalcular errado: a cota nova sempre vai até o fim do prazo.

**Na tela e na proposta:** novas linhas de "parcelas que o grupo já pagou", "entrada para assumir a cota" e **"total que o cliente vai pagar"** — na tela, no texto do WhatsApp e na imagem (no cabeçalho da imagem, para não cortar o rodapé). A mesma regra vale na **Comparação de planos** e no **CDC x Consórcio**, que antes subestimavam o consórcio na reposição.

**Testes:** 72 combinações de prazo, tipo de cota, lance e modo de quitação — em todas o total fecha com a cota cheia (diferença máxima de R$ 0,44, de arredondamento de centavos); 10 combinações passaram a ser recusadas com aviso (lance sem onde ser abatido). Cota nova conferida sem nenhuma mudança de valor. Sintaxe dos 4 blocos de script do arquivo verificada.

**Arquivo:** `vitrine/vitrine.html`. **Banco:** nada alterado.

**A conferir com a administradora:** qual das duas formas (diluir ou entrada) a concessionária usa de fato na reposição. A conta está correta nas duas; o padrão hoje é diluir.

## 2026-11-19 — Segunda fonte das tabelas do consórcio: segundo host oficial + histórico datado

Pedido: não ficar dependendo só do site do Consórcio Nacional Honda, caso ele caia. A fonte principal **continua a mesma**; isto é o que entra quando ela falha.

**1. Segundo host oficial, com failover automático.** `honda_fila_pegar()` agora manda ao coletor a lista de hosts (`bases`), de `plataforma_config.honda_base` + **`honda_base_alt`** (novo: `https://www.hondaservicosfinanceiros.com.br`, que serve o mesmo JSON). O coletor tenta na ordem, usa o primeiro que responder e mantém esse host à frente nas UFs seguintes. Fica gravado em `honda_sync_logs.conexao` qual host foi usado e quais falharam.

**Testado de verdade** (execução 42): apontei `honda_base` de propósito para `acqdev.consorcionacionalhonda.com.br` (404). O coletor registrou a falha, caiu no segundo host (HTTP 200) e coletou o Acre: 28 motos, 28 detalhes, 0 erros e **0 alterações** — ou seja, a tabela do segundo host é igual à do principal. `honda_base` foi restaurado em seguida.

**2. Histórico datado das tabelas.** Antes só existia a última coleta boa, sobrescrita. Agora cada versão distinta da tabela fica guardada com data em `honda_tabela_versoes` (dedupe por `hash_tabela`): 2 linhas hoje, região A (AC, AM, RO, RR) e região B (os outros 23), 249 parcelas cada. Linha nova só quando a Honda muda valor.
- `honda_tabela_versionar()` (idempotente): chamada pelo coletor ao fim da execução e pelo cron novo `honda_tabela_versionar` (`52 12,20 * * *`). Testada: 2 novas na 1ª vez, 0 novas e 2 revistas na 2ª.
- `mestre_honda_versoes(p_id)`: leitura só do dono (lista as versões, ou a tabela de uma versão).
- RLS ligada, sem acesso de `anon`/`authenticated`.

**Banco alterado:** sim (migração `honda_segunda_fonte_historico_e_failover`). **Edge Function:** `honda-sync` v3. **Site:** nada alterado — nenhuma tela de vendedor ou de cliente mudou.

**Importante, apurado na busca:** **não existe** segunda fonte oficial que publique a tabela regional. Todo endereço Honda que tem a tabela está atrás da mesma infraestrutura (Imperva); `honda.com.br` publica só o Preço Público Sugerido nacional, que não é o crédito do consórcio. Testes um por um em `docs/HONDA_API.md`.

**Planos por modelo (confirmado com o responsável):** POP 110i e CRF 300F são `#voudeHonda` (sem "+"), e é assim mesmo. Os outros 16 modelos da linha são `#voudeHonda+` com seguro; a alta cilindrada é `Advance`.

**Pendente:** terceiro caminho de rede (endpoint na Vercel) contra bloqueio de IP nos dois hosts; conferência automática pela fórmula (alerta acima de 2 centavos).

## 2026-11-19 — Revisão completa do projeto (6 repositórios + Supabase) e atualização dos documentos

- **Escopo:** leitura dos 6 repositórios (comercial, VITRINE, SITE-CNH, SITE-CDC, Termo, hub), conferência de todas as chamadas `rpc()`/`from()` dos sites contra o banco (as 102 funções chamadas existem), análise do Supabase (tabelas, policies, grants, funções, triggers, storage, cron, Edge Functions, linter de segurança e de performance).
- **Documentos atualizados:** totais do banco (`DATABASE_RULES.md`, `PROJECT_CONTEXT.md`), lista das 8 Edge Functions (`INVENTORY.md`, `DATABASE_RULES.md`), pendências (`KNOWN_ISSUES.md`).
- **Código e banco:** nenhuma alteração.
- **Segurança:** o relatório com os pontos de atenção foi entregue ao responsável em conversa privada; este repositório é público e não detalha falhas.

## 2026-11-19 — Cota da Vez: menu, horário de Rio Branco e mais automação

- **Menu:** "Cota da Vez" agora fica logo abaixo de "Motos" (no modo app, que não tem Motos, continua depois de Acessos).
- **Texto em horário de Rio Branco:** "o sistema confere a cada 15 minutos, das 18h às 20h45 (horário de Rio Branco - Acre)".
- **Busca mais rápida:** `lf_buscar`/`lf_aplicar` agora a cada 15 min das 23:00 às 01:45 UTC (20h–22h45 Brasília = 18h–20h45 Rio Branco); a busca para sozinha quando o resultado do dia já entrou (no máximo 12 consultas por dia). Saíram os 4 horários fixos anteriores.
- **Extração certa por grupo:** cada grupo usa a última extração anterior à sua assembleia (regulamento 9.1). A data da assembleia avança sozinha mês a mês depois que passa (`cv_assembleia_efetiva`), marcada como "(estimada)". O cartão do grupo mostra "Vale para a assembleia de dd/mm" ou "Prévia: ainda sai outra extração antes". Grupo sem data usa a última extração e pede a data. Chips: "Automático por assembleia" ou uma extração escolhida.
- **Aviso no app** só para grupos em que a extração vale (sem data de assembleia, ou até 4 dias antes dela). Testado em transação desfeita: assembleia 19/10 → avançou para 19/11 e avisou; assembleia 30/11 → não avisou.
- **Banco alterado:** sim (migração `cota_da_vez_automacao_por_assembleia`). Arquivo: `vitrine/vitrine.html`. Testado no Chrome (1280 px e app 400 px), sem erros.
- **Pendente:** conferir com uma assembleia real.

## 2026-11-19 — Painel do vendedor: aba "Cota da Vez" (Loteria Federal + Lance Fixo) e "Acessos" como item próprio

**Regra (validada no Regulamento do CNH, versão 07/2025, cláusulas 9.1 a 9.4 e lance fixo):** 1º prêmio da extração de quarta/sábado anterior à assembleia ÷ **número máximo de cotas do grupo**; fração × esse número = cota sorteada (= resto exato da divisão); resultado 0 = maior cota do grupo; cota não apta → +1, −1, +2, −2… Lance Fixo: vence a cota com lance fixo registrado mais próxima da cota contemplada no sorteio, alternando acima/abaixo. A aba antiga "Sorteio" (de 17/11, escondida) usava os últimos algarismos do prêmio, o que não é a regra da Honda: foi substituída. Exemplo real (concurso 6118, 062545): grupo 720 → 625; 936 → 769; 1.200 → 145; 2.000 → 545. Sem resultado de assembleia real para conferir ainda.

**Banco (migração `cota_da_vez_loteria_federal`):**
- `loteria_federal` (concurso, data, 5 prêmios, fonte): única para todos, vendedores só leem.
- `consorcio_grupos` (vendedor, grupo, total de cotas, próxima assembleia), RLS `pode_gerir`.
- `cotas_consorcio` + `lance_fixo`, `origem`, `origem_id`.
- Funções `cota_sorteada(premio, max)` e `cota_fila_pos(ref, cota)`; `lf_buscar()`/`lf_aplicar()` (sem acesso público).
- Crons `lf_buscar`/`lf_aplicar` 23:30/23:32 UTC e `_2` 01:30/01:32 UTC (20h30 e 22h30 Brasília). Fonte: `loteriascaixa-api.herokuapp.com/api/federal/latest` (gratuita); a API da Caixa (403) e a `api.guidi.dev.br` (Cloudflare) bloqueiam o servidor. Valida concurso, data e 5 prêmios; grava só concurso novo; avisa no app (tipo `sorteio`, `fonte: cota`) só vendedores com cliente ativo até 15 cotas da sorteada; se a leitura falhar, avisa o dono (1×/20 h). Concurso 6118 já gravado.
- Teste em transação desfeita: cota 627 num grupo de 720 → aviso "posição 4 da fila" ao vendedor certo.

**Painel (`vitrine.html`):**
- Nova aba **Cota da Vez** (menu web e app; link `?t=cota`): resultado oficial + simulação manual + últimas extrações; **Oportunidades de Lance Fixo** (clientes até 5/10/15/30 cotas, em ordem de fila, selos "É a cota sorteada", "Nª da fila", "Lance Fixo ✓", botão de WhatsApp com mensagem que não promete contemplação); **Meus grupos** (cota sorteada, fila, "Ver a conta" passo a passo); **Cotas dos clientes** (cadastro com nome puxado dos clientes, Lance Fixo, contemplada/cancelada, busca). Notificação da Cota da Vez abre a aba.
- **Acessos**: saiu de dentro de Clientes (troca de abas removida) e virou item próprio logo abaixo de Clientes (web e app; link `?t=acessos`).
- Testado no Chrome (1280 e 400 px, modo app): sem erros; filas conferidas (627 = 4ª no grupo de 720; 772 = 6ª no de 936).

**Banco alterado:** sim. **Pendente:** conferir o cálculo com um resultado real de assembleia quando houver; a API gratuita é de terceiros (se cair, o dono é avisado e o vendedor digita o prêmio).

## 2026-11-19 — Site oficial Honda voltou: tabelas por região ligadas, 2 leituras por dia, revisão de segurança e isolamento

**Tabelas de consórcio**
- **Situação:** o coletor nacional (`honda-sync`) voltou a ler as 27 UFs. Há exatamente 2 tabelas oficiais: região A (AC, AM, RO, RR) e região B (os outros 23 estados). Comparação com o sistema: tudo igual, exceto CG 160 FAN 24x da região A (oficial 1204,78 x sistema 1204,79, do ajuste manual de 18/11); a leitura das 07:00 corrige.
- **Nova função `honda_regioes_aplicar()`:** aplica a região B a partir da coleta oficial (antes vinha de leituras diretas que davam 403), grava só o que mudou (histórico em `catalogo_planos_hist` com "região B:"), reaplica nos vendedores da região B e confere que cada estado tem a tabela da sua região; se algum estado divergir, avisa o dono e pausa a contratação nele. Roda sozinha ao fim da coleta (`_honda_checar_fim`) e às 07:45/15:45 (pula se já aplicou). `regiao_b_iniciar/aplicar` desligados.
- **Região A** (Acre/AM/RO/RR + Motores e Máquinas) continua em `site_sync_*`/`cnh_aplicar`; testado em simulação: 28 motos + 4 M&M lidos, só o centavo da FAN muda.
- **Horários:** todas as leituras do site oficial agora às **07:00 e 15:00 (Rio Branco)**: região A 07:00/15:00, cores 07:20, coletor 27 UFs 07:25, regiões 07:45, fotos 07:50, expansão 07:55 (idem 15h). Cometa (06:00/14:00) e vendedor.site sem mudança de horário.
- **Pergunta "dá para ler só quando mudar?":** não. O site não envia `ETag`/`Last-Modified` nem avisa mudanças; ler é o único jeito de saber. A leitura não grava nada se nada mudou.
- **Bug corrigido (vendedor.site):** a fonte reserva do Acre pulava sempre que *qualquer* fonte gravava "ok" (inclusive a Cometa), então o Acre não era atualizado por ela. Agora só pula se o **site oficial** atualizou nas últimas 26 h.

**Segurança e isolamento** (migração `seguranca_isolamento_revisao_1119`)
- Cometa agora é identificada por `concessionaria_id = 'cometa'` (campo que só o dono muda), e não pelo nome digitável: um vendedor do AM não consegue mais entrar/sair da tabela da Cometa trocando o nome da loja.
- Rotinas agendadas e gatilhos não podem mais ser chamados pela internet: `aviso_preguicosos`, `ps_limpa_senhas`, `tg_conc_contagem`, `tg_hconc_auto`, `tg_sup_regiao`, `tg_vendedor_concessionaria`.
- Retiradas permissões sem uso de `anon`/`authenticated`: TRUNCATE/TRIGGER/REFERENCES em todas as tabelas; escrita em `municipios`; tudo em `aviso_wa_fila`, `concessionarias`, `honda_concessionarias`, `parceiro_indicacoes`, `parceiro_premios` (tinham RLS sem regra, então já não davam acesso). Regras abertas sem uso em `clientes` removidas. `search_path` fixo em 5 funções.
- **Testes reais (transação desfeita):** visitante do site do Victor vê só as 31 motos dele e 0 de outro vendedor; não lê fichas nem leads. Vendedor logado (Victor) vê 0 motos/pedidos/fichas da Layanne, não altera nada dela e não consegue tirar a própria suspensão nem trocar UF/loja. Gatilhos continuam funcionando.
- **Sites:** SITE-CDC e SITE-CNH (fichas com CPF/renda) ganharam os cabeçalhos de segurança que a vitrine já usava (HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP) + bloqueio de abrir dentro de outra página (`X-Frame-Options: DENY`). Nenhum segredo encontrado nos repositórios. Painel da vitrine escapa os textos dos clientes (`esc`).
- **Design:** CDC conferido no celular em produção (sem defeitos visíveis). Sem mudanças visuais nesta rodada.

**Banco alterado:** sim (2 migrações, crons). **Pendente:** conferir no Admin geral › Regiões a 1ª rodada das 07:45; avisos restantes do linter são funções públicas por desenho (checkout, webhooks, `mestre_*` que conferem o dono por dentro), `pg_net` no schema public e a view `vendedor_publico` (filtra pelo vendedor da página).

## 2026-11-18 — Site comercial: "Dúvidas frequentes" depois dos vendedores

- **Pedido:** colocar "Dúvidas frequentes" depois da exibição dos vendedores.
- **Mudança (só `index.html` do comercial):** a seção `#faq` foi movida para depois de `#vendedores` e antes do bloco final "Pronto para ter o seu site de vendas?". Ordem agora: topo, 3 sistemas, planos, vendedores, dúvidas, bloco final. Os links do menu continuam funcionando.
- **Teste:** Chrome real, 1366px, sem erros de JS.
- **Banco:** não alterado.
- **Pendente:** nenhum.

## 2026-11-18 — Site comercial: removidas as seções "Feito para vendedores Honda…" e "Por que vale mais do que custa"

- **Pedido:** tirar essas duas partes da página (para encurtar e levar o vendedor mais rápido ao que importa).
- **Mudança (só `index.html` do comercial):** removidas as seções `#brasil` (com o mapa de estados "Aberto em todo o Brasil") e `#beneficios`, e o link "Para quem é" do menu. O JS que preenchia os estados agora sai sem erro quando o bloco não existe (mantém só o endereço do exemplo no topo). CSS dessas seções ficou sem uso (inofensivo).
- **Teste:** Chrome real, 1366px e 400px, sem erros de JS.
- **Banco:** não alterado.
- **Pendente:** se quiser, limpar o CSS sem uso dessas seções.

## 2026-11-18 — Site comercial: topo resumido, com 3 passos explicando o que o vendedor recebe

- **Pedido:** os vendedores quase não leem o topo e vão direto para os planos/contrato; o topo precisava ser mais curto e explicar rápido o que recebem e como recebem.
- **Mudança (só `index.html` do comercial):** título "O seu site de vendas, com o seu nome." (o JS do destaque dourado continua funcionando); texto de apoio em 1 frase; 3 passos curtos (1 Pague no Pix, com o preço mensal vindo do banco em `#chipP`; 2 Ativa na hora; 3 Receba o seu link: 3 sites e um painel); botões "Conhecer o plano" e "Ver um site de verdade" sobem para antes do bloco "Veja como fica o seu"; a faixa de fatos antiga foi removida (agora dita nos passos). Estilo novo em `<style id="n-passos">`.
- **Teste:** Chrome real, 1366px e 400px, sem erros de JS.
- **Banco:** não alterado.
- **Pendente:** conferir no celular real; se quiser, o mesmo resumo pode aparecer na barra fixa de contratar.

## 2026-11-18 — Botão Compartilhar na tabela de consórcio (vitrine) e vendedores com foto aparecem sozinhos no site comercial

- **Pedido:** 1) na tela "Tabela de consórcio" da moto, ao lado de "Simular e preencher meus dados" e "QUERO UM REPASSE DE CONSÓRCIO", um terceiro botão **Compartilhar** com a mesma ação do Compartilhar dos detalhes (gera a imagem pronta com moto, planos de consórcio e foto/contato do vendedor); 2) todo vendedor com foto de perfil deve aparecer automaticamente na área "Vendedores" do site comercial.
- **VITRINE (só `vitrine.html`, commit 2df0731):** botão `📤 Compartilhar` (`onclick="shareM()"`, classe `btn red2`) na aba `con`; reaproveita o gerador de cartão já existente (v29), sem código novo de desenho.
- **Banco (migration `destaques_automaticos_vendedor_com_foto`):** `ps_publico()` agora lista, em `destaques`, os vendedores não suspensos que têm `vendedores.foto_url` e **não têm linha** em `ps_destaques` (link = `url_vitrine/slug`; ordem: os com `ordem` manual primeiro, os automáticos depois por data de cadastro). Quem tem linha em `ps_destaques` continua mandando: `ativo=false` esconde, nome/foto/site personalizados valem. `ps_admin_destaques()` passou a mostrar como ativo quem aparece automaticamente, para o painel não contradizer o site.
- **Conferido:** 41 vendedores ativos, 40 com foto; antes 37 apareciam, agora 40 (entraram marcos, dilorran e andrezanes); nenhum card sem foto.
- **Site comercial:** sem mudança de código (`drawDest` já usa `destaques` de `ps_publico`).
- **Banco alterado:** sim (2 funções, sem mudança de tabelas).
- **Ajuste posterior (mesmo dia, só `vitrine.html`):** o Compartilhar de "Detalhes da moto" (barra de baixo, com "Tirar dúvida") não foi removido: no celular já aparecia, mas o CSS antigo `.dt-bar{display:none}` o escondia em telas largas (acima de 860px). Agora a barra aparece também nelas, no fim dos detalhes; no celular nada mudou (continua fixa embaixo). O botão da aba "Consórcio" foi mantido.
- **Pendente:** testar o novo botão no celular com a moto aberta em "Tabela de consórcio"; se algum vendedor com foto não deve aparecer, desativar em Vendedores > Destaque (cria a linha com `ativo=false`).

## 2026-11-18 — Vitrine: logo e nome Honda brancos quando o topo é vermelho

- **Pedido:** com o topo em vermelho (`estilo_topo = cor`, classe `html.tp-cor`), o símbolo e o nome "Honda" devem ficar brancos e o fundo escuro que servia de contraste deve sumir.
- **Mudança (só `vitrine.html`, novo bloco `<style id="v52">`):** em `html.tp-cor` o bloco `.hn` perde fundo, borda, sombra e os pseudo-elementos escuros (`::before`/`::after`, inclusive a versão do celular) e o símbolo/nome ficam brancos (`path` com fill branco; logo enviada em imagem é convertida para branco). Sem `tp-cor` nada muda.
- **Teste:** Chrome real, computador e celular (400px): fundo `none`, borda 0, sombra `none`, fill branco, sem erros de JS; topo normal continua igual.
- **Banco:** não alterado.
- **Pendente:** se o vendedor usa uma logo Honda própria colorida (`logo_honda`), ela vira branca no topo vermelho (silhueta); avisar se preferir manter a cor.

## 2026-11-17 — Ajuste de 1 centavo na CG 160 FAN (tabela principal) e 3 motos da Cometa criadas no catálogo

- **Pedido (autorizado pelo responsável):** aplicar o centavo da CG 160 FAN e criar as motos que só a Cometa tem.
- **Banco, tabela principal:** CG 160 FAN 24x com seguro 1.204,78 → **1.204,79** (confere com a tabela AC/AM/RO/RR de 05/11/26 e com a Cometa); sem seguro (1.196,50) e demais prazos intactos; feito por `_mestre_aplicar` (acompanhou os vendedores do Acre; região B e Cometa protegidas pelo gatilho) e registrado em `catalogo_planos_hist`.
- **Banco, motos novas (inativas):** `CBR 650R` (Street, Advance, 72x R$ 1.040,77, crédito 58.113), `CB 1000R` (Street, Advance, 72x R$ 984,45, crédito 57.715), `CRF 250F` (Off Road, #voudeHonda, 24x a 80x, crédito 24.774; contemplações iguais às da CRF 300F). Valores vindos só da Cometa e marcados `estimado`: o crédito da Cometa pode ser diferente do "valor do bem" oficial usado nas outras motos (ex.: CB 500 Hornet: Cometa 43.470, catálogo 45.748). Criadas com `ativo=false` e `sync_site=false` porque **não têm foto**; nenhum vendedor recebeu essas motos. Ordem 31 a 33.
- **Banco, schema:** migration `cometa_mapa_por_id_do_catalogo`: `cometa_mapa.catalogo_id` (moto sem `fonte_slug` também pode ser lida da Cometa) e `cometa_aplicar` passou a escolher a moto por ele. Primeira leitura depois do ajuste: 30 motos, 30 sem mudança, 3 tabelas semeadas (`COMETA-AM`), 0 para revisar, 0 fora do catálogo.
- **Pendente:** 1) adicionar fotos (e descrição) nas 3 motos no admin geral e ativá-las; 2) conferir o crédito dessas 3 motos com a Honda; 3) o site oficial da Honda continua fora do ar (volta como fonte principal das outras regiões).

## 2026-11-17 — Cometa Motocenter Manaus: tabela própria, lida do site da loja 2x ao dia (separada do Acre)

- **Pedido:** a loja de Manaus (Cometa Motocenter) deve ficar sempre igual ao site da própria loja (`manaus.cometahondamotocenter.com.br/consorcios`), **sem ligação com o vendedor.site**, que é só do Acre. O site oficial da Honda segue como fonte principal de todas as regiões, quando voltar.
- **Situação encontrada:** só existiam a tabela principal (Acre/região A) e a da região B. Os 2 vendedores da Cometa (`victor`, `andrezanes`; `uf=AM`, `concessionaria` Cometa) recebiam a tabela principal, então qualquer mudança vinda do vendedor.site chegaria neles. Isso foi desfeito.
- **Fonte lida:** a página da Cometa monta a lista por uma API pública (`api.autodromo.app/v1`, canal 2599) com a chave que a própria página publica no HTML (sem login, sem captcha). A chave não é guardada: é lida da página a cada rodada. O acesso foi autorizado pelo responsável.
- **Feito (banco):** migrations `fonte_cometa_manaus_tabela_propria` (20261117225437), `cometa_aplicar_prazos_proprios` (20261117225618), `catalogo_planos_regiao_permite_cometa` (20261117225646, o CHECK da coluna `regiao` passou a aceitar `'COMETA-AM'`). Tabela `cometa_mapa` (slug da Cometa → moto do catálogo; 27 motos; RLS ligado, sem acesso de anon/authenticated). A tabela da Cometa fica em `catalogo_planos_regiao` com `regiao='COMETA-AM'`. Funções: `_eh_cometa(vendedor)`, `cometa_iniciar()`, `cometa_buscar()`, `cometa_aplicar(p_simular)`, `_cometa_avisar(text)`; `tg_motos_regiao` e `regiao_reaplicar` ganharam um ramo para vendedor da Cometa (usa `COMETA-AM`; moto que a Cometa não lista continua vindo da tabela principal). Crons: `cometa_iniciar` (`0 11,19 * * *` UTC = 06:00 e 14:00 em Rio Branco), `cometa_buscar` (minuto 1), `cometa_aplicar` (minuto 4).
- **Regras:** lê até 4 páginas; menos de 20 motos, erro, JSON estranho ou números fora do normal = nada é alterado e o dono recebe aviso (no máx. 1 a cada 10 h); prazos errados da Cometa (15, 45, 46, 58, 62) são levados ao prazo mais próximo do catálogo (até 4 meses, sem repetir); a tabela da Cometa pode ter menos prazos que a principal (a Cometa não tem 99x na CG 160 FAN, TITAN e START); variação acima de 15% ou desigual entre prazos vai para "revisar"; só mudança de parcela acima de 5 centavos recalcula o valor sem seguro (marcado `estimado`); não cria nem desativa moto; Acre e região B não são tocados.
- **Primeira execução real:** 30 motos lidas, 24 iguais (tabela semeada), 3 alteradas só para os vendedores da Cometa (CRF 300F 48x 701,54→701,51; CG 160 FAN 24x 1.204,78→1.204,79 e sem 99x; CG 160 TITAN sem 99x), 0 para revisar. Motos da Cometa que não temos no catálogo (não criadas): CBR 650R 2024, CB 1000R 2024, CRF 250F 2025.
- **Testado:** simulação antes de gravar; aplicação real; conferência dos vendedores AM e AC; teste em transação desfeita: com a tabela principal alterada em +R$ 9,00, os vendedores do Acre acompanharam e os da Cometa **não**.
- **Conferência da tabela do Acre (05/11/26, AC/AM/RO/RR) enviada pelo responsável:** todos os valores batiam com o catálogo, exceto CG 160 FAN 24x (1 centavo) e o 99x da CG 160 START (oculto de propósito). A tabela principal **não foi alterada** neste registro.
- **Pendente:** 1) a tabela principal (Acre) ainda tem 1.204,78 na CG 160 FAN 24x; a tabela de 05/11 e a Cometa dizem 1.204,79, falta o responsável autorizar; 2) a fonte da Cometa depende da chave pública da página, se ela mudar o sistema avisa e não altera nada; 3) o site oficial da Honda continua fora do ar; 4) a CRF 300F é lida como #voudeHonda no catálogo; 5) tela no admin geral para ver a leitura da Cometa (não feita).

## 2026-11-17 — Integração nacional com a API do Consórcio Honda (27 estados) + tela "Tabelas Honda"

- **Pedido:** integrar com a fonte oficial (`consorcionacionalhonda.com.br`), as 3 rotas do projeto `rochajrdev/consorcio-honda`, 27 UFs com valores próprios, prioridade #Vou de Honda+, atualização automática, histórico de alterações, botão "ATUALIZAR TABELAS AGORA" e testes reais.
- **Investigação (real):** o projeto de referência foi clonado e lido (GET simples, sem token, as mesmas rotas que já usávamos). O site oficial está **fora do ar para todo mundo**: todas as rotas e páginas respondem **404 "Web Site Not Found"** da hospedagem (antes, 403 "Access denied"), confirmado pelo banco, por navegador em outra rede e por verificador público; `consorciohonda.com.br` e `hondaservicosfinanceiros.com.br` também. Nenhuma rota pôde ser testada com resposta real. Detalhes em `docs/HONDA_API.md`.
- **Feito (banco):** migrations `honda_api_nacional`, `honda_api_nacional_fix_resumo`, `honda_api_nacional_crons`, `honda_api_nacional_fix_passo`, `honda_api_nacional_consulta_interna`. Tabelas `honda_regions`, `honda_plans_config`, `honda_vehicles`, `honda_plans`, `honda_vehicle_plans`, `honda_installments`, `honda_sync_logs`, `honda_sync_queue`, `honda_price_history` (RLS ligado, sem acesso de anon/authenticated). Funções de gravação/validação/histórico (`honda_gravar_uf` e auxiliares), fila (`honda_iniciar`, `honda_fila_pegar`, `honda_passo`, `honda_agendar`), conexão (`honda_conexao_registrar`), painel (`mestre_honda_painel`, `mestre_honda_consulta`, `mestre_honda_atualizar_agora`, só o dono). Chaves novas: `plataforma_config.honda_base`, `plataforma_config.honda_conexao`, `segredos.honda_sync_token`. Crons `honda_agendar` (toda hora, minuto 7) e `honda_passo` (a cada 2 min).
- **Feito (coletor):** função de borda `honda-sync` (v2; código em `supabase/functions/honda-sync/index.ts`): rotas centralizadas, sonda de conexão, lista por categorias com plano B na lista simples, timeout 20 s, 3 tentativas com espera crescente, 3 pedidos simultâneos, JSON original entregue ao banco.
- **Feito (tela):** `comercial/index.html` (painel embutido do admin geral) › Catálogo › botão **🗺️ Tabelas Honda (27 estados)**: situação do site oficial, ATUALIZAR TABELAS AGORA, última atualização, estados atualizados, modelos, planos, estados com erro, alterações; consulta por estado → moto → plano (#Vou de Honda+ primeiro) com todos os prazos, parcela com e sem seguro, crédito e contemplações; aviso quando o dado tem mais de 26 h; grade dos 27 estados; alterações; execuções. Commit d227357.
- **Não mexido:** a atualização antiga do catálogo (`site_sync_*`, Acre e região B) e a fonte alternativa `vsite_*` continuam como estavam. O que os vendedores mostram aos clientes **não mudou**: as tabelas nacionais ficam no banco e no painel até você decidir ligar os preços por estado nos sites.
- **Testado:** ver lista em `docs/HONDA_API.md` (gravação, mudança de preço, 3 falhas, coletor local, coletor real contra o site fora, ponta a ponta com API simulada, agendamento real, segurança pela API pública, tela no Chrome 1280/400 px).
- **Erro meu durante o teste:** no teste ponta a ponta com a API simulada, a fila dos outros 26 estados não foi limpa; eles deram 404 e **o dono recebeu um aviso de teste** ("Tabelas Honda… com erro: 26"). Pode ignorar. Os dados do teste foram apagados e a configuração real restaurada.
- **Pendente:** 1) quando o site voltar: conferir as respostas reais, os campos de `/api/site/consorcio/planos` e da rota de categorias, outras requisições do site e comparar valores com a página; 2) decidir se os sites dos vendedores passam a usar a tabela do estado do vendedor (hoje: Acre e região B); 3) taxa de administração, fundo de reserva e seguro separados só se a API trouxer; 4) a página oficial do #Vou de Honda+ cita prazos de 12 a 80 meses, mas o catálogo lido em 15/11 tinha 99x nesse plano: conferir quando o site voltar.

## 2026-11-17 — Painel web do vendedor: aba Notificações removida (continua no app)

- **Pedido:** tirar "Notificações" só do painel do vendedor no site (navegador); manter no app.
- **Feito:** `navLista()` agora devolve o menu sem a aba no modo site; no modo app (`NAV_APP`) a aba continua. O link direto `?t=avisos` no site volta para o Início. O aviso flutuante no canto da tela (quando chega cliente novo) não foi mexido.
- **Banco de dados:** não alterado.
- **Testado no Chrome real (1280 px):** site: menu sem Notificações e `?t=avisos` cai no Início; app (`?app=1`): menu com Notificações e a tela abre; sem erros de JS.
- **Arquivo:** `vitrine/vitrine.html` (commit 157f815). O espelho `apps/vitrine/` ainda mostrava ce34233 na hora do registro; a Action atualiza sozinha.
- **Pendente:** nenhum.

## 2026-11-17 — Catálogo: nova fonte alternativa (página do vendedor.site) 3x ao dia, enquanto o site oficial bloqueia

- **Situação encontrada:** a atualização automática lê o site oficial (`consorcionacionalhonda.com.br`, API por estado) e vinha falhando com **HTTP 403 "Access denied"** desde 16/11 (última leitura boa: 15/11 21:40 UTC; 4 erros seguidos no `site_sync_log`). O bloqueio vem do próprio site oficial contra o banco; não foi contornado. Busca na web: não há outra fonte pública confiável com a tabela de preços por região (só notícias antigas e sites de FIPE, que não trazem as tabelas do consórcio).
- **Fonte alternativa (pedido do responsável):** `https://vendedor.site/martinsdahonda` (página pública, sem login). Lida pelo banco sem problema (HTTP 200). O leitor de tabelas que já existia (`site_sync_parse`) entendeu as 26 motos da página, com todos os prazos, "Com/Sem emplacamento", "(70% do valor)" e "+10%".
- **Conferência antes de ligar:** 26 de 26 itens da página casaram com o catálogo (por nome) e os valores bateram com os do catálogo, que veio do site oficial em 15/11 (diferenças só de centavos de arredondamento). Logo a página reproduz a tabela que o catálogo já usa. **Não confirmado:** a página não informa a região (o DDD 68 do telefone sugere Acre, é só inferência), então ela só alimenta a tabela principal (Acre/região A), nunca a região B.
- **Feito (banco):** migration `vsite_fonte_alternativa_catalogo` (20261117154717). Funções novas `vsite_iniciar()` (baixa a página), `vsite_aplicar(p_simular)` (lê, valida e grava) e `_vsite_avisar(text)` (aviso ao dono, no máx. 1 a cada 20 h); sem execute para `anon`/`authenticated`. Chave `vsite_url` em `plataforma_config`. Crons novos `vsite_iniciar` (`20 11,16,21 * * *` UTC = 08:20, 13:20 e 18:20 em Brasília) e `vsite_aplicar` (3 min depois).
- **Regras de segurança (iguais ou mais duras que as do site oficial):** o **site oficial continua sendo a fonte preferida**: se ele atualizou com sucesso nas últimas 6 h, esta rotina não mexe em nada (grava "pulado"); mesma trava de execução única do site oficial; página com menos de 20 motos, resposta com erro ou números fora do normal = **nada é alterado** e o dono recebe aviso; respeita `sync_site`, `ignorar`, `prazos_ocultos` (ex.: CG 160 START continua sem 99x) e `emp_fixo`; só aplica se os prazos da página forem os mesmos do catálogo; variação acima de 15% ou desigual entre prazos vai para "revisar" (não aplica); não cria, não desativa nem suspende moto (a CRF 300F não está na página e segue como está); região B não é tocada.
- **Ponto de atenção (decisão a confirmar):** a página só traz a parcela com seguro. Quando a parcela muda, `valor` vem da página e **`credito` e `valor_sem_seguro` são ajustados na mesma proporção e marcados `"estimado": true`**, e o dono é avisado; quando o site oficial voltar, ele regrava tudo com os valores exatos. Se preferir que mudança de preço só seja aplicada com o site oficial (e esta fonte apenas avise), é só trocar.
- **Testado:** simulação e rodada real de ponta a ponta (download → leitura → aplicação): 26 lidas, 0 alteradas, 26 sem mudança, 0 para revisar; teste de mudança de preço em transação **revertida** (catálogo alterado -4%): a rotina devolveu exatamente os valores originais (parcela, crédito e sem seguro) e mandou para revisão uma variação de 22%. **Não testado:** uma mudança real de preços na página, e a rodada agendada (primeira: hoje 16:20 UTC).
- **Pendente:** 1) **região B (SP) segue parada** desde 15/11: só o site oficial traz essa tabela; 2) o aviso de falha do site oficial continua saindo a cada 20 h ("nada foi alterado"), mesmo com esta fonte cobrindo a tabela principal; 3) se o vendedor.site mudar o layout, a rotina aborta e avisa; 4) a página é de terceiro: não é fonte oficial da Honda, por isso o site oficial tem prioridade quando voltar; 5) a aba Sorteio do admin geral segue aguardando a definição de como deve funcionar.
- **Arquivos de site:** nenhum alterado (só o banco).

## 2026-11-17 — Sorteio: escondido dos vendedores (reservado ao admin geral)

- **Pedido do responsável:** a aba Sorteio não deve aparecer para os vendedores; deve ficar só para o admin geral, e a função "não deveria funcionar assim" (jeito ainda a definir).
- **Feito:** aba removida do menu do painel do vendedor (e o link direto `?t=sorteio` volta para o Início); o código da tela fica no `vitrine.html`, sem acesso. Os dois avisos agendados (`lf_aviso_dia`, `lf_aviso_resultado`) foram **removidos do cron** para nenhum vendedor receber aviso de sorteio. Tabelas `cotas_consorcio` e `lf_resultados` e a função `lf_aviso` continuam no banco, vazias.
- **Banco de dados:** alterado (só `cron.unschedule` dos dois agendamentos).
- **Arquivo:** `vitrine/vitrine.html` (commit ce34233). Espelho atualizado.
- **Pendente:** definir com o responsável como a função deve funcionar no painel do admin geral (painel mestre, no repositório comercial) e refazer lá.

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
