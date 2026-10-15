# ADR-011 — Geração de ids com `crypto.randomUUID`

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software

---

## Contexto

Todas as entidades precisam de identificadores únicos e estáveis, usados em relações normalizadas (ADR-006) e como chave de `v-for` e de APIs de foco/âncora (ADR-007). A persistência e a sincronização entre abas não podem sofrer colisões.

## Decisão

Centralizar a geração em `domain/idGenerator.js`, usando `crypto.randomUUID()` quando disponível e um fallback baseado em `crypto.getRandomValues` (formato UUID v4) para navegadores antigos. IDs são strings imutáveis; nunca sequenciais.

## Consequências

**Positivas**
- Colisões praticamente improváveis; seguro para cross-tab e merge futuro.
- Chaves estáveis para `v-for` e navegação por URL.
- Zero dependências externas.

**Negativas**
- IDs não são legíveis/ordenáveis (não servem para ordenação) — ordenação usa o campo `ordem`.
- `crypto.randomUUID` exige contexto seguro (HTTPS/localhost).

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| `Date.now()`/timestamp | Colisões em criações rápidas; não único |
| Contador incremental | Colide entre abas; não estável em merge |
| `nanoid` (lib) | Dependência desnecessária; `crypto` cobre o caso |
| UUID de lib (`uuid`) | Dependência extra para algo nativo |

## Referências

- `architecture-diagram.md` §8 · `design-patterns.md` DP-11 · `tech-stack.md` §1
