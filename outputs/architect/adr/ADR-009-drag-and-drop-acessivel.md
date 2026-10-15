# ADR-009 — Drag-and-drop com fallback acessível

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software, UX Designer

---

## Contexto

US-10 exige mover tarefas entre etapas na visão kanban. O relatório de usabilidade aponta como risco "Drag-and-drop pouco acessível por teclado" (Prob. Média) e exige operação por teclado nos fluxos principais e alvos ≥ 40px (WCAG AA). O design system já prevê o estado `dragging` do card e `drop-hover` da coluna.

## Decisão

Implementar drag-and-drop via composable `useDragDrop` (ponteiro + HTML5 DnD) **com sempre um caminho alternativo por teclado**: opção **"Mover para…"** no menu do card e no drawer da tarefa. O estado visual segue o design system (card `dragging`, coluna `drop-hover`). Persistência da nova etapa é imediata (CA US-10).

## Consequências

**Positivas**
- Cobre os dois públicos: ponteiro (eficiência) e teclado (acessibilidade).
- Cumpre WCAG AA sem depender de libs de DnD pesadas.
- Estado de movimento é testável por E2E.

**Negativas**
- Duas formas de executar a mesma ação exigem testes para ambas.
- HTML5 DnD tem particularidades entre navegadores — encapsuladas no composable.

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| Biblioteca DnD (vuedraggable/Sortable) | Peso e dependência; a acessibilidade ainda exigiria fallback |
| Só botões "mover" (sem arrastar) | Pior eficiência para o caso comum de desktop |
| Só arrastar | Viola acessibilidade (risco do UX) |

## Referências

- `outputs/product-owner/user-stories.md` US-10 · `outputs/ux/usability-reports.md` §8 · `design-patterns.md` DP-15 · `development-guidelines.md` §7
