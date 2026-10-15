# ADR-008 — Exclusão em cascata e bloqueio de etapa com tarefas

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software, Product Owner

---

## Contexto

Exclusões podem deixar registros órfãos. O PO definiu como default (pendência de validação, `backlog.md` §7): **bloquear a exclusão de etapa com tarefas**; excluir projeto remove toda a árvore; excluir tarefa remove subtarefas; remover etiqueta **não** apaga tarefas (RN-04). O UX reforçou prevenção de erro (A-01, H-05). As CA exigem confirmação e ausência de órfãos.

## Decisão

Centralizar as regras de exclusão em `domain/rules` (DP-14), com comportamento explícito:

| Operação | Comportamento |
|----------|---------------|
| Excluir **projeto** | Cascata: remove etapas, tarefas, subtarefas, etiquetas e `taskLabels` |
| Excluir **tarefa** | Cascata: remove subtarefas e vínculos `taskLabels` |
| Excluir **etapa com tarefas** | **Bloqueado** com aviso e contagem de tarefas (UI orienta mover/esvaziar) |
| Excluir **etapa vazia** | Permitido |
| Excluir **subtarefa** | Permitido (não afeta a tarefa) |
| Excluir **etiqueta** | Remove vínculos `taskLabels`; **tarefas permanecem** |

Toda exclusão destrutiva exige **confirmação** com consequências explícitas (`useConfirm` + `ConfirmDialog`, foco inicial em "Manter").

## Consequências

**Positivas**
- Nunca há registros órfãos; integridade garantida em um único ponto.
- Comportamento previsível e testável (casos obrigatórios de teste).
- Alinhado à prevenção de erro do UX.

**Negativas**
- Bloqueio pode frustrar usuários que querem excluir etapas com muitas tarefas — mitigado por mensagem clara e ação de mover.
- Cascata é irreversível — mitigada por confirmação explícita.

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| Cascata silenciosa em tudo | Alto risco de perda de dados (A-01) |
| Mover tarefas automaticamente ao excluir etapa | Ambiguidade sobre destino; não definido pelo PO |
| Soft delete (lixeira) | Aumenta complexidade/estado; fora do MVP |

## Referências

- `outputs/product-owner/backlog.md` §7 · `acceptance-criteria.md` US-03/US-06/US-09/US-14/US-15 · `design-patterns.md` DP-14
