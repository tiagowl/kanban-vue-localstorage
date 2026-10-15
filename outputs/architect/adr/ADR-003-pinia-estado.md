# ADR-003 — Pinia como camada única de estado

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software

---

## Contexto

O PO fixou **Pinia** (`requirements.md` §5). O sistema tem cinco agregados (Projeto, Etapa, Tarefa, Subtarefa, Etiqueta) e precisa de estado reativo compartilhado entre tela inicial, projeto (kanban/lista) e visões globais, além de ser a fonte de verdade para a persistência.

## Decisão

Adotar **Pinia** com **uma store por agregado** + uma store de UI (`uiStore`). Toda mutação ocorre por **ações nomeadas** que validam via `domain/rules`. A persistência é integrada por um **plugin global**, não por `watch` em componentes. Acesso a outras stores é feito dentro das ações (evita ciclos de import).

## Consequências

**Positivas**
- Fonte única de verdade; getters reativos alimentam kanban, lista e globais.
- Suporte nativo a plugins e `$subscribe` → base do `persistencePlugin` (DP-03).
- Excelente DX/DevTools e testabilidade com `@pinia/testing`.

**Negativas**
- Risco de "god store" — mitigado por `domain/` puro e por store-por-agregado.
- Cross-store exige cuidado com dependências circulares (resolvido por import tardio).

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| Vuex | Legado; API mais verbosa; Pinia é o padrão oficial do Vue 3 |
| Estado local + `provide/inject` | Não escala entre telas globais e persistência |
| Composables globais como store | Perde DevTools, HMR e padrão de plugin |

## Referências

- `architecture-diagram.md` §3 · `design-patterns.md` DP-01/DP-03 · `development-guidelines.md` §4
