# User Stories — Sistema Kanban Local

**Agente:** Product Owner
**Data:** 2026-10-15
**Formato:** Como [tipo de usuário], Eu quero [funcionalidade], Para que [benefício/valor]

---

## Épico 1 — Gestão de Projetos

### US-01: Criar projeto
- **Como** usuário do sistema,
- **Eu quero** criar um projeto informando um nome e uma descrição opcional,
- **Para que** eu consiga separar o trabalho por frentes distintas.
- **Prioridade:** Must (P1)

### US-02: Editar projeto
- **Como** usuário do sistema,
- **Eu quero** editar o nome e a descrição de um projeto existente,
- **Para que** eu mantenha o cadastro atualizado sem perder as etapas, tarefas e etiquetas ligadas.
- **Prioridade:** Must (P1)

### US-03: Excluir projeto
- **Como** usuário do sistema,
- **Eu quero** excluir um projeto (com confirmação),
- **Para que** eu remova frentes que não são mais relevantes e evite acúmulo de dados obsoletos.
- **Prioridade:** Must (P2)

### US-04: Listar projetos
- **Como** usuário do sistema,
- **Eu quero** ver a lista dos meus projetos na tela inicial,
- **Para que** eu escolha rapidamente por onde continuar.
- **Prioridade:** Must (P1)

## Épico 2 — Gestão de Etapas

### US-05: Criar etapa em um projeto
- **Como** usuário organizando um projeto,
- **Eu quero** criar etapas vinculadas a um projeto (ex.: A Fazer, Em Andamento, Concluído),
- **Para que** eu defina o fluxo de trabalho específico daquele projeto.
- **Prioridade:** Must (P1)

### US-06: Editar e excluir etapa
- **Como** usuário organizando um projeto,
- **Eu quero** renomear ou excluir etapas do projeto,
- **Para que** eu evolua o fluxo conforme a necessidade do trabalho.
- **Prioridade:** Must (P2)

## Épico 3 — Gestão de Tarefas

### US-07: Criar tarefa em uma etapa
- **Como** executor de tarefas,
- **Eu quero** criar uma tarefa dentro de uma etapa do projeto,
- **Para que** o trabalho planejado fique visível no quadro.
- **Prioridade:** Must (P1)

### US-08: Editar tarefa
- **Como** executor de tarefas,
- **Eu quero** editar o conteúdo/detalhes de uma tarefa existente,
- **Para que** eu corrija e complemente informações sem recriar a tarefa.
- **Prioridade:** Must (P1)

### US-09: Excluir tarefa
- **Como** executor de tarefas,
- **Eu quero** excluir uma tarefa (com confirmação),
- **Para que** eu remova itens descartados e suas subtarefas associadas.
- **Prioridade:** Must (P2)

### US-10: Mover tarefa entre etapas (Kanban)
- **Como** executor de tarefas,
- **Eu quero** mover uma tarefa de uma etapa para outra na visão kanban,
- **Para que** o progresso do trabalho seja refletido visualmente em tempo real.
- **Prioridade:** Must (P1)

### US-11: Visualizar tarefas em modo lista
- **Como** usuário do sistema,
- **Eu quero** alternar para uma visão em lista das tarefas do projeto,
- **Para que** eu leia e compare muitas tarefas de forma densa e rápida.
- **Prioridade:** Must (P1)

## Épico 4 — Gestão de Subtarefas

### US-12: Criar subtarefa em uma tarefa
- **Como** executor de tarefas,
- **Eu quero** criar subtarefas dentro de uma tarefa,
- **Para que** eu quebre trabalhos complexos em passos executáveis.
- **Prioridade:** Must (P1)

### US-13: Marcar subtarefa como feita
- **Como** executor de tarefas,
- **Eu quero** marcar/desmarcar uma subtarefa como concluída,
- **Para que** eu acompanhe o progresso dentro de cada tarefa.
- **Prioridade:** Must (P1)

### US-14: Editar e excluir subtarefa
- **Como** executor de tarefas,
- **Eu quero** editar ou excluir uma subtarefa,
- **Para que** eu ajuste o plano de execução conforme a realidade.
- **Prioridade:** Must (P2)

## Épico 5 — Etiquetas

### US-15: Criar e gerenciar etiquetas do projeto
- **Como** usuário organizando um projeto,
- **Eu quero** criar, renomear e excluir etiquetas vinculadas ao projeto,
- **Para que** eu tenha um sistema de categorias próprio daquele projeto.
- **Prioridade:** Should (P2)

### US-16: Vincular várias etiquetas a várias tarefas
- **Como** usuário organizando um projeto,
- **Eu quero** associar múltiplas etiquetas a múltiplas tarefas do mesmo projeto,
- **Para que** eu classifique o trabalho por contexto, urgência ou tema.
- **Prioridade:** Should (P2)

## Épico 6 — Visões Globais

### US-17: Visualizar todas as tarefas de todos os projetos
- **Como** usuário com múltiplos projetos,
- **Eu quero** ver uma página consolidada com todas as tarefas de todos os projetos,
- **Para que** eu tenha uma visão única do meu trabalho total.
- **Prioridade:** Must (P1)

### US-18: Filtrar tarefas por nome
- **Como** usuário na visão global de tarefas,
- **Eu quero** filtrar as tarefas digitando parte do nome,
- **Para que** eu encontre rapidamente o que procuro sem navegar projeto a projeto.
- **Prioridade:** Must (P1)

### US-19: Navegar da tarefa global para o projeto
- **Como** usuário na visão global de tarefas,
- **Eu quero** clicar em uma tarefa e ser levado à visualização dela na página do respectivo projeto,
- **Para que** eu acesse o contexto completo (etapa, subtarefas, etiquetas) em um clique.
- **Prioridade:** Must (P1)

### US-20: Visualizar todas as subtarefas de todos os projetos
- **Como** usuário com múltiplos projetos,
- **Eu quero** ver uma página com todas as subtarefas de todas as tarefas de todos os projetos,
- **Para que** eu acompanhe execuções pendentes em lote.
- **Prioridade:** Should (P2)

### US-21: Navegar da subtarefa global para a tarefa
- **Como** usuário na visão global de subtarefas,
- **Eu quero** clicar em uma subtarefa e ser levado à visualização da tarefa na página do respectivo projeto,
- **Para que** eu veja a subtarefa dentro do seu contexto original.
- **Prioridade:** Should (P2)

## Épico 7 — Experiência e Qualidade

### US-22: Disfrutar de layout profissional e consistente
- **Como** usuário do sistema,
- **Eu quero** que todas as telas tenham layout bonito, elegante e profissional,
- **Para que** o uso diário seja agradável e a ferramenta inspire confiança.
- **Prioridade:** Must (P1)

### US-23: Manter dados após recarregar o navegador
- **Como** usuário do sistema,
- **Eu quero** que meus dados persistam ao fechar e reabrir o navegador,
- **Para que** eu não perca trabalho por falta de backend.
- **Prioridade:** Must (P1)

---

**Ver:** `acceptance-criteria.md` (critérios de aceitação) e `backlog.md` (priorização).
