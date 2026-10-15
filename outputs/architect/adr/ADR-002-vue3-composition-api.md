# ADR-002 — Vue 3 com Composition API e `<script setup>`

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software

---

## Contexto

O PO fixou **Vue 3** como framework (`requirements.md` §5). É preciso padronizar o estilo de autoria dos componentes para consistência, reatividade previsível e testabilidade.

## Decisão

Usar **Vue 3** com a **Composition API** em todos os componentes, preferencialmente via **`<script setup>`**. Lógica reutilizável é expressa como **composables** (`use*`), nunca como mixins.

## Consequências

**Positivas**
- Reatividade granular e melhor desempenho em listas (kanban).
- Melhor organização por proximidade de responsabilidade e tipagem via JSDoc.
- Composables testáveis isoladamente; sem colisões de namespace de mixins.

**Negativas**
- Exige disciplina e familiaridade com `ref`/`computed` (curva baixa, mas real).
- Projects Options API antigos não se integram ao padrão — irrelevante (projeto novo).

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| Options API | Menos reuso de lógica; menos adequada a tipagem JSDoc |
| Mixins | Colisões de nome e origem difusa de estado |
| React/Svelte | Stack fixada em Vue pelo PO |

## Referências

- `tech-stack.md` §2.1 · `development-guidelines.md` §3 · `design-patterns.md` DP-05/DP-06
