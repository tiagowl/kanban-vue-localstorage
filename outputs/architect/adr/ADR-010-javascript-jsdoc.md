# ADR-010 — JavaScript + JSDoc (em vez de TypeScript)

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software

---

## Contexto

O PO fixou a stack Vue 3 + Pinia + Tailwind + localStorage, sem mencionar linguagem tipada. Os artefatos existentes são JavaScript (`tailwind.config.js`, protótipo UX em JS). O ideal seria maximizar segurança de tipos para reduzir bugs em cascatas/persistência, mantendo baixa fricção para o time.

## Decisão

Usar **JavaScript (ES2022, ESM) com anotação de tipos via JSDoc** (`@typedef`, `@param`, `@returns`) e checagem opcional via `// @ts-check`/`jsconfig.json` com `allowJs`. Não introduzir TypeScript no MVP.

## Consequências

**Positivas**
- Coerência com artefatos e configs existentes; nenhum passo de build de tipos.
- IntelliSense e checagem úteis com custo baixo (JSDoc + `jsconfig`).
- Menor barreira de entrada para o time.

**Negativas**
- Garantias de tipo mais fracas que TS; refactors menos seguros.
- Disciplina manual para manter JSDoc atualizado.

## Plano de migração (gatilho)

Migrar para TypeScript se ocorrer qualquer um: (a) mais de ~6 meses de evolução contínua, (b) mais de 2 desenvolvedores no código, (c) incidentes recorrentes por erro de tipo. A migração é incremental (`allowJs` + renomear módulos de domínio primeiro: `domain/`, `persistence/`).

## Alternativas consideradas

| Alternativa | Motivo do descarte (por ora) |
|-------------|------------------------------|
| TypeScript desde o início | Curva/overhead frente ao escopo e artefatos existentes; fica como evolução |
| JS puro sem JSDoc | Perde tipagem/IntelliSense; maior risco de bugs |

## Referências

- `tech-stack.md` §2.7 · `development-guidelines.md` §2
