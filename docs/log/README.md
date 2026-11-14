# Log automático

Um arquivo por site (`comercial.md`, `vitrine.md`, `site-cnh.md`, `site-cdc.md`, `termo-star.md`), criado e atualizado pela GitHub Action `registrar-no-hub.yml` de cada repositório a cada push na `main`. Cada linha: data (UTC), commit, mensagem do commit e arquivos alterados. Mais recente no topo. Não editar à mão.

O log mostra **o que** mudou. O **porquê**, o que ficou pendente e o que mudou no banco continuam sendo registrados em `../CHANGELOG.md` no fim de cada sessão.
