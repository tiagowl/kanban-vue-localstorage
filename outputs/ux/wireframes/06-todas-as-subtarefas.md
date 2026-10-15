# WF-06 — Página "Todas as Subtarefas" (Visão Global)

**Stories:** US-20 (consolidado), US-21 (navegação → tarefa com âncora) · **Persona:** Bruno (execução em lote)
**Rota:** `/subtarefas` · **Objetivo:** acompanhar pendências de todos os projetos e chegar à subtarefa dentro do contexto original em 1 clique.

---

## Wireframe (desktop ≥ 1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ K Kanban Local      Projetos  Todas as Tarefas  [Todas as Subtarefas]  ⋮ │
├────────────────────────────────────────────────────────────────────────────┤
│ Todas as subtarefas                                        12 subtarefas  │
│ ┌──────────────────────────────────────────────┐  pendentes 8 · feitas 4  │
│ │ ⌕  Filtrar por subtarefa…                ✕ │   (busca = Could)        │
│ └──────────────────────────────────────────────┘                          │
│                                                                           │
│ [ Pendentes ]  [ Concluídas ]  [ Todas ]        ← segmentado opcional      │
│ ┌────────────────────────────────────────────────────────────────────┐    │
│ │ ORIGEM                                   PROGRESSO DA TAREFA       │    │
│ │ Site X › Escrever homepage                     2/5            →    │    │
│ │ [ ] Definir copy                                                          │
│ ├────────────────────────────────────────────────────────────────────┤    │
│ │ Site X › Escrever homepage                     2/5            →    │    │
│ │ [ ] Escrever CTA                                                       │    │
│ ├────────────────────────────────────────────────────────────────────┤    │
│ │ App Mobile › Ajustar hero                     1/3            →    │    │
│ │ [✓] Trocar banner (concluída ~riscada)                                │    │
│ ├────────────────────────────────────────────────────────────────────┤    │
│ │ Estudo Vue › Estudar Pinia                    0/2            →    │    │
│ │ [ ] Fazer exercício prático                                           │    │
│ └────────────────────────────────────────────────────────────────────┘    │
│  ↑ cada item identifica: subtarefa · tarefa de origem · projeto · status   │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Hierarquia de informação

1. **Título + contagem** — "12 subtarefas" (8 pendentes · 4 feitas).
2. **Segmentado de status** (Todas/Pendentes/Concluídas) — reduz ruído para execução em lote.
3. **Agrupamento por tarefa de origem:** cabeçalho `projeto › tarefa` + progresso da tarefa; abaixo, os itens de subtarefa com checkbox.
4. **Indicador `→`** no cabeçalho — sinaliza que o grupo navega para a origem.

> **Decisão de UX:** a unidade clicável primária é o **item de subtarefa** (linha inteira). Clicar no cabeçalho navega para a tarefa sem âncora específica; clicar na subtarefa navega **com âncora** (foco + realce).

## Interações

| Elemento | Ação | Resultado / feedback |
|----------|------|----------------------|
| Linha de subtarefa | clique (1 clique) | `/projetos/:id?tarefa=:id#sub-:id` → projeto abre, drawer da tarefa abre, subtarefa **rolada e realçada por 2s** (US-21) |
| Checkbox | clique | Conclui/desconclui **in place**; contador da tarefa (x/y) atualiza; sincroniza com drawer/kanban/lista |
| Segmentado | clique | Filtra por status localmente (não altera dados) |
| Cabeçalho do grupo | clique | Navega para a tarefa (sem âncora) |
| Tarefa/projeto de origem removido | clique | Toast "Origem não encontrada" + permanece na página (ou retorna, conforme confirmação) |
| Filtro por nome (se ativo no MVP Could) | digitação | Debounce 200ms, case-insensitive, contém |

**Sincronização:** criação/exclusão em qualquer outra tela reflete aqui em tempo real (fonte única de estado).

## Estados

| Estado | Comportamento |
|--------|---------------|
| Nenhuma subtarefa no sistema | Estado vazio: "Nenhuma subtarefa ainda — quebre tarefas grandes em passos" + CTA "Ir para Projetos" |
| Tarefa sem subtarefas | Não gera entradas vazias (nunca linhas em branco) |
| Loading | Skeleton de 6 grupos |
| Dados corrompidos no `localStorage` | Fallback para estado vazio **com aviso** (US-23) |

## Responsividade

| Breakpoint | Adaptação |
|------------|-----------|
| ≥ 1024px | Duas colunas: subtarefa (flex) + progresso/origem à direita |
| 768–1023px | Cabeçalho do grupo em 2 linhas |
| ≤ 767px | Empilhado: badge `projeto › tarefa` no topo de cada card, subtarefa com checkbox grande (40px+); segmentado vira chips roláveis |

## Acessibilidade

- Itens como `<ul>` de checkboxes com rótulo completo: "Concluir 'Definir copy' da tarefa 'Escrever homepage' do projeto Site X".
- Cabeçalhos de grupo como `<h3>` com link de navegação nomeado.
- `aria-live` para mudanças de status ("Subtarefa concluída, 3 de 5 na tarefa Escrever homepage").
- Realce de âncora combinado com `focus()` — não apenas cor (uso de borda + fundo).
