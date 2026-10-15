# WF-01 — Home: Lista de Projetos

**Stories:** US-01 (criar), US-03 (excluir), US-04 (listar) · **Persona:** Ana
**Rota:** `/` · **Objetivo:** escolher rapidamente por onde continuar (≤ 2 cliques até o trabalho).

---

## Wireframe (desktop ≥ 1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ K Kanban Local      [Projetos]  Todas as Tarefas  Todas as Subtarefas  ⋮ │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Meus projetos                            [projetos]    [ + Novo projeto ] │
│  ─────────────                                           (primário)       │
│                                                                            │
│  ┌──────────────────────────┐ ┌──────────────────────────┐ ┌────────────┐ │
│  │ Site X                 ✎ X│ │ App Mobile            ✎ X│ │ Estudo    │ │
│  │ Landing page da nova      │ │ Versão 1.0 para clientes │ │ Trilha de  │ │
│  │ campanha de outubro       │ │                          │ │ estudos    │ │
│  │                          │ │                          │ │ (sem descr.)│ │
│  │ 4 etapas · 12 tarefas    │ │ 3 etapas · 8 tarefas     │ │ 2 et · 5 t │ │
│  │ ▓▓▓▓▓▓░░░░░░ 5/12 subt.  │ │ ▓▓▓░░░░░░░ 3/8 subt.     │ │ ▓░░░░ 1/5  │ │
│  │                          │ │                          │ │            │ │
│  │ [ Abrir projeto → ]      │ │ [ Abrir projeto → ]      │ │ [Abrir →]  │ │
│  └──────────────────────────┘ └──────────────────────────┘ └────────────┘ │
│                                                                            │
│  ordenação: mais recente primeiro                                          │
└────────────────────────────────────────────────────────────────────────────┘
```

## Estado vazio (nenhum projeto)

```
│                      ┌─────────────────────────┐                         │
│                      │        [ ícone ]        │                         │
│                      │  Nenhum projeto ainda   │                         │
│                      │  Crie seu primeiro      │                         │
│                      │  projeto para começar.  │                         │
│                      │                         │                         │
│                      │  [ + Criar primeiro     │                         │
│                      │        projeto ]        │                         │
│                      └─────────────────────────┘                         │
```

---

## Hierarquia de informação

1. **Navegação global** (item "Projetos" ativo) — âncora de orientação.
2. **Título + contagem** — confirma escopo ("Meus projetos [3]").
3. **Ação primária** `+ Novo projeto` — canto superior direito, alinhado ao título.
4. **Cards de projeto** — nome (maior) → descrição (2 linhas, clamp) → métricas → progresso → CTA de abertura.
5. **Ações secundárias** `✎ X` — visíveis em hover/foco, nunca competem com o CTA.

## Interações

| Elemento | Ação | Resultado / feedback |
|----------|------|----------------------|
| `+ Novo projeto` | clique | Modal de formulário (WF-07); ao salvar: toast "Projeto criado" + card entra no topo |
| Card / `Abrir projeto` | clique | Navega para `/projetos/:id` (kanban) |
| `✎` | clique | Modal de edição pré-preenchido; salvar reflete em todas as telas (estado Pinia único) |
| `X` | clique | Confirmação (WF-07) com consequências explícitas: etapas, tarefas, subtarefas e etiquetas serão excluídas |
| Card (projeto sem descrição) | — | Layout não quebra: descrição ausente ocupa 0 linhas |

**Validações:** nome obrigatório (erro inline); descrição opcional; nome duplicado permitido com aviso não bloqueante (RN-01).

## Estados

| Estado | Comportamento |
|--------|---------------|
| Loading | 3–4 skeletons com shimmer no lugar dos cards |
| Vazio | CTA ilustrado + "Criar primeiro projeto" (H-04) |
| Erro `localStorage` | Banner no topo: "Não foi possível carregar dados salvos" + ação "Tentar novamente" (US-23) |

## Responsividade

| Breakpoint | Adaptação |
|------------|-----------|
| ≥ 1024px | Grid 3 colunas (2 em 1024–1279 se necessário) |
| 768–1023px | Grid 2 colunas; `+ Novo projeto` mantém rótulo |
| ≤ 767px | 1 coluna; `+ Novo projeto` vira botão circular fixo (FAB) com `aria-label`; ações `✎ X` sempre visíveis (sem hover) |

## Acessibilidade

- Cards são links/botões reais (`<a>`/`<button>`), foco visível com anel 2px.
- Barra de progresso com `role="progressbar"` e `aria-valuenow/min/max`.
- Leitores de tela anunciam "Site X, 4 etapas, 12 tarefas, 5 de 12 subtarefas concluídas".
