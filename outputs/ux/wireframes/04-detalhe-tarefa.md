# WF-04 — Drawer de Detalhe da Tarefa

**Stories:** US-08 (editar), US-12/13/14 (subtarefas), US-16 (etiquetas), US-19/21 (foco vindo das visões globais)
**Abertura:** clique no card/linha (qualquer visão) ou por rota `?tarefa=:id` · **Persona:** Bruno
**Objetivo:** executar a tarefa completa (contexto + subtarefas + progresso) sem sair da tela atual.

---

## Wireframe (painel lateral direito, 420–480px; sobre fundo escurecido 40%)

```
                          ┌──────────────────────────────────┐ ✕
                          │ Site X › Em Andamento    (origem)│
                          │ ┌──────────────────────────────┐ │
                          │ │ Escrever homepage            │ │  ← input título (editável in place)
                          │ └──────────────────────────────┘ │
                          │ Descrição                        │
                          │ ┌──────────────────────────────┐ │
                          │ │ Texto livre, 2 linhas…       │ │  ← textarea expansível
                          │ └──────────────────────────────┘ │
                          │ Etiquetas                        │
                          │ [urgente] [cliente A] [ + ]      │  ← só etiquetas deste projeto
                          │                                  │
                          │ Mover para: [ Em Andamento ▾ ]   │  ← seletor de etapa
                          │                                  │
                          │ Subtarefas            2/5  ▓▓▓░░ │  ← contador + barra
                          │ ┌──────────────────────────────┐ │
                          │ │ [✓] Definir copy        ✎ X │ │  ← concluída: riscada
                          │ │ [✓] Escolher imagens    ✎ X │ │
                          │ │ [ ] Escrever CTA        ✎ X │ │  ← foco/âncora: borda primária
                          │ │ [ ] Montar wireframe    ✎ X │ │     (vindo da global de subtarefas)
                          │ │ [ ] Revisar SEO         ✎ X │ │
                          │ └──────────────────────────────┘ │
                          │ [ + Adicionar subtarefa      ]   │  ← input inline, Enter cria
                          │                                  │
                          │ ──────────────────────────────── │
                          │          [ X Excluir tarefa ]    │  ← destrutivo, confirmação
                          └──────────────────────────────────┘
```

### Estados do toggle de subtarefa

```
[ ] Pendente        [✓] Concluída (texto riscado, opacidade 60%, cor sucesso)
     │                     │
     └── clique → animação de check (120ms) → persistência → barra 2/5 → 3/5
```

---

## Hierarquia de informação

1. **Origem** `Site X › Em Andamento` — responde "onde estou" (crítico quando aberto a partir das visões globais).
2. **Título** (editável) e **descrição** — identidade da tarefa.
3. **Etiquetas + etapa** — classificação e localização.
4. **Subtarefas** — o "trabalho real", com progresso sempre visível.
5. **Ações destrutivas** — no fim, afastadas das ações diárias.

## Interações

| Elemento | Ação | Resultado / feedback |
|----------|------|----------------------|
| Título | editar + `Enter`/blur | Salva inline; vazio → borda de erro + dica "Título obrigatório" |
| Descrição | editar + blur | Salva; placeholder "Sem descrição" |
| `[+]` etiqueta | clique | Popover listando **apenas etiquetas do projeto** (RN-04); marca/desmarca |
| `Mover para…` | mudança | Move a tarefa; toast "Movida para Concluído"; card re-renderiza no kanban/lista |
| Checkbox subtarefa | clique | Toggle imediato; contador e barra atualizam; **persistência garantida após reload** (US-13) |
| `✎` subtarefa | clique | Edição inline do texto |
| `X` subtarefa | clique | Confirmação pequena; última subtarefa excluída é válida |
| `+ Adicionar subtarefa` | `Enter` | Cria com estado "não concluída"; limpa o campo para a próxima |
| `X Excluir tarefa` | clique | Confirmação: "A tarefa e suas 5 subtarefas serão excluídas" |
| `✕` / `Esc` / clique no fundo | — | Fecha preservando o estado da tela subjacente |

**Foco garantido (US-19/US-21):** ao chegar por rota `?tarefa=:id`, o drawer abre com a tarefa selecionada; com `#sub-:id`, a subtarefa de origem recebe realce de 2s e rolagem automática.

## Estados

| Estado | Comportamento |
|--------|---------------|
| Tarefa não encontrada (excluída em outra aba) | Toast "Tarefa não encontrada" + retorna à visão anterior |
| Salvamento falha (quota) | Banner no drawer: "Não foi possível salvar" + manter edição em memória |
| Sem subtarefas | Lista vazia com micro-copy "Divida a tarefa em passos" + campo pronto para uso |
| Loading | Skeleton do painel |

## Responsividade

| Breakpoint | Adaptação |
|------------|-----------|
| ≥ 1024px | Drawer lateral direita (480px), fundo escurecido clicável |
| 768–1023px | Drawer 420px |
| ≤ 767px | **Full-screen** com header fixo (`✕ Site X › Em Andamento`); barra de progresso sticky no rodapé |

## Acessibilidade

- Comportamento de diálogo: `role="dialog"`, `aria-modal="true"`, foco preso no drawer, `Esc` fecha, foco retorna ao card de origem.
- Subtarefas como `<ul>` de checkboxes com rótulo completo ("Concluir Definir copy").
- Barra de progresso com `aria-valuetext="2 de 5 subtarefas concluídas"`.
- Mudanças anunciadas via `aria-live="polite"` (criação/exclusão/movimentação).
