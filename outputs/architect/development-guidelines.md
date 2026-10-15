# Guia de Desenvolvimento — Kanban Local

**Agente:** Arquiteto de Software
**Data:** 2026-10-15
**Documento:** `development-guidelines.md`
**Público:** frontend-dev, fullstack-dev, tester, devops
**Insumos:** `architecture-diagram.md` · `design-patterns.md` · `tech-stack.md` · `outputs/ux/design-system.md`

---

## 1. Estrutura de Pastas

```
kanban-vue-localstorage/
├─ public/
├─ src/
│  ├─ main.js                    # bootstrap (app, pinia, router, persistencePlugin)
│  ├─ App.vue                    # AppShell (header + nav + outlet)
│  ├─ router/
│  │  └─ index.js                # rotas (§5 architecture-diagram)
│  ├─ pages/                     # containers (ligados a store/rota)
│  │  ├─ ProjectsView.vue
│  │  ├─ ProjectView.vue
│  │  ├─ AllTasksView.vue
│  │  ├─ AllSubtasksView.vue
│  │  └─ NotFoundView.vue
│  ├─ components/                # presentational (props + emit, sem store)
│  │  ├─ layout/                 # AppShell, Topbar, BottomNav
│  │  ├─ project/                # ProjectCard, ProjectForm
│  │  ├─ kanban/                 # KanbanBoard, KanbanColumn, TaskCard
│  │  ├─ list/                   # TaskGroup, TaskListRow
│  │  ├─ global/                 # GlobalTaskRow, GlobalSubtaskRow, OriginChip
│  │  ├─ task/                   # TaskDrawer, SubtaskItem, LabelPicker
│  │  └─ base/                   # BaseButton, IconButton, BaseModal,
│  │                             #   BaseInput, Checkbox, ProgressBar,
│  │                             #   EmptyState, AppToast, SegmentedControl
│  ├─ composables/               # useToast, useConfirm, useDragDrop,
│  │                             #   useAnchor, useDebouncedRef
│  ├─ stores/                    # Pinia (DP-01)
│  │  ├─ projects.js
│  │  ├─ stages.js
│  │  ├─ tasks.js
│  │  ├─ subtasks.js
│  │  ├─ labels.js
│  │  └─ ui.js
│  ├─ domain/                    # puro, sem Vue (DP-04)
│  │  ├─ rules.js
│  │  ├─ selectors.js
│  │  ├─ filters.js
│  │  ├─ idGenerator.js
│  │  └─ constants.js            # LABEL_COLORS, SCHEMA_VERSION, STORAGE_KEY
│  ├─ persistence/               # DP-02 / DP-03
│  │  ├─ storageAdapter.js
│  │  ├─ persistencePlugin.js
│  │  └─ migrations.js
│  └─ assets/
│     └─ styles/tailwind.css     # @tailwind base/components/utilities
├─ tests/
│  ├─ unit/                      # Vitest (domain + stores)
│  └─ e2e/                       # Playwright (fluxos C-00…C-05)
├─ index.html
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.js
├─ vitest.config.js
├─ playwright.config.js
├─ .eslintrc.cjs / eslint.config.js
└─ .prettierrc
```

**Regra de ouro:** `pages/` orquestra; `components/` apresenta; `domain/` decide; `persistence/` guarda. Verificação em code review.

---

## 2. Convenções de Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes Vue | `PascalCase.vue` | `TaskCard.vue`, `KanbanColumn.vue` |
| Pages | `*View.vue` | `AllTasksView.vue` |
| Composables | `useCamelCase.js` | `useConfirm.js` |
| Stores | `camelCase.js` (nome da store igual ao arquivo) | `tasks.js` → `useTasksStore` |
| Funções/variáveis | `camelCase` | `moveTask`, `stageList` |
| Constantes | `UPPER_SNAKE_CASE` | `STORAGE_KEY`, `SCHEMA_VERSION` |
| Tipos/JSDoc | `@typedef` `PascalCase` | `@typedef {Object} Task` |
| Arquivos de domínio | `camelCase.js` | `selectors.js` |
| Eventos (emit) | `kebab-case` + verbo no passado/ação | `task-moved`, `close` |
| Props | `camelCase` (kebab no template) | `:task-count` |
| Rotas (name) | `PascalCase`/`kebab-case` consistente | `project`, `all-tasks` |
| CSS (quando `@apply`) | prefixo do componente | `.task-card__title` |

**Idioma:** código e identificadores em **inglês**; textos de UI (microcopy) em **português**. Comentários com moderação, em português, apenas quando explicarem o **porquê** (não o quê).

---

## 3. Convenções Vue 3

- Sempre **`<script setup>`** + **Composition API**.
- Ordem dos blocos SFC: `<script setup>` → `<template>` → `<style>` (se houver).
- `defineProps` com validação e `defineEmits` declarado; sem `props` implícitos.
- Presentational components **não** importam stores; usam props/emit.
- `v-for` **sempre** com `:key` estável (id), nunca índice.
- Evitar `v-html`; usar interpolação (Vue escapa HTML).
- Lógica reutilizável → composable, não mixin.
- `Teleport to="body"` para modais/drawers/toasts.
- Nomes de eventos em kebab-case; `emit('update:modelValue', ...)` para `v-model`.

```vue
<!-- components/kanban/TaskCard.vue -->
<script setup>
const props = defineProps({
  task: { type: Object, required: true },
  labels: { type: Array, default: () => [] },
  progress: { type: Object, default: () => ({ done: 0, total: 0 }) },
})
const emit = defineEmits(['open', 'move', 'toggle'])
</script>
```

---

## 4. Estado (Pinia)

- Setup stores (`defineStore('nome', () => { ... })`) com `ref`/`computed`/funções.
- **Ações nomeadas** para toda mutação (DP-12); validam via `domain/rules` antes de aplicar.
- Getters (`computed`) para dados derivados; **não** duplicar estado.
- Cross-store: importar a outra store dentro da action (evita ciclo no topo do módulo).
- `$subscribe` **apenas** no plugin de persistência central — não em componentes.
- Nunca mutar entidades fora da própria store.

---

## 5. Persistência

- Todo acesso ao storage passa por `StorageAdapter` (P-02). **Proibido** `localStorage` direto.
- Envelope versionado (`schemaVersion`) + chave `kanban:v1` (ADR-005).
- Gravação com **debounce 150ms**; `flush` no `beforeunload`.
- `try/catch` obrigatório em `get/set`; tratar `QuotaExceededError` e corrupção.
- Migrações em `persistence/migrations.js` (`migrate(from, to, data)`).
- Teste com `InMemoryStorage` (não depender do `jsdom`).

```js
// main.js
const pinia = createPinia()
pinia.use(persistencePlugin)
app.use(pinia)
```

---

## 6. Estilo e Design System

- **Fonte da verdade:** `outputs/ux/design-system.md` (§2 tokens, §3 componentes).
- Tokens em `tailwind.config.js` (`theme.extend`) conforme §6.1 do design system.
- Usar classes utilitárias; para padrões repetidos, extrair componente base (não strings gigantes).
- Proibido cor/espaçamento "mágico" fora dos tokens.
- **Sem emoji como ícone funcional** — usar glifos tipográficos ou SVG com `aria-label` (§7 design-system).
- Checklist de UI antes do PR: contraste AA · foco visível · alvo ≥ 40px · estados (hover/foco/disabled/vazio/erro) · responsivo 360/768/1024/1280.

---

## 7. Acessibilidade (WCAG 2.1 AA)

- Todo elemento interativo: acessível por teclado (`Tab`, `Enter`/`Space`), com `:focus-visible`.
- Botões-ícone: `aria-label`; ícones decorativos: `aria-hidden="true"`.
- Modais/drawers: **focus trap**, `Esc` fecha, **restaurar foco** ao elemento de origem.
- Filtros anunciam contagem com `aria-live="polite"`; toasts `role="status"`.
- Erros de campo: mensagem inline com `role="alert"` + `aria-invalid` + foco no 1º inválido.
- Drag-and-drop **não** é a única via: sempre oferecer "Mover para…" (DP-15).
- Rodar `@axe-core/playwright` nas páginas principais (fecha pendência §7 do UX).

---

## 8. Testes

| Nível | Ferramenta | Alvo |
|-------|-----------|------|
| Unitário (domínio) | Vitest | `rules`, `selectors`, `filters`, `idGenerator` |
| Unitário (stores) | Vitest + `@pinia/testing` | ações, cascata, persistência |
| Componente | Vitest + `@vue/test-utils` | presentational components (props/emit) |
| E2E | Playwright | fluxos C-00…C-05 (usability §4) |
| A11y | @axe-core/playwright | páginas principais |
| Persistência | Vitest | InMemoryStorage; quota/corrupção simulados |

**Cobertura mínima:** 80% em `src/domain` e `src/persistence`; fluxos P1 cobertos por E2E.

**Casos obrigatórios (derivados das CA):** excluir etapa com tarefas é bloqueado; excluir projeto remove filhos; remoção de etiqueta desvincula sem apagar tarefas; reload preserva estado; filtro case-insensitive parcial.

---

## 9. Git, Commits e Fluxo

- Branches: `feat/`, `fix/`, `chore/`, `refactor/`, `test/`, `docs/`.
- Commits em **Conventional Commits**: `feat(tasks): mover tarefa entre etapas`.
- PR pequeno e rastreável; descrever US/CA atendida (`US-10`, `CA-US-10`).
- Sem `--force` em branches compartilhadas; sem commitar segredos.
- Atualizar docs quando mudar contrato (design tokens, schema, rotas).

---

## 10. Lint, Formatação e CI

```jsonc
// scripts úteis
"dev":        "vite",
"build":      "vite build",
"preview":    "vite preview",
"lint":       "eslint . --ext .js,.vue",
"format":     "prettier --write .",
"test:unit":  "vitest run",
"test:e2e":   "playwright test"
```

**Pipeline sugerido (CI):** `install` → `lint` → `test:unit` → `build` → `test:e2e` → (deploy estático opcional).

---

## 11. Performance

- Seletores memoizados (`computed`); evitar recomputar em cada render.
- `v-for` com key estável; evitar gatilhos de reatividade desnecessários.
- Debounce em busca (US-18) e na gravação (persistência).
- Considerar virtualização de listas apenas se medições apontarem necessidade (Could).
- Code-splitting por rota (Vite) para carregar views sob demanda.

---

## 12. Checklist de Pull Request

- [ ] Atende à US/CA referenciada e às RNs aplicáveis.
- [ ] Sem acesso direto a `localStorage` fora do adapter.
- [ ] Regra de negócio em `domain/`, não no componente.
- [ ] Presentational components sem store.
- [ ] Estados vazio/erro/loading implementados.
- [ ] A11y: teclado, foco, `aria-*`, alvo ≥ 40px.
- [ ] UI fiel ao design system (tokens, responsivo).
- [ ] Testes unitários/E2E adicionados ou atualizados.
- [ ] `lint` e `test:unit` verdes.
- [ ] Documentação atualizada (se contrato mudou).

---

## 13. Definition of Done (arquitetural)

Alinhado ao DoD do backlog (`backlog.md` §6):
- [ ] Persistência confiável após reload (CA-US-23).
- [ ] Nenhum registro órfão após exclusões (DP-14).
- [ ] Navegação global → tarefa/subtarefa em 1 clique (US-19/US-21).
- [ ] UI consistente e acessível (US-22).
- [ ] Sem violação dos anti-patterns de `design-patterns.md` §4.

---

**Documentos relacionados:** `architecture-diagram.md` · `tech-stack.md` · `design-patterns.md` · `adr/`
