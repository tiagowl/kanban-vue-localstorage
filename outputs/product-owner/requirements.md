# Documentação de Requisitos — Sistema Kanban Local

**Agente:** Product Owner
**Data:** 2026-10-15
**Documento:** requirements.md (Documentação de Requisitos + Análise)

---

## 1. Visão Geral do Produto

Sistema web de gerenciamento de tarefas com visão **Kanban** e **Lista**, voltado para uso pessoal/equipes pequenas, 100% client-side com persistência em `localStorage`.

**Stack obrigatória:** Vue 3, Pinia, Tailwind CSS.

## 2. Objetivos de Negócio

| # | Objetivo | Indicador de sucesso |
|---|----------|----------------------|
| OB-1 | Organizar o trabalho em etapas visíveis | Usuário consegue mover tarefas entre etapas sem perda de dados |
| OB-2 | Reduzir esforço de cadastro hierárquico | CRUD completo de projeto → etapa → tarefa → subtarefa em ≤ 3 cliques |
| OB-3 | Ter visão consolidada multi-projeto | Página única com todas as tarefas e todas as subtarefas de todos os projetos |
| OB-4 | Facilitar classificação e busca | Etiquetas por projeto e filtro por nome nas visões globais |
| OB-5 | Garantir persistência simples e offline | Dados sobrevivem ao fechamento/reabertura do navegador sem backend |
| OB-6 | Entregar experiência visual profissional | Layouts elegantes, com boas práticas de UX/UI |

## 3. Usuários-alvo e Personas

### Persona 1 — "Ana", Gerente de Projetos Pessoais
- **Perfil:** 34 anos, trabalha com múltiplos projetos simultâneos (trabalho + pessoal).
- **Dor:** Perde visão do que está em andamento entre várias frentes.
- **Necessidade:** Visão kanban por projeto e visão consolidada de todas as tarefas.
- **Uso:** Diário, no desktop.

### Persona 2 — "Bruno", Executor de Tarefas
- **Perfil:** 27 anos, executa tarefas detalhadas com subtarefas.
- **Dor:** Não lembra o contexto da tarefa ao ver uma subtarefa isolada.
- **Necessidade:** Marcar subtarefas como feitas e navegar da subtarefa até a tarefa de origem.
- **Uso:** Várias vezes ao dia, desktop e telas menores.

### Persona 3 — "Carla", Organizadora por Contexto
- **Perfil:** 31 anos, segmenta trabalho por categorias (urgente, cliente X, estudo).
- **Dor:** Filtrar visualmente ruído; achar rapidamente tarefas por nome.
- **Necessidade:** Etiquetas multi-vínculo e busca por nome nas visões globais.
- **Uso:** Diário, desktop.

## 4. Funcionalidades Principais

| ID | Funcionalidade | Descrição |
|----|----------------|-----------|
| F-01 | CRUD de Projetos | Nome (obrigatório) e descrição (opcional) |
| F-02 | CRUD de Etapas | Ligadas a um projeto (ex.: A Fazer, Fazendo, Concluído) |
| F-03 | CRUD de Tarefas | Ligadas a uma etapa de um projeto |
| F-04 | CRUD de Subtarefas | Ligadas a uma tarefa; marcação de concluída |
| F-05 | CRUD de Etiquetas | Ligadas a um projeto; N etiquetas ↔ N tarefas (mesmo projeto) |
| F-06 | Visão Kanban | Colunas = etapas; visualização e movimentação de tarefas |
| F-07 | Visão Lista | Mesmas tarefas em formato de lista |
| F-08 | Página "Todas as Tarefas" | Consolidado de todos os projetos + filtro por nome |
| F-09 | Página "Todas as Subtarefas" | Consolidado global; clique navega para a tarefa no projeto de origem |
| F-10 | Navegação tarefa global → projeto | Clique em tarefa na visão global abre a tarefa na página do projeto |
| F-11 | Design System / UI | Layouts bonitos, elegantes, profissionais; boas práticas de UX/UI |

## 5. Restrições e Limitações

### Técnicas
- **Sem backend:** persistência exclusiva em `localStorage` (limite típico de ~5 MB por origem).
- **Single-user / single-device:** sem autenticação, sem sincronização entre dispositivos/navegadores.
- **Escopo de dados:** etiquetas são escopadas ao projeto; vínculo etiqueta↔tarefa só entre tarefas do mesmo projeto.
- **Stack fixa:** Vue 3 + Pinia + Tailwind; sem mudanças de stack.
- **Integridade:** remoção de projeto/etapa/tarefa exige definição de regra para registros filhos (cascata ou bloqueio).

### Regras de Negócio
- RN-01: Nome de projeto é obrigatório; descrição opcional.
- RN-02: Tarefa pertence a exatamente uma etapa; etapa pertence a exatamente um projeto.
- RN-03: Subtarefa pertence a exatamente uma tarefa e pode ser marcada como feita (booleano).
- RN-04: Uma tarefa pode ter zero ou mais etiquetas do mesmo projeto; remoção da etiqueta desvincula das tarefas.
- RN-05: Filtro por nome nas visões globais é case-insensitive e corresponde parcialmente (contém).

### UX/UI
- Layouts devem ser bonitos, elegantes e profissionais.
- Consistência visual entre kanban, lista e visões globais.
- Feedback imediato de criação/edição/exclusão e estados vazios claros.

## 6. Jornada do Usuário

### Jornada Principal — Execução de trabalho
1. **Entrada:** usuário abre a aplicação → vê lista de projetos (ou estado vazio com CTA "Criar primeiro projeto").
2. **Cria contexto:** cria projeto → adiciona etapas ao projeto.
3. **Planeja:** cria tarefa em uma etapa → detalha com subtarefas e etiquetas.
4. **Executa:** alterna entre **visão Kanban** (movimentar entre etapas) e **visão Lista** (leitura densa).
5. **Progresso:** marca subtarefas como feitas; conclui tarefa ao chegar na etapa final.
6. **Encerramento:** tarefa concluída permanece para consulta; projeto pode ser arquivado/excluído.

### Jornada de Visão Global
1. Usuário acessa **"Todas as Tarefas"** → vê consolidado multi-projeto → filtra por nome.
2. Clica em uma tarefa → **navega para a tarefa na página do respectivo projeto**.
3. Usuário acessa **"Todas as Subtarefas"** → vê subtarefas de todos os projetos.
4. Clica em uma subtarefa → **navega para a tarefa de origem** na página do respectivo projeto → foco na subtarefa.

### Jornada de Organização
1. Usuário cria etiquetas no projeto (ex.: "urgente", "cliente A").
2. Vincula várias etiquetas a várias tarefas do projeto.
3. Usa etiquetas e filtro de nome para reduzir ruído e localizar trabalho rapidamente.

## 7. Fora de Escopo (MVP)

- Autenticação, multiusuário e sincronização em nuvem.
- Compartilhamento, comentários, anexos e @menções.
- Notificações, lembretes e integrações externas (calendário, e-mail).
- Arrastar-e-soltar avançado com animações complexas (se não viabilizar o MVP).
- Relatórios/burn-down e métricas de produtividade.
- Aplicativo mobile nativo (web responsivo cobre o caso).

## 8. Critérios Gerais de Sucesso

- Nenhum dado é perdido ao recarregar a página (persistência confiável).
- Todo CRUD opera sem recarregar a página, com feedback claro.
- Navegação global → tarefa/ subtarefa → projeto funciona em 1 clique.
- Interfaces consistentes, acessíveis em desktop e telas menores.

---

**Próximos documentos:** `user-stories.md`, `acceptance-criteria.md`, `backlog.md`
