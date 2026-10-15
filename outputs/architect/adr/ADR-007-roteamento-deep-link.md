# ADR-007 — Vue Router com deep-link por query/hash

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software

---

## Contexto

US-19 e US-21 exigem navegação em **1 clique** das visões globais até a tarefa (e subtarefa) na página do respectivo projeto, com foco/destaque do item. Os critérios de aceitação sugerem rotas com ids (`/projetos/:idProjeto?tarefa=:idTarefa`). O wireframes `index.md` prevê `#sub-:id` para âncora. Também é necessário preservar contexto ao alternar Kanban ↔ Lista (US-11).

## Decisão

Usar **Vue Router** com:
- Rotas: `/`, `/projetos/:projectId`, `/tarefas`, `/subtarefas`, fallback `NotFound`.
- Query `?tarefa=:taskId` para abrir a tarefa em foco; hash `#sub-:subtaskId` para âncora da subtarefa.
- `?view=kanban|lista` para persistir a preferência de visualização.
- `createWebHistory` em host com SPA fallback; `createWebHashHistory` como fallback para host estático sem rewrite.

## Consequências

**Positivas**
- Deep-linking e botão voltar funcionam; navegação em 1 clique (H-03).
- Estado de visualização/filtro compartilhável por URL.
- Foco/âncora determinísticos via `useAnchor` (scrollIntoView + destaque 2,4s, A-03).

**Negativas**
- Exige host com rewrite (ou hash mode) — documentado para o DevOps.
- Estado em URL pode ficar verboso — mantido mínimo (`q`, `tarefa`, `view`).

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| Só estado em store (sem URL) | Perde deep-link e botão voltar; navegação global→projeto não compartilhável |
| Query só com hash | Pior para SEO/estado; `history` é preferível quando há host com rewrite |
| Router alternativo (ex.: TanStack Router) | Vue Router é padrão e suficiente |

## Referências

- `architecture-diagram.md` §5 · `outputs/ux/wireframes/index.md` §1 · `outputs/product-owner/acceptance-criteria.md` US-19/US-21
