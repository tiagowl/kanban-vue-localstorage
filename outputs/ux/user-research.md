# Pesquisa de Usuário — Sistema Kanban Local

**Agente:** UX Designer
**Data:** 2026-10-15
**Entrada:** `outputs/product-owner/` (requirements.md, user-stories.md, acceptance-criteria.md, backlog.md)
**Objetivo:** fundamentar personas, jornadas, dores e hipóteses de UX que orientam wireframes, protótipos e testes de usabilidade.

---

## 1. Metodologia

| Etapa | Método | Fonte |
|-------|--------|-------|
| Análise secundária | Requisitos, personas e RN do PO | `requirements.md` |
| Mapeamento de valor | User stories × objetivos de negócio | `user-stories.md`, `backlog.md` |
| Derivação de UX | Dores → necessidades → exigências de interface | `requirements.md` §3 e §6 |
| Validação de hipóteses | Plano de teste (heurístico + com usuários) | `usability-reports.md` |

**Restrições de pesquisa:** produto single-user, offline, sem telemetria. A validação combinará **avaliação heurística** (imediata) e **testes moderados** com 5 participantes (fase de desenvolvimento).

---

## 2. Personas

### Persona 1 — "Ana" · Gerente de Projetos Pessoais

| Atributo | Detalhe |
|----------|---------|
| Perfil | 34 anos, coordena múltiplas frentes (trabalho + pessoal) |
| Contexto de uso | Desktop, uso diário, sessões de 10–30 min |
| Objetivos | Ver tudo o que está em andamento; decidir prioridades rapidamente |
| Comportamento | Começa pela visão geral, depois aprofunda em um projeto |
| Frustações | Não sabe o que está parado; precisa abrir projeto por projeto |
| Acessibilidade | Bom senso de hierarquia; impaciência com cliques desnecessários |

- **Dor central:** perde visão do que está em andamento entre várias frentes.
- **Necessidade:** visão kanban por projeto **e** visão consolidada multi-projeto.
- **Stories atendidas:** US-04, US-10, US-11, US-17, US-18, US-19.
- **Indicador de sucesso para Ana:** todas as tarefas de todos os projetos em **1 tela, 1 clique**.

### Persona 2 — "Bruno" · Executor de Tarefas

| Atributo | Detalhe |
|----------|---------|
| Perfil | 27 anos, executa tarefas detalhadas com subtarefas |
| Contexto de uso | Várias vezes ao dia, desktop e telas menores |
| Objetivos | Executar passo a passo sem perder o contexto da tarefa |
| Comportamento | Trabalha em rajadas curtas; alterna entre kanban e lista |
| Frustações | Não lembra o contexto da tarefa ao ver uma subtarefa isolada |
| Acessibilidade | Usa muito teclado; espera feedback imediato |

- **Dor central:** subtarefa isolada perde o contexto da tarefa de origem.
- **Necessidade:** marcar subtarefas como feitas e navegar da subtarefa até a tarefa/projeto de origem.
- **Stories atendidas:** US-07, US-10, US-12, US-13, US-14, US-20, US-21.
- **Indicador de sucesso para Bruno:** executar um ciclo completo (mover tarefa → concluir subtarefas) sem erros e com persistência garantida.

### Persona 3 — "Carla" · Organizadora por Contexto

| Atributo | Detalhe |
|----------|---------|
| Perfil | 31 anos, segmenta trabalho por categorias (urgente, cliente X, estudo) |
| Contexto de uso | Desktop, uso diário |
| Objetivos | Filtrar ruído; achar tarefas por nome em segundos |
| Comportamento | Cria etiquetas como vocabulário próprio e filtra/busca sempre |
| Frustações | Ruído visual; buscas que alteram os dados originais |
| Acessibilidade | Sensível a contraste e consistência entre telas |

- **Dor central:** filtrar visualmente ruído e achar rapidamente tarefas por nome.
- **Necessidade:** etiquetas multi-vínculo (escopo do projeto) e busca por nome nas visões globais.
- **Stories atendidas:** US-15, US-16, US-18, US-11.
- **Indicador de sucesso para Carla:** encontrar uma tarefa em ≤ 5 segundos a partir da página global.

---

## 3. Matriz Dor → Necessidade → Solução → UX Exigida

| # | Dor | Necessidade | Solução (PO) | Exigência de UX |
|---|-----|-------------|--------------|-----------------|
| D-01 | Perder visão entre frentes | Visão consolidada | Página "Todas as Tarefas" (US-17) | Origem (projeto/etapa) sempre visível no card |
| D-02 | Subtarefa sem contexto | Voltar à origem | Navegação subtarefa → tarefa (US-21) | 1 clique + destaque (âncora) da subtarefa de origem |
| D-03 | Ruído e busca lenta | Filtrar por nome | Filtro global (US-18) | Reativo com debounce; nunca altera dados; limpar fácil |
| D-04 | Cadastro hierárquico demorado | CRUD rápido | Projetos → etapas → tarefas → subtarefas | Criação em ≤ 3 cliques; "+" contextual na tela atual |
| D-05 | Medo de perder dados | Persistência confiável | `localStorage` (US-23) | Feedback de salvamento, erro claro em quota/indisponibilidade |
| D-06 | Medo de exclusão acidental | Exclusão segura | Confirmações (US-03/09/14) | Modal de confirmação com consequences explícitas |
| D-07 | Interface genérica confusa | Profissionalismo | Design system (US-22) | Consistência, estados vazios claros, foco visível |
| D-08 | Progresso invisível | Acompanhar execução | Subtarefas (US-13) | Indicador x/y + barra de progresso no card |
| D-09 | Fluxo rígido | Fluxo adaptável | Etapas CRUD (US-05/06) | Bloqueio inteligente: excluir etapa com tarefas exige ação |

---

## 4. Jornadas do Usuário

### 4.1 Jornada principal — Execução de trabalho (Ana/Bruno)

| Etapa | Ação do usuário | Tela | Feedback esperado | Stories |
|------:|-----------------|------|-------------------|---------|
| 1 | Abre a aplicação | Home (projetos) | Lista persistida ou estado vazio + CTA | US-04 |
| 2 | Cria projeto "Site X" | Modal projeto | Toast de sucesso, card aparece | US-01 |
| 3 | Adiciona etapas (A Fazer, Em Andamento, Concluído) | Projeto/kanban | Colunas surgem imediatamente | US-05 |
| 4 | Cria tarefa "Escrever homepage" | Kanban (coluna) | Card entra na coluna | US-07 |
| 5 | Detalha com subtarefas e etiquetas | Drawer da tarefa | Progresso x/y atualiza | US-12/13/15 |
| 6 | Move a tarefa arrastando | Kanban | Drag com drop visual; posição salva | US-10 |
| 7 | Alterna para visão Lista | Projeto/lista | Mesmos dados, contexto preservado | US-11 |
| 8 | Conclui subtarefas | Drawer | Check + risco + barra 100% | US-13 |
| 9 | Recarrega a página | — | Estado idêntico (persistência) | US-23 |

**Momento crítico:** etapa 6 (arrastar) — exige drop-target claro e reversão visual se rejeitado.
**Meta:** etapas 2→4 em ≤ 3 cliques cada (OB-2).

### 4.2 Jornada de visão global (Ana)

| Etapa | Ação | Tela | Feedback esperado | Stories |
|------:|------|------|-------------------|---------|
| 1 | Acessa "Todas as Tarefas" | Global de tarefas | Consolidado com projeto/etapa de origem | US-17 |
| 2 | Digita "home" no filtro | Global | Lista reduz em tempo real (debounce) | US-18 |
| 3 | Clica na tarefa "Escrever homepage" | → Projeto | Rota `/projetos/:id?tarefa=:id` com tarefa em foco | US-19 |
| 4 | Acessa "Todas as Subtarefas" | Global subtarefas | Lista com tarefa de origem + status | US-20 |
| 5 | Clica na subtarefa "Definir copy" | → Projeto | Drawer da tarefa aberto + subtarefa destacada | US-21 |

**Momento crítico:** etapas 3 e 5 — perder o contexto destrói a confiança na visão global.

### 4.3 Jornada de organização (Carla)

| Etapa | Ação | Tela | Feedback esperado | Stories |
|------:|------|------|-------------------|---------|
| 1 | Cria etiquetas "urgente", "cliente A" (com cor) | Gestor de etiquetas | Chips coloridos disponíveis | US-15 |
| 2 | Vincula etiquetas a várias tarefas | Drawer/seletor | Apenas etiquetas do **mesmo projeto** listadas | US-16 |
| 3 | Visualiza chips nos cards | Kanban/lista/global | Leitura por cor + nome | US-16 |
| 4 | Combinar etiqueta + filtro de nome | Global | Ruído zerado, resultado preciso | US-18 |

---

## 5. Validação de Hipóteses

| ID | Hipótese | Método de validação | Métrica | Status |
|----|----------|---------------------|---------|--------|
| H-01 | O usuário encontra qualquer tarefa global em ≤ 5 s | Teste moderado (cenário C-03) | Tempo por tarefa | Pendente (ver `usability-reports.md`) |
| H-02 | Criação de tarefa completa em ≤ 3 cliques | Observação (cenário C-01) | Nº de cliques | Validada por heurística |
| H-03 | Navegação global → projeto em 1 clique é suficiente | Teste (C-03/C-04) | Clique de sucesso / erros | Validada por heurística |
| H-04 | Estados vazios com CTA reduzem abandono na 1ª execução | Teste com conta nova (C-00) | Conclusão sem ajuda | Pendente |
| H-05 | Confirmação de exclusão evita perda acidental | Teste (C-05) | Exclusões acidentais | Validada por heurística |
| H-06 | Indicador de progresso x/y motiva a conclusão de subtarefas | Observação (C-02) | Subtarefas concluídas | Pendente |
| H-07 | Layout consistente entre kanban/lista/global gera sensação de profissionalismo | SUS + entrevista | SUS ≥ 80 | Pendente |

---

## 6. Requisitos de Experiência (derivados das dores)

1. **Rápido:** nenhuma criação/editação excede 3 cliques; filtros reativos sem recarregar.
2. **Seguro:** toda destruição passa por confirmação com consequência explícita; persistência visível.
3. **Orientado:** todo item mostrará sua origem (projeto → etapa) nas visões globais.
4. **Consistente:** mesmos padrões de card, botão, chip e estado vazio em todas as telas.
5. **Acessível:** contraste AA, foco visível, alvo de clique ≥ 40px, operável por teclado.
6. **Responsivo:** utilizável de 360px a desktop largo; kanban com scroll horizontal em telas pequenas.
7. **Tolerante a falhas:** `localStorage` indisponível/cheio/corrompido → aviso + modo degradado, nunca crash.

---

## 7. Prioridades de UX para o MVP

| Prioridade | Foco | Stories |
|------------|------|---------|
| P1 | Fluxo de criação (projeto → etapa → tarefa) e movimentação kanban | US-01/04/05/07/10 |
| P1 | Drawer de tarefa com subtarefas e progresso | US-12/13 |
| P1 | Visões globais com filtro e navegação de 1 clique | US-17/18/19 |
| P1 | Estados vazios, confirmações e feedback (toast) | US-03/09/22/23 |
| P2 | Etiquetas com chips coloridos e seletor escopado | US-15/16 |
| P2 | Global de subtarefas com destaque de âncora | US-20/21 |
| P3 | Ordenação manual, tema escuro, filtro na global de subtarefas | Could / Won't (MVP) |

---

**Próximos outputs:** `wireframes/` → `prototypes/` → `usability-reports.md` → `design-system.md`
