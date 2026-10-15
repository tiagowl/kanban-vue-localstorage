# Padrões de Design — Kanban Local

**Agente:** Arquiteto de Software
**Data:** 2026-10-15
**Documento:** `design-patterns.md`
**Insumos:** `architecture-diagram.md` · `tech-stack.md` · `outputs/product-owner/*.md` · `outputs/ux/design-system.md`
**Objetivo:** catalogar os padrões aplicados, sua intenção, onde vivem e um exemplo de referência. Define também os **anti-patterns proibidos**.

---

## 1. Visão Geral do Catálogo

| ID | Padrão | Categoria | Onde vive |
|----|--------|-----------|-----------|
| DP-01 | Store por agregado (Pinia) | Estado | `src/stores/*` |
| DP-02 | Repository / Adapter de persistência | Dados | `src/persistence/StorageAdapter` |
| DP-03 | Plugin de persistência (subscriber) | Integração | `src/persistence/persistencePlugin` |
| DP-04 | Camada de Domínio pura (funções/selectors) | Lógica | `src/domain/*` |
| DP-05 | Composable (hook reutilizável) | UI/Composição | `src/composables/*` |
| DP-06 | Container × Presentational | Componentes | `src/pages` / `src/components` |
| DP-07 | Normalização de estado por id | Dados | Todas as stores |
| DP-08 | Seletores/View-Model (memoização) | Dados | `src/domain/selectors` + getters |
| DP-09 | Observer (StorageEvent cross-tab) | Integração | `persistencePlugin` |
| DP-10 | Strategy (filtro/ordenação) | Comportamento | `src/domain/filters` |
| DP-11 | Factory de IDs | Criação | `src/domain/idGenerator` |
| DP-12 | Command/Action com validação | Operações | stores + `domain/rules` |
| DP-13 | Slot/Composable de confirmação | UX | `useConfirm` + `BaseModal` |
| DP-14 | Cascade delete explícito | Integridade | `domain/rules` |
| DP-15 | Adapter de acessibilidade (fallback DnD) | A11y | `useDragDrop` |

---

## 2. Detalhamento dos Padrões

### DP-01 — Store por agregado (Pinia)
**Intenção:** separar estado por raiz de agregado (Projeto, Etapa, Tarefa, Subtarefa, Etiqueta) + uma store de UI.
**Aplica-se em:** `projectsStore`, `stagesStore`, `tasksStore`, `subtasksStore`, `labelsStore`, `uiStore`.
**Regra:** relações cross-store são lidas via getters (ex.: `tasksStore` usa `stagesStore` para validar), nunca por acesso direto ao `localStorage`.

```js
// src/stores/tasksStore.js
export const useTasksStore = defineStore('tasks', () => {
  const items = ref([])               // Tarefa[]
  const byProject = (projectId) => computed(() =>
    items.value.filter(t => t.projectId === projectId))
  function add(payload) { /* valida via domain/rules + empurra */ }
  return { items, byProject, add }
})
```

### DP-02 — Repository / Adapter de persistência
**Intenção:** isolar o navegador atrás de uma interface estável; trocar de meio (localStorage → IndexedDB) sem tocar em stores.
**Contrato:** `get()`, `set(value)`, `remove()`, `isAvailable()`.
**Vantagem:** testável com um `InMemoryStorage` nos testes (sem `jsdom` storage).

```js
// src/persistence/storageAdapter.js
export function createStorageAdapter({ key = 'kanban:v1', storage = window.localStorage } = {}) {
  return {
    isAvailable: () => { try { const k = '__t__'; storage.setItem(k, k); storage.removeItem(k); return true } catch { return false } },
    get: () => { try { const raw = storage.getItem(key); return raw ? JSON.parse(raw) : null } catch { return { __corrupt: true } } },
    set: (value) => storage.setItem(key, JSON.stringify(value)),
    remove: () => storage.removeItem(key),
  }
}
```

### DP-03 — Plugin de persistência (subscriber)
**Intenção:** gravar automaticamente após qualquer mutação, sem `watch` em cada store.
**Aplica-se em:** `persistencePlugin` registrado em `app.use(pinia)`.
**Detalhes:** debounce (150ms) + `flush` no `beforeunload`; serializa o envelope versionado (ADR-005).

```js
// src/persistence/persistencePlugin.js  (esboço)
export function persistencePlugin({ store }) {
  const adapter = createStorageAdapter()
  let t
  const schedule = () => { clearTimeout(t); t = setTimeout(() => adapter.set(snapshot(store)), 150) }
  store.$subscribe(schedule)
}
```

### DP-04 — Camada de Domínio pura
**Intenção:** concentrar regras testáveis sem Vue/Pinia/navegador.
**Aplica-se em:** `domain/rules.js` (RN-01…RN-05, cascata), `domain/selectors.js`, `domain/filters.js`.
**Regra:** funções puras `(state) => result` ou `(state, args) => result`; nunca mutam entrada.

### DP-05 — Composable (hook reutilizável)
**Intenção:** encapsular lógica de UI com estado reativo reutilizável.
**Aplica-se em:** `useToast`, `useConfirm`, `useDragDrop`, `useAnchor`, `useDebouncedRef`.
**Regra:** nome sempre `use*`; retorna refs/funções; sem efeitos colaterais globais inesperados.

### DP-06 — Container × Presentational
**Intenção:** separar componentes que **orquestram estado** (`pages/`, ligados à store/rota) de componentes que **só renderizam** (props + emit).
**Regra:** componentes em `components/` não importam stores; recebem props e emitem eventos. Isso os torna testáveis e reutilizáveis (kanban, lista, global usam os mesmos átomos).

### DP-07 — Normalização de estado por id
**Intenção:** evitar duplicação e facilitar lookups `O(1)`/filtros.
**Aplica-se em:** todas as coleções. Relações por id (`stageId`, `projectId`, `taskId`).
**Exceção documentada:** `task.projectId` é desnormalizado intencionalmente para consultas globais (com integridade garantida por RN/DP-14).

### DP-08 — Seletores / View-Model
**Intenção:** transformar estado bruto em modelos prontos para a tela (origem, progresso x/y, etiquetas resolvidas), com memoização via `computed`.
**Aplica-se em:** `selectGlobalTasks()`, `selectTaskProgress()`, `selectTaskLabels()`, `selectOrigin()`.

```js
// domain/selectors.js
export const selectTaskProgress = (task, subtasks) => {
  const list = subtasks.filter(s => s.taskId === task.id)
  const done = list.filter(s => s.concluida).length
  return { done, total: list.length }
}
```

### DP-09 — Observer (cross-tab)
**Intenção:** reagir a gravações de outra aba.
**Aplica-se em:** `window.addEventListener('storage', ...)` no `persistencePlugin`; reidrata as stores (última gravação prevalece).

### DP-10 — Strategy (filtro/ordenação)
**Intenção:** permitir variar o comportamento de filtro/ordenação sem `if`s espalhados.
**Aplica-se em:** `domain/filters.js` — `byName(term)` (case-insensitive, parcial, RN-05), `byStage`, `byDone`.

```js
export const filters = {
  byName: (term) => (item) => item.titulo.toLowerCase().includes(term.trim().toLowerCase()),
}
```

### DP-11 — Factory de IDs
**Intenção:** IDs únicos e estáveis, com fallback quando `crypto.randomUUID` não existe.
**Aplica-se em:** `domain/idGenerator.js` (usado por todas as stores ao criar entidades).

### DP-12 — Command/Action com validação
**Intenção:** toda mutação é uma **ação nomeada** que valida antes de aplicar (evita estado inválido).
**Aplica-se em:** `addTask`, `moveTask`, `deleteStage`, `toggleSubtask`, `linkLabel`…
**Padrão:** ação retorna `{ ok, error }` ou lança erro de domínio tratado na UI (`uiStore.notifyError`).

### DP-13 — Confirmação via Composable + Modal
**Intenção:** padronizar confirmações destrutivas (US-03/US-09/US-14) com consequências explícitas e foco inicial em "Manter" (A-05/H-05).
**Aplica-se em:** `useConfirm()` que abre `ConfirmDialog.vue` e resolve uma `Promise<boolean>`.

```js
const ok = await confirm({ title: 'Excluir projeto?', consequences: ['Remove etapas, tarefas e subtarefas'] })
if (ok) projectsStore.remove(id)
```

### DP-14 — Cascade delete explícito
**Intenção:** garantir integridade pai-filho sem registros órfãos (CA US-03/US-09).
**Regras:**
- Excluir **projeto** → remove etapas, tarefas, subtarefas, etiquetas e vínculos.
- Excluir **tarefa** → remove subtarefas e vínculos de etiqueta.
- Excluir **etapa com tarefas** → **bloqueado** com aviso (A-01/acceptance US-06).
- Remover **etiqueta** → remove vínculos, **sem** apagar tarefas (RN-04).

### DP-15 — Adapter de acessibilidade (fallback de Drag-and-Drop)
**Intenção:** o kanban é acessível por teclado; o arrastar não pode ser a única forma de mover (US-10, risco "DnD pouco acessível").
**Aplica-se em:** `useDragDrop` para ponteiro/HTML5 DnD + menu "Mover para…" no card/drawer como alternativa 100% por teclado.

---

## 3. Padrões Reativos Vue

| Padrão | Uso |
|--------|-----|
| `ref`/`computed`/`watch` | Reatividade local e derivada |
| `storeToRefs` | Extrair estado/gets de store mantendo reatividade |
| `defineProps`/`defineEmits` | Contrato explícito dos presentational components |
| `provide/inject` (+ `InjectionKey`) | Evitar prop-drilling de contexto de projeto/task |
| `Teleport` | Modais/drawers/toasts no `body` |
| `Suspense` | Não usado no MVP (dados síncronos do storage) |

---

## 4. Anti-Patterns Proibidos

| Anti-pattern | Por quê proibido | Alternativa |
|--------------|------------------|-------------|
| Acessar `localStorage` fora do adapter | Quebra P-02; dificulta migração/teste | Sempre `StorageAdapter` |
| Regra de negócio em componente | Vai contra DP-04/DP-06 | `domain/rules` |
| `v-html` com dados do usuário | Vetor de XSS | Interpolação (Vue escapa) |
| Mutar props no filho | Quebra fluxo unidirecional | Emitir evento / usar store |
| `any`-like sem JSDoc | Perde tipagem útil | Anotar com JSDoc |
| Duplicar entidades na store | Quebra DP-07 | Referenciar por id |
| Apagar em cascata implícito | Gera órfãos | DP-14 explícito + confirmação |
| `watch` profundo em toda a store para persistir | Custo/ruído | Subscriber do plugin (DP-03) |
| Componente universal "faz-tudo" | Baixa coesão/testabilidade | Átomos + composição |
| Estilos fora do design system | Inconsistência visual (H-07) | Tokens Tailwind do `design-system.md` |

---

## 5. Aplicação por Fluxo (mapa rápido)

| Fluxo (US) | Padrões aplicados |
|------------|-------------------|
| Criar/editar/excluir projeto (US-01/02/03) | DP-06, DP-12, DP-13, DP-14 |
| Kanban e mover tarefa (US-10) | DP-01, DP-08, DP-15 |
| Lista (US-11) | DP-06, DP-08 |
| Subtarefas e toggle (US-12/13) | DP-04, DP-12 |
| Etiquetas N↔N (US-15/16) | DP-07, DP-12 (RN-04) |
| Globais + filtro (US-17/18) | DP-08, DP-10 |
| Navegação global→projeto (US-19/21) | DP-05 (`useAnchor`), roteamento |
| Persistência (US-23) | DP-02, DP-03, DP-09 |

---

**Documentos relacionados:** `architecture-diagram.md` · `tech-stack.md` · `development-guidelines.md` · `adr/`
