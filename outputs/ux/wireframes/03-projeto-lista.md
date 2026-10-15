# WF-03 — Projeto · Visão Lista

**Stories:** US-11 (alternar visão), US-08 (editar tarefa) · **Persona:** Bruno (leitura densa)
**Rota:** `/projetos/:id?visao=lista` · **Objetivo:** ler e comparar muitas tarefas rapidamente, sem perder o contexto do projeto.

---

## Wireframe (desktop ≥ 1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ K Kanban Local      [Projetos]  Todas as Tarefas  Todas as Subtarefas  ⋮ │
├────────────────────────────────────────────────────────────────────────────┤
│ ← Projetos / Site X                                                       │
│ [ #Etiquetas ]   (Kanban | Lista)         [ + Nova etapa ] [ + Nova tarefa]│
├────────────────────────────────────────────────────────────────────────────┤
│ A FAZER (4)                                            [colapsar ▲]        │
│ ┌──┬──────────────────────────────┬────────────┬──────────┬─────────────┐  │
│ │  │ Tarefa                       │ Etiquetas  │ Progresso│        ⋮    │  │
│ ├──┼──────────────────────────────┼────────────┼──────────┼─────────────┤  │
│ │✗ │ Escrever homepage            │urgente     │ ▓▓▓░ 2/5 │ abrir/edit  │  │
│ │✗ │ Definir copy                 │estudo      │ ▓░░░ 0/3 │ abrir/edit  │  │
│ │✗ │ Pesquisar referências        │—           │ 0 subt.  │ abrir/edit  │  │
│ │✗ │ Comprar domínio              │cliente A   │ —        │ abrir/edit  │  │
│ └──┴──────────────────────────────┴────────────┴──────────┴─────────────┘  │
│ EM ANDAMENTO (2)                                       [colapsar ▲]        │
│ ┌──┬──────────────────────────────┬────────────┬──────────┬─────────────┐  │
│ │✗ │ Ajustar hero                 │cliente A   │ ▓░░░ 1/3 │ ⋮           │  │
│ │✗ │ Revisar textos               │—           │ 0 subt.  │ ⋮           │  │
│ └──┴──────────────────────────────┴────────────┴──────────┴─────────────┘  │
│ CONCLUÍDO (1)                                         [colapsar ▲]        │
│ ┌──┬──────────────────────────────┬────────────┬──────────┬─────────────┐  │
│ │✓ │ Publicar (concluída ~riscada)│urgente     │ ▓▓ 2/2   │ ⋮           │  │
│ └──┴──────────────────────────────┴────────────┴──────────┴─────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Hierarquia de informação

1. **Mesmo cabeçalho do kanban** (breadcrumb, segmentado, ações) — o usuário nunca "troca de app" ao alternar visões.
2. **Agrupamento por etapa** com cabeçalho colapsável e contador — mantém a lógica do fluxo.
3. **Linha de tarefa:** concluído/checkbox → título → etiquetas → progresso → menu.
4. Colunas secundárias podem ser omitidas em telas estreitas (prioridade: título e progresso).

## Interações

| Elemento | Ação | Resultado / feedback |
|----------|------|----------------------|
| `(Kanban\|Lista)` | clique | Troca imediata, **mesmos dados e contexto** (US-11) — nunca recarrega a página |
| Linha / título | clique | Abre drawer da tarefa (WF-04) |
| Checkbox da linha | clique | Alterna conclusão da **tarefa**; estado persiste |
| `✎` / `⋮` | clique | Editar (modal) · Mover para etapa · Excluir (confirmação) |
| Cabeçalho de etapa | clique | Colapsa/expande o grupo (preferência em memória de sessão) |
| Título longo | hover/focus | Tooltip com título completo (2 linhas com clamp) |

**Garantia:** alterações feitas aqui aparecem no kanban e nas visões globais instantaneamente (fonte única de estado).

## Estados

| Estado | Comportamento |
|--------|---------------|
| Projeto sem tarefas | Estado vazio por etapa + CTA "Nova tarefa" |
| Muitas tarefas | Renderização virtualizada/memória eficiente; scroll suave |
| Loading | Skeleton de linhas (8 linhas) |

## Responsividade

| Breakpoint | Adaptação |
|------------|-----------|
| ≥ 1024px | Todas as colunas visíveis |
| 768–1023px | Coluna "Etiquetas" oculta (chips no título) |
| ≤ 767px | Linha vira **card empilhado**: título + chips + progresso; grupos colapsáveis; alvo ≥ 40px |

## Acessibilidade

- Lista estruturada com `<ul>`/`<li>`; cabeçalhos de grupo como `<h3>`.
- Checkbox real (`<input type="checkbox">`) com rótulo "Concluir Escrever homepage".
- Ordem de tabulação segue a ordem visual (título → ações da linha).
