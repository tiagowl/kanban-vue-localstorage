# Outputs do Arquiteto de Software — Kanban Local

**Agente:** Arquiteto de Software
**Data:** 2026-10-15
**Fase:** 2. Arquitetura e Design (`workflows/complete-development.json`)

---

## Escopo

Projeto da arquitetura e da estrutura técnica do sistema Kanban Local, a partir dos outputs do Product Owner e do UX Designer.

**Insumos:**
- `outputs/product-owner/requirements.md`
- `outputs/product-owner/user-stories.md`
- `outputs/product-owner/backlog.md`
- `outputs/product-owner/acceptance-criteria.md`
- `outputs/ux/design-system.md`, `wireframes/`, `usability-reports.md`

**Restrições herdadas:** SPA client-side · Vue 3 + Pinia + Tailwind · `localStorage` · single-user · UI profissional e acessível.

---

## Inventário de Entrega

| # | Artefato | Caminho | Conteúdo |
|---|----------|---------|----------|
| 1 | Arquitetura e diagramas | [`architecture-diagram.md`](architecture-diagram.md) | C4 (contexto/container/componentes), camadas, fluxos, ERD, rotas, NFRs |
| 2 | Stack tecnológica | [`tech-stack.md`](tech-stack.md) | Escolhas, justificativas, versões, alternativas, adequação |
| 3 | Padrões de design | [`design-patterns.md`](design-patterns.md) | Catálogo DP-01…DP-15 + anti-patterns proibidos |
| 4 | Guia de desenvolvimento | [`development-guidelines.md`](development-guidelines.md) | Estrutura, convenções, a11y, testes, CI, checklist de PR |
| 5 | Decisões arquiteturais | [`adr/`](adr/README.md) | 12 ADRs (ADR-001…ADR-012) |

> Os quatro primeiros correspondem aos `outputs` declarados em `agents/architect/config.json`. Os ADRs atendem ao item "Documente decisões arquiteturais" do template do arquiteto.

---

## Decisões-Chave (resumo)

- SPA sem backend; persistência local versionada ([ADR-001](adr/ADR-001-spa-client-side.md), [ADR-005](adr/ADR-005-persistencia-localstorage.md)).
- Vue 3 Composition API + Pinia store-por-agregado ([ADR-002](adr/ADR-002-vue3-composition-api.md), [ADR-003](adr/ADR-003-pinia-estado.md)).
- Modelo normalizado por id, com `task.projectId` desnormalizado ([ADR-006](adr/ADR-006-modelo-normalizado.md)).
- Navegação deep-link por query/hash ([ADR-007](adr/ADR-007-roteamento-deep-link.md)).
- Exclusão em cascata + bloqueio de etapa com tarefas ([ADR-008](adr/ADR-008-exclusao-cascata-bloqueio.md)).
- DnD acessível com fallback "Mover para…" ([ADR-009](adr/ADR-009-drag-and-drop-acessivel.md)).
- Testes Vitest + Playwright + axe ([ADR-012](adr/ADR-012-estrategia-de-testes.md)).

---

## Rastreabilidade com o Product Owner

| Requisito (PO) | Onde é endereçado |
|----------------|-------------------|
| F-01…F-05 (CRUDs) | `design-patterns.md` DP-01/DP-12/DP-14 · `architecture-diagram.md` §6 |
| F-06/F-07 (Kanban/Lista) | `architecture-diagram.md` §5 · `development-guidelines.md` §3 |
| F-08/F-10 (globais + navegação) | `architecture-diagram.md` §5/§9 · ADR-006/ADR-007 |
| F-11 / US-22 (UI e a11y) | `design-patterns.md` DP-06 · `development-guidelines.md` §6/§7 |
| US-23 (persistência) | `architecture-diagram.md` §7 · ADR-005 |
| RN-01…RN-05 | `architecture-diagram.md` §6.3 · `design-patterns.md` DP-04/DP-14 |

---

## Handoff

**Fornece para:** `frontend-dev`, `backend-dev` (não aplicável — sem backend), `devops`, `tester`.

| Destinatário | O que usar |
|--------------|-----------|
| frontend-dev / fullstack-dev | `development-guidelines.md` + `design-patterns.md` + `design-system.md` |
| tester | `adr/ADR-012` + casos obrigatórios das CA |
| devops | `tech-stack.md` §5 (ambiente, build estático, SPA fallback — ADR-007) |

---

## Pendências / Próximos Passos

1. Confirmar com o PO as regras de exclusão (default adotado em ADR-008).
2. Validar host de deploy (history vs hash mode — ADR-007).
3. Iniciar Sprint 0 (fundação) conforme `outputs/product-owner/backlog.md` §5.
