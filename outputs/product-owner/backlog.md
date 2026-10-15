# Backlog Priorizado — Sistema Kanban Local

**Agente:** Product Owner
**Data:** 2026-10-15
**Critérios:** Valor de negócio · Esforço de desenvolvimento · Dependências · Riscos
**Método:** Priorização por valor/esforço (RICE simplificado) + MoSCoW + ordem de entrega

---

## 1. Tabela de Priorização

**Escala:** Valor (1–5) · Esforço (S=1, M=2, L=3) · Impacto = Valor ÷ Esforço · Risco (Baixo/Médio/Alto)

| Ordem | Story | Funcionalidade | Valor | Esforço | Impacto | Dependências | Risco | MoSCoW |
|------:|-------|----------------|:-----:|:-------:|:-------:|--------------|-------|--------|
| 1 | US-01/US-04 | CRUD + listagem de projetos | 5 | S | **5,0** | Nenhuma (base) | Baixo | Must |
| 2 | US-05/US-06 | CRUD de etapas | 5 | S | **5,0** | Projetos | Baixo | Must |
| 3 | US-07/US-08 | Criar/editar tarefa | 5 | S | **5,0** | Etapas | Baixo | Must |
| 4 | US-23 | Persistência em `localStorage` | 5 | M | **2,5** | Modelo de dados | **Alto** | Must |
| 5 | US-10 | Mover tarefa no kanban | 5 | M | **2,5** | Tarefas | Médio | Must |
| 6 | US-11 | Visão lista | 4 | S | **4,0** | Tarefas | Baixo | Must |
| 7 | US-12/US-13 | Criar subtarefa + marcar feita | 5 | M | **2,5** | Tarefas | Baixo | Must |
| 8 | US-19 | Navegação tarefa global → projeto | 4 | M | **2,0** | Visão global + rotas | Médio | Must |
| 9 | US-17 | Página todas as tarefas | 4 | M | **2,0** | Tarefas + rotas | Baixo | Must |
| 10 | US-18 | Filtro por nome (global) | 4 | S | **4,0** | Visão global | Baixo | Must |
| 11 | US-03/US-09/US-14 | Exclusões com confirmação | 3 | S | **3,0** | CRUDs | Médio | Must |
| 12 | US-22 | Design system / UI profissional | 5 | L | **1,7** | Todas as telas | Médio | Must |
| 13 | US-02 | Editar projeto | 3 | S | **3,0** | US-01 | Baixo | Must |
| 14 | US-15/US-16 | Etiquetas + vínculo N↔N | 4 | M | **2,0** | Tarefas + projeto | Médio | Should |
| 15 | US-20/US-21 | Página todas as subtarefas + navegação | 4 | M | **2,0** | Subtarefas + rotas | Médio | Should |
| 16 | US-21* | Foco na subtarefa de origem (âncora) | 3 | S | **3,0** | US-20 | Baixo | Could |
| 17 | — | Busca/filtro também na página de subtarefas | 3 | S | **3,0** | US-20 | Baixo | Could |
| 18 | — | Ordenação/manual ordering de tarefas | 3 | M | **1,5** | Kanban | Médio | Could |
| 19 | — | Temas (claro/escuro) | 2 | M | **1,0** | Design system | Baixo | Won't (MVP) |
| 20 | — | Export/import de dados (JSON) | 3 | M | **1,5** | Persistência | Baixo | Won't (MVP) |

\* detalhamento da US-21.

## 2. MoSCoW (Resumo)

- **Must (MVP):** Projetos, etapas, tarefas, subtarefas, kanban, lista, visão global de tarefas com filtro e navegação, persistência, exclusões seguras e UI profissional.
- **Should:** Etiquetas com vínculo N↔N, visão global de subtarefas com navegação.
- **Could:** Ordenação manual, filtro na página de subtarefas, extras de âncora/polimento.
- **Won't (nesta versão):** Temas, export/import, multiusuário, notificações, integrações.

## 3. Mapa de Dependências

```
Projetos (US-01/04)
 └─ Etapas (US-05/06)
     └─ Tarefas (US-07/08)
         ├─ Kanban mover (US-10) ─── Visão Lista (US-11)
         ├─ Subtarefas (US-12/13/14)
         │    └─ Global subtarefas (US-20) ─► Navegação subtarefa (US-21)
         ├─ Etiquetas (US-15/16)
         └─ Global tarefas (US-17) ─► Filtro (US-18) ─► Navegação tarefa (US-19)

Persistência (US-23) transversal — iniciar desde o primeiro incremento
Design system (US-22) transversal — scaffolding inicial + polimento contínuo
```

**Regra:** nenhuma story filha entra em desenvolvimento antes do pai estar entregue; `US-23` e `US-22` acompanham todos os incrementsos.

## 4. Riscos e Mitigações

| Risco | Impacto | Prob. | Mitigação |
|-------|---------|-------|-----------|
| Limite/corrupção do `localStorage` | Alto | Média | Camada única de persistência, chave versionada, tratamento de quota exceeded, estado vazio seguro |
| Regra de exclusão em cascata indefinida (etapa/tarefa com filhos) | Alto | Média | Definir com stakeholder: **bloquear exclusão de etapa com tarefas**; excluir tarefa apaga subtarefas (com confirmação) |
| Escopo de etiquetas (apenas mesmo projeto) mal interpretado | Médio | Alta | Validação explícita na UI (seletor só lista etiquetas do projeto) |
| Navegação global → tarefa perder contexto | Médio | Média | Rotas com IDs (`/projetos/:id?tarefa=:id`); testes de navegação desde a US-19 |
| Escopo de UI "bonito e profissional" vago | Médio | Alta | Definir design tokens e componentes base na Fase 0; revisão de UI com UX/PO a cada fase |
| Vínculo N↔N etiqueta↔tarefa complexar o MVP | Médio | Média | Entregar em 2 passos (criar etiqueta → vincular); adiar polimento |

## 5. Plano de Entrega (Sprints)

### Sprint 0 — Fundação (sem UI final)
Design tokens + componentes base Tailwind, estrutura Vue 3 + Pinia + rotas, camada de persistência `localStorage` (US-23).
**Saída:** app roda, estado persiste, base visual mínima.

### Sprint 1 — Núcleo de gestão
US-01, US-04, US-05, US-06, US-07, US-08.
**Saída:** projetos → etapas → tarefas criáveis e editáveis.

### Sprint 2 — Kanban operacional
US-10, US-11, US-12, US-13, US-14, US-03, US-09.
**Saída:** trabalho executável: mover, lista, subtarefas, exclusões seguras.

### Sprint 3 — Visões globais
US-17, US-18, US-19.
**Saída:** consolidado multi-projeto com filtro e navegação para o projeto.

### Sprint 4 — Organização + polimento
US-15, US-16, US-20, US-21, US-02, US-22 (fecha design system).
**Saída:** etiquetas N↔N, global de subtarefas, UI consistente.

### Itens de Could (se houver capacidade)
Ordenação manual, filtro na página de subtarefas, refinos de âncora.

## 6. Definição de Pronto (DoD)

- [ ] Funciona conforme critérios em `acceptance-criteria.md`.
- [ ] Dados persistem após reload (verificação manual + cenários extremos).
- [ ] UI consistente com o design system (desktop e telas menores).
- [ ] Estados vazios, de erro e confirmações implementados.
- [ ] Sem registros órfãos após exclusões (projeto → etapa → tarefa → subtarefa).
- [ ] Validação de aceite executada pelo PO com stakeholders.

## 7. Validação com Stakeholders (pendências)

1. Regra de exclusão de **etapa com tarefas**: bloquear (adotado como default) ou mover automaticamente?
2. Escopo de etiquetas **somente dentro do mesmo projeto** (adotado) está correto?
3. Identificação do usuário na criação de tarefa é necessária para o MVP? (assumido: **não**, single-user).
4. É preciso reordenar tarefas manualmente dentro de uma etapa no MVP? (assumido: **não**).

---

**Ver:** `requirements.md` · `user-stories.md` · `acceptance-criteria.md`
