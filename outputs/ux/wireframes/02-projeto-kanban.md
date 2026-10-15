# WF-02 — Projeto · Visão Kanban

**Stories:** US-05, US-06 (etapas), US-07 (criar tarefa), US-10 (mover), US-15/16 (etiquetas)
**Rota:** `/projetos/:id` · **Persona:** Ana e Bruno · **Objetivo:** ver e movimentar o trabalho entre etapas.

---

## Wireframe (desktop ≥ 1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ K Kanban Local      [Projetos]  Todas as Tarefas  Todas as Subtarefas  ⋮ │
├────────────────────────────────────────────────────────────────────────────┤
│ ← Projetos / Site X                                                       │
│ Landing page da nova campanha                                              │
│                                                                           │
│ [ #Etiquetas ]   (Kanban | Lista)         [ + Nova etapa ] [ + Nova tarefa]│
│                  ▲segmentado        (desabilitado se 0 etapas, com dica)  │
├────────────────────────────────────────────────────────────────────────────┤
│ ┌─ A FAZER (4) ──────────┐ ┌─ EM ANDAMENTO (2) ─────┐ ┌─ CONCLUÍDO (1) ┐ │
│ │ +                      │ │ +                      │ │ +              │ │
│ │ ┌────────────────────┐ │ │ ┌────────────────────┐ │ │ ┌────────────┐ │ │
│ │ │✗ Escrever homepage │ │ │ │✗ Ajustar hero      │ │ │ │✓ Publicar  │ │ │
│ │ │[urgente][cliente A]│ │ │ │[cliente A]         │ │ │ │[urgente]   │ │ │
│ │ │▓▓▓▓▓░░░ 2/5 subt.  │ │ │ │▓░░ 1/3 subt.       │ │ │ │▓▓ 2/2 subt.│ │ │
│ │ └────drag cursor─────┘ │ │ └────────────────────┘ │ │ └────────────┘ │ │
│ │ ┌────────────────────┐ │ │                        │ │  vazio abaixo   │ │
│ │ │  Definir copy      │ │ │ ┌────────────────────┐ │ │                │ │
│ │ │  [estudo]          │ │ │ │  Revisar textos    │ │ │                │ │
│ │ │  ▓░░ 0/3 subt.     │ │ │ │  0 subtarefas      │ │ │                │ │
│ │ └────────────────────┘ │ │ └────────────────────┘ │ │                │ │
│ │                        │ │                        │ │                │ │
│ └────────────────────────┘ └────────────────────────┘ └────────────────┘ │
│  ◄ scroll horizontal entre colunas (colunas min 280px) ►                  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Detalhe do card de tarefa (unidade de leitura)

```
┌──────────────────────────────┐
│ ✗  Escrever homepage         │  ← checkbox "concluir" + título (2 linhas máx)
│ [urgente] [cliente A]        │  ← chips de etiqueta (escopo do projeto)
│ ▓▓▓▓▓░░░░░  2/5 subtarefas   │  ← progresso + contador
│ ⋮                            │  ← menu rápido: editar / mover / excluir
└──────────────────────────────┘
```

### Drop alvo (durante drag)

```
┌─ EM ANDAMENTO (2) ─────┐
│ ┌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐  │   ← borda tracejada primária + fundo 5%
│ ┌╌ Solte aqui ╌╌╌╌┐  │  │
│ └╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┘  │
└────────────────────────┘
```

---

## Hierarquia de informação

1. **Breadcrumb** `← Projetos / Site X` — retorno garantido em 1 clique.
2. **Ações da tela:** etiquetas (esquerda) · segmentado Kanban/Lista (centro) · `+ Nova etapa`, `+ Nova tarefa` (direita).
3. **Colunas = etapas** com nome + contador; cards dentro, ordenados por criação (ordenação manual = Could, fora do MVP).
4. **Card:** título > etiquetas > progresso > menu.

## Interações

| Elemento | Ação | Resultado / feedback |
|----------|------|----------------------|
| Card | arrastar e soltar entre colunas | Drop-target com borda; tarefa re-renderiza na nova coluna; persistência imediata; mover para a mesma etapa = no-op |
| Card | clique | Abre drawer de detalhe (WF-04) |
| Coluna `+` | clique | Modal de tarefa já com etapa pré-selecionada |
| `+ Nova etapa` | clique | Modal de etapa (WF-07); coluna é criada no fim |
| `+ Nova tarefa` | clique | Modal de tarefa com seletor de etapa; **desabilitado** (dica "crie uma etapa primeiro") se 0 etapas |
| `#Etiquetas` | clique | Modal de gestão (criar/renomear/excluir) — US-15 |
| `(Kanban\|Lista)` | clique | Alterna para WF-03 preservando filtros/contexto |
| `X` da coluna | clique | Confirmação: **bloqueado se houver tarefas** ("Mova ou esvazie a etapa antes") — regra do PO |
| `⋮` do card | clique | Menu: Editar · Mover para… · Excluir (com confirmação) |

**Regra de integridade:** tarefa nunca fica sem etapa (RN-02); drop inválido revertido visualmente.

## Estados

| Estado | Comportamento |
|--------|---------------|
| Projeto sem etapas | 1 coluna placeholder gigante: "Crie a primeira etapa" + CTA |
| Coluna vazia | `+ Adicionar tarefa` + rótulo "Sem tarefas" em texto sutil |
| Loading | Skeleton de colunas |
| Erro ao salvar | Card volta à posição original + toast de erro |

## Responsividade

| Breakpoint | Adaptação |
|------------|-----------|
| ≥ 1280px | Até 4 colunas visíveis sem scroll |
| 1024–1279px | Scroll horizontal com snap; colunas 300px |
| 768–1023px | Scroll horizontal; toolbar quebra em 2 linhas |
| ≤ 767px | Colunas 85vw com scroll-snap; `+ Nova tarefa` vira FAB; arraste **também** pelo menu `⋮ → Mover para…` (fallback tátil) |

## Acessibilidade

- Drag and drop com alternativa por teclado: foco no card → `Enter` → menu "Mover para etapa…".
- Coluna anuncia "Em Andamento, 2 tarefas, largura de área de soltar".
- `aria-live="polite"` para "Tarefa movida para Em Andamento".
