# Architecture Decision Records (ADRs) — Kanban Local

**Agente:** Arquiteto de Software
**Data:** 2026-10-15
**Formato:** Contexto · Decisão · Consequências · Alternativas · Referências
**Status possíveis:** Aceita · Proposta · Substituída · Depreciada

---

## Índice

| ID | Título | Status |
|----|--------|--------|
| [ADR-001](ADR-001-spa-client-side.md) | Arquitetura SPA 100% client-side, sem backend | Aceita |
| [ADR-002](ADR-002-vue3-composition-api.md) | Vue 3 com Composition API e `<script setup>` | Aceita |
| [ADR-003](ADR-003-pinia-estado.md) | Pinia como camada única de estado | Aceita |
| [ADR-004](ADR-004-tailwind-design-tokens.md) | Tailwind CSS com tokens do design system | Aceita |
| [ADR-005](ADR-005-persistencia-localstorage.md) | Persistência em `localStorage` com envelope versionado | Aceita |
| [ADR-006](ADR-006-modelo-normalizado.md) | Modelo de dados normalizado por id | Aceita |
| [ADR-007](ADR-007-roteamento-deep-link.md) | Vue Router com deep-link por query/hash | Aceita |
| [ADR-008](ADR-008-exclusao-cascata-bloqueio.md) | Exclusão em cascata e bloqueio de etapa com tarefas | Aceita |
| [ADR-009](ADR-009-drag-and-drop-acessivel.md) | Drag-and-drop com fallback acessível | Aceita |
| [ADR-010](ADR-010-javascript-jsdoc.md) | JavaScript + JSDoc (em vez de TypeScript) | Aceita |
| [ADR-011](ADR-011-geracao-de-ids.md) | Geração de ids com `crypto.randomUUID` | Aceita |
| [ADR-012](ADR-012-estrategia-de-testes.md) | Estratégia de testes (Vitest + Playwright + axe) | Aceita |

---

## Convenções

- Um ADR é **imutável** após aceito; mudanças geram um novo ADR que substitui o anterior.
- Todo ADR referencia os requisitos (`US-*`, `CA-*`, `RN-*`) e artefatos de origem.
- ADRs são versionados junto ao código.
