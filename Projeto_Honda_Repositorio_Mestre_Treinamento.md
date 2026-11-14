# PROJETO HONDA --- REPOSITÓRIO MESTRE COMPLETO

## Guia de treinamento, organização, documentação e continuidade para Claude

## Missão principal

Este repositório é a fonte central de referência do **Sistema do
Vendedor Honda**. O objetivo é reunir e manter organizados todos os
arquivos, códigos, páginas, scripts, regras, configurações
documentáveis, estruturas de banco de dados, decisões técnicas e
informações necessárias para compreender, atualizar e dar continuidade
ao projeto.

Claude deve tratar este repositório como um arquivo mestre vivo:
consultar seu conteúdo antes de realizar alterações e atualizar a
documentação e os arquivos pertinentes ao concluir cada tarefa.

**Não presumir que o projeto está totalmente documentado antes de fazer
um levantamento real dos repositórios, sites, integrações e banco de
dados disponíveis.**

## 1. Inventário integral do projeto

No início do trabalho, Claude deve inspecionar os repositórios GitHub e
as fontes de projeto acessíveis, identificando todos os componentes
existentes. O projeto pode conter vários sites por vendedor; a
quantidade exata deve ser descoberta, não presumida.

Registrar, para cada site ou aplicação:

-   Nome e finalidade.
-   URL, caminho ou identificador, se disponível.
-   Vendedor ou contexto a que pertence, sem registrar dados pessoais
    desnecessários.
-   Arquivos e diretórios correspondentes.
-   Todos os arquivos `index.html` existentes.
-   JavaScript, CSS, imagens, fontes e demais recursos.
-   APIs, integrações e dependências.
-   Funcionalidades existentes e seus fluxos.
-   Configurações de publicação/deploy, quando acessíveis.
-   Relações com outros sites, módulos ou banco de dados.

Não omitir sites, arquivos, módulos ou versões só porque parecem
duplicados. Identificar duplicações e explicar se são cópias, variantes
ou partes compartilhadas.

## 2. Conteúdo que deve ser documentado

Reunir e manter atualizados todos os itens relevantes que forem
encontrados no projeto:

### Aplicações e interfaces

-   Todos os sites e páginas do sistema.
-   Cada `index.html` e os arquivos associados.
-   Formulários, calculadoras, telas, painéis administrativos e fluxos
    de cliente/vendedor.
-   Componentes compartilhados e diferenças específicas entre
    vendedores.
-   Responsividade e comportamento em dispositivos móveis.

### Funcionalidades e regras de negócio

-   Catálogo de motos Honda, nomes, modelos, cores, imagens e
    descrições.
-   Preços, parcelas, planos de consórcio e regras de exibição.
-   Simulações de financiamento e consórcio, conforme implementadas.
-   Cadastro e gestão de vendedores.
-   Cadastro, encaminhamento e tratamento de clientes.
-   CRM e integrações de WhatsApp, se existentes.
-   Permissões, funções administrativas e isolamento de dados.
-   Automações e atualizações programadas.
-   Todas as regras e exceções encontradas no código ou confirmadas pelo
    responsável.

Não inventar regras Honda ou valores comerciais. Diferenciar regras
confirmadas, regras inferidas do código e itens que ainda precisam de
confirmação.

### Banco de dados e Supabase

Documentar, quando acessível:

-   Tabelas e colunas, tipos, defaults e restrições.
-   Chaves primárias e estrangeiras e relações.
-   Índices, views, funções, triggers e procedures.
-   Políticas de Row Level Security (RLS).
-   Papéis e permissões.
-   Edge Functions e integrações.
-   Migrations SQL, ordem e finalidade.
-   Dependências entre aplicação e banco.
-   Processos de sincronização e atualização de dados.

Manter migrations e scripts SQL versionados no repositório, seguindo a
estrutura já existente. Documentar se um script está apenas preparado,
se foi aplicado em ambiente de teste ou se sua execução em produção foi
confirmada.

### Segurança, operação e manutenção

-   Autenticação e autorização.
-   Proteção de dados e isolamento entre vendedores.
-   Validação de entradas e tratamento de erros.
-   Dependências e versões identificáveis.
-   Processo de build, teste, deploy e rollback.
-   Limitações conhecidas, riscos e pendências.
-   Rotinas de manutenção e atualização.

Nunca armazenar no GitHub senhas, tokens, chaves privadas, credenciais
de banco, chaves `service_role`, dados reais de clientes ou segredos em
arquivos de contexto. Documentar apenas nomes de variáveis e
placeholders seguros. Não expor conteúdo sensível em logs ou changelogs.

## 3. Estrutura documental recomendada

Primeiro, preservar a estrutura atual do repositório. Complementar ou
adaptar com uma organização semelhante a esta, se apropriado:

``` text
/
├── README.md
├── PROJECT_CONTEXT.md
├── index.html                 # somente se for parte real do projeto raiz
├── apps/
│   ├── site-vendedor-1/
│   │   ├── index.html
│   │   └── ...
│   ├── site-vendedor-2/
│   │   ├── index.html
│   │   └── ...
│   └── ...                   # incluir todos os sites realmente existentes
├── scripts/
│   └── ...
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── DATABASE_RULES.md
├── docs/
│   ├── INVENTORY.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── BUSINESS_RULES.md
│   ├── FEATURES.md
│   ├── SECURITY.md
│   ├── DEPLOYMENT.md
│   ├── TESTING.md
│   ├── CHANGELOG.md
│   ├── KNOWN_ISSUES.md
│   └── TRAINING_GUIDE.md
└── ...
```

A estrutura acima é ilustrativa. Não criar diretórios artificiais nem
mover arquivos ativos sem avaliar impactos e explicar o plano. Se
arquivos de sites já estiverem em repositórios distintos, documentar a
relação e preservar sua origem; não copiar automaticamente para um
repositório central se isso criar divergência ou risco.

## 4. Arquivo de treinamento para Claude

Criar e manter `docs/TRAINING_GUIDE.md` (ou um arquivo equivalente já
existente) com instruções claras para uma nova sessão Claude:

1.  Ler o README e o contexto mestre.
2.  Ler inventário, arquitetura, regras de negócio e documentação do
    banco.
3.  Conferir changelog, pendências e riscos.
4.  Inspecionar o código real e os arquivos relevantes para a tarefa
    atual.
5.  Confirmar quais sites, páginas e vendedores podem ser afetados.
6.  Fazer a alteração mínima segura e necessária.
7.  Atualizar documentação e histórico.
8.  Executar as validações possíveis.
9.  Informar claramente o que foi feito, o que foi testado e o que ainda
    falta.

O guia deve ensinar o Claude a não confiar cegamente em resumos: código
e estado atual do repositório devem ser verificados.

## 5. Procedimento obrigatório para cada atualização

Antes de editar:

-   Verificar a versão atual no GitHub e alterações recentes.
-   Ler os arquivos de contexto e as regras aplicáveis.
-   Identificar arquivos impactados e dependências.
-   Verificar se a tarefa pode afetar outros vendedores ou sites.
-   Evitar trabalho simultâneo entre contas; ainda assim, confirmar que
    não houve atualização nova desde a sessão anterior.

Durante a edição:

-   Modificar os arquivos reais apropriados, não apenas descrever
    sugestões.
-   Atualizar `index.html`, scripts, estilos, componentes, migrations e
    documentos quando a tarefa exigir.
-   Preservar funcionalidades existentes, dados, identidade de cada
    vendedor e compatibilidade.
-   Não sobrescrever ou remover partes sem necessidade.
-   Não fazer mudanças destrutivas no banco ou produção sem autorização
    explícita.
-   Não afirmar que um arquivo foi publicado ou que o banco foi alterado
    sem confirmação.

Ao concluir:

-   Validar sintaxe e testes disponíveis.
-   Revisar efeitos sobre sites e vendedores.
-   Atualizar `PROJECT_CONTEXT.md`, inventário e documentos afetados.
-   Registrar no changelog data, objetivo, arquivos modificados,
    validações, resultados e pendências.
-   Salvar no GitHub por commit, se a integração permitir.
-   Informar se alterações foram realmente enviadas, publicadas ou
    executadas; distinguir essas etapas.

## 6. Continuidade entre contas Claude

As contas Claude podem acessar sequencialmente o mesmo repositório
GitHub e, conforme suas permissões, o mesmo Supabase. Isso compartilha
arquivos e estado documentado, mas **não transfere automaticamente a
memória privada das conversas entre contas**.

Ao mudar de conta, Claude deve reconstruir o contexto lendo o
repositório e comparando os documentos com o código real. Não deve
repetir tarefas concluídas nem assumir que todas as alterações
anteriores foram aplicadas.

## 7. Proteção de todos os vendedores

O projeto pode atender vários vendedores e sites independentes. Antes de
qualquer alteração, Claude deve:

-   Identificar o escopo exato da mudança.
-   Preservar isolamento de dados, links, configurações e conteúdo de
    cada vendedor.
-   Evitar alterações globais quando a solicitação for individual.
-   Verificar dependências de componentes compartilhados.
-   Não remover ou desativar sites ativos.
-   Testar, quando possível, cenários de mais de um vendedor.
-   Explicar limitações de testes e riscos residuais.

## 8. Modelo do changelog

Cada registro deve seguir formato consistente, por exemplo:

``` markdown
## YYYY-MM-DD — Título da atualização

- **Objetivo:**
- **Arquivos alterados:**
- **Sites/módulos afetados:**
- **Banco de dados:** não alterado / script preparado / aplicado em teste / aplicação em produção confirmada
- **Alterações realizadas:**
- **Validações executadas:**
- **Resultado:**
- **Pendências e riscos:**
- **GitHub:** commit ou estado de envio, se confirmado
- **Deploy:** não realizado / realizado e confirmado / não verificado
```

Não preencher campos com suposições. Usar "não verificado" quando não
houver confirmação.

## 9. Critério de documentação completa

O levantamento só deve ser chamado de completo quando:

-   Todos os repositórios e sites acessíveis foram inventariados.
-   Todos os arquivos `index.html` e componentes relevantes foram
    identificados.
-   Funcionalidades e regras de negócio encontradas foram descritas.
-   Estrutura do banco e scripts acessíveis foram documentados.
-   Segurança, integrações, deploy, testes, riscos e pendências foram
    considerados.
-   Itens inacessíveis ou desconhecidos estão explicitamente listados.
-   Documentação foi comparada com os arquivos reais para evitar
    conteúdo desatualizado.

Não declarar "tudo documentado" se houver fontes inacessíveis ou partes
não verificadas.

## 10. Instrução final

**Mantenha este repositório como o arquivo mestre vivo do Projeto
Honda.** Reúna e documente tudo que for realmente acessível e
relacionado ao sistema: sites, todos os `index.html`, códigos, scripts,
regras do Supabase, funcionalidades, regras de negócio, integrações,
segurança, deploy, histórico e pendências. Em cada sessão, consulte os
arquivos atuais, atualize os componentes pertinentes, registre as
alterações e preserve a estabilidade de todos os vendedores.

O objetivo é que outra conta Claude consiga estudar este repositório e
continuar o projeto com o mínimo de perda de contexto, sem depender do
histórico privado da conta anterior.
