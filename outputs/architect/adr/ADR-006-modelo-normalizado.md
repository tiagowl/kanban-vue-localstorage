# ADR-006 — Modelo de dados normalizado por id

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software

---

## Contexto

As entidades têm hierarquia (Projeto → Etapa → Tarefa → Subtarefa) e uma relação N↔N (Tarefa ↔ Etiqueta, escopada ao projeto). As visões globais (`/tarefas`, `/subtarefas`) precisam compor dados de vários projetos com origem visível (US-17/US-20, A-07). O modelo não pode duplicar entidades nem gerar órfãos.

## Decisão

Adotar um **modelo normalizado por id**: coleções planas (`projects`, `stages`, `tasks`, `subtasks`, `labels`) + tabela de junção `taskLabels` (`{ taskId, labelId }`). Relações por referência de id. **Exceção intencional:** `task.projectId` é desnormalizado além de `stageId` para acelerar as visões globais; a integridade é garantida por regra de domínio.

## Consequências

**Positivas**
- Sem duplicação de entidades; consistência e tamanho reduzido no storage.
- Consultas globais simples e performáticas.
- Facilita cascatas e migrações.

**Negativas**
- Desnormalização de `task.projectId` exige disciplina (manter em sincronia ao mover/editar) — coberto por `domain/rules` e testes.
- Tabela de junção adiciona uma coleção a gerenciar.

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| Aninhamento (projeto contém etapas/tarefas) | Duplicação e navegação global custosa; difícil manter integridade |
| Duplicar tarefas por visão | Fonte de verdade múltipla; risco de divergência |
| Normalizar ao extremo (sem desnormalizar) | Consultas globais mais custosas para o volume esperado |

## Referências

- `architecture-diagram.md` §6 · `outputs/product-owner/requirements.md` RN-02/RN-04
