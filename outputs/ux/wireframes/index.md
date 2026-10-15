# Wireframes — Sistema Kanban Local

**Agente:** UX Designer
**Data:** 2026-10-15
**Fidelidade:** Baixa/média (low-fi anotado) · referência para `prototypes/` e para a UI Designer
**Insumo:** `user-research.md` + `outputs/product-owner/*.md`

---

## 1. Mapa de Navegação (sitemap)

```
App (shell fixo: header + navegação global)
│
├── / .......................... Home: lista de projetos [WF-01]
│     ├── [Novo projeto] → modal de projeto
│     └── [Abrir card] → /projetos/:id
│
├── /projetos/:id ............. Projeto [WF-02 kanban | WF-03 lista]
│     ├── [Nova etapa] → modal de etapa
│     ├── [Nova tarefa] → modal de tarefa (ou "+" na coluna)
│     ├── [Etiquetas] → modal de gestão de etiquetas
│     ├── toggle Kanban ↔ Lista (contexto preservado)
│     └── [card] → drawer de detalhe da tarefa [WF-04]
│           ├── subtarefas (toggle x/y)
│           ├── [mover etapa] [editar] [excluir → confirmação]
│           └── etiquetas (seletor escopado ao projeto)
│
├── /tarefas ................. Todas as Tarefas [WF-05]
│     ├── [busca por nome] (debounce, case-insensitive)
│     └── [card] → /projetos/:id?tarefa=:id (foco na tarefa) [WF-04]
│
└── /subtarefas .............. Todas as Subtarefas [WF-06]
      ├── [busca por nome]
      └── [item] → /projetos/:id?tarefa=:id#sub-:id (foco + âncora) [WF-04]
```

### Fluxo principal (cliques até a ação)

| Fluxo | Cliques | Referência |
|-------|--------:|------------|
| Home → criar projeto → criar etapa | 3 | WF-01, WF-02 |
| Projeto → criar tarefa | 2 (botão global) ou 1 (`+` da coluna) | WF-02 |
| Tarefa → concluir subtarefa | 2 (abrir card → toggle) | WF-04 |
| Global → tarefa no projeto | 1 | WF-05 |
| Global subtarefas → subtarefa na origem | 1 | WF-06 |
| Alternar Kanban ↔ Lista | 1 (contexto preservado) | WF-02/03 |

---

## 2. Índice dos Wireframes

| ID | Arquivo | Tela | Stories |
|----|---------|------|---------|
| WF-01 | `01-home-projetos.md` | Home / lista de projetos | US-01, US-03, US-04 |
| WF-02 | `02-projeto-kanban.md` | Projeto — visão Kanban | US-05, US-06, US-07, US-10, US-15, US-16 |
| WF-03 | `03-projeto-lista.md` | Projeto — visão Lista | US-11, US-08 |
| WF-04 | `04-detalhe-tarefa.md` | Drawer de detalhe da tarefa | US-08, US-12, US-13, US-14, US-16 |
| WF-05 | `05-todas-as-tarefas.md` | Global de tarefas + filtro | US-17, US-18, US-19 |
| WF-06 | `06-todas-as-subtarefas.md` | Global de subtarefas | US-20, US-21 |
| WF-07 | `07-formularios-e-modais.md` | Formulários, confirmações e toasts | US-01/02/03/05/09, RN validação |
| WF-08 | `08-estados-e-responsivo.md` | Estados vazios/erro/loading + responsividade | US-22, US-23 |

---

## 3. Convenções dos Wireframes

- **Header/global:** sempre presente; itens ativos com sublinhado/destaque.
- **Glifos (ASCII/simbólicos, sem emoji):** `+` criar · `✎` editar · `X` excluir (sempre com confirmação — WF-07) · `⌕` buscar · `K` marca · `⌂` Projetos · `▤` Tarefas · `✓` subtarefa/concluído · `✗` pendente · `!` alerta/aviso · `→` navegar/avançar · `←` voltar · `✕` fechar.
- **`[ + ]`** ação primária contextual (criar); ações secundárias (`✎`/`X`) visíveis em hover/foco.
- **Origem visível:** nas visões globais, todo card exibe `projeto › etapa`.
- **Estados:** todo container prevê `vazio`, `erro` e `loading` (WF-08).
- **Alvos de clique:** mín. 40×40 px; foco de teclado visível em todos os elementos interativos.
- **Breakpoints:** desktop ≥ 1024px (referência dos desenhos), tablet 768–1023px, mobile ≤ 767px (ver WF-08).

---

## 4. Hierarquia de Informação (ordem de leitura global)

```
1. Navegação global (onde estou / para onde vou)
2. Ação primária da tela (criar/alternar/buscar)
3. Conteúdo (cards/colunas/listas — sempre com origem e progresso)
4. Ações secundárias (editar/excluir — hover/foco)
5. Feedback transiente (toast, erros de campo)
```
