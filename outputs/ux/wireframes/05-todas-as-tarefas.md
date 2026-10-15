# WF-05 — Página "Todas as Tarefas" (Visão Global)

**Stories:** US-17 (consolidado), US-18 (filtro), US-19 (navegação → projeto)
**Rota:** `/tarefas` · **Persona:** Ana (visão única) e Carla (busca) · **Objetivo:** ver o trabalho total e chegar a qualquer tarefa em 1 clique.

---

## Wireframe (desktop ≥ 1024px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ K Kanban Local      Projetos  [Todas as Tarefas]  Todas as Subtarefas  ⋮ │
├────────────────────────────────────────────────────────────────────────────┤
│ Todas as tarefas                                              10 tarefas  │
│ ┌──────────────────────────────────────────────┐  pendentes 7 · feitas 3  │
│ │ ⌕  Filtrar por nome…                     ✕ │                          │
│ └──────────────────────────────────────────────┘  (debounce 200ms)        │
│                                                                           │
│ ORIGEM                          (filtro ativo: "home" — limpar ✕)         │
│ ┌────────────────────────────────────────────────────────────────────┐    │
│ │ Site X › A Fazer     ▓▓▓░ 2/5     [urgente]                        │    │
│ │ ✗  Escrever homepage                                            → │    │
│ ├────────────────────────────────────────────────────────────────────┤    │
│ │ Site X › Em Andamento  ▓░░ 1/3     [cliente A]                     │    │
│ │ ✗  Ajustar hero da homepage                                       → │    │
│ ├────────────────────────────────────────────────────────────────────┤    │
│ │ App Mobile › A Fazer   0 subt.     —                                │    │
│ │ ✗  Revisar homepage mobile                                        → │    │
│ └────────────────────────────────────────────────────────────────────┘    │
│  ↑ cada linha identifica sempre: projeto › etapa, progresso, etiquetas     │
└────────────────────────────────────────────────────────────────────────────┘
```

### Filtro sem resultados

```
│  ⌕  "xyz"                                         ✕ Limpar filtro        │
│                      ┌───────────────────────┐                            │
│                      │  Nenhuma tarefa       │                            │
│                      │  encontrada para      │                            │
│                      │  "xyz".               │                            │
│                      │  [ Limpar filtro ]    │                            │
│                      └───────────────────────┘                            │
```

---

## Hierarquia de informação

1. **Título + contagem total** — escopo do consolidado.
2. **Campo de filtro** — primeiro controle interativo da tela (Carla chega aqui).
3. **Resumo de resultados** ("7 de 10 tarefas") — confirma que o filtro só altera exibição (não os dados).
4. **Linhas agrupadas visualmente por origem:** `projeto › etapa` à esquerda (coluna fixa) → tarefa → progresso → etiquetas → indicador de navegação `→`.

## Interações

| Elemento | Ação | Resultado / feedback |
|----------|------|----------------------|
| `Filtrar por nome` | digitação (debounce 200ms) | Filtra **case-insensitive, contém** (RN-05); atualiza contagem; **nunca altera dados** |
| `✕` / `Limpar filtro` | clique | Restaura lista completa |
| Linha da tarefa | clique (1 clique) | Navega: `/projetos/:id?tarefa=:id` → drawer aberto com foco (US-19) |
| `→` | hover/foco | Efeito de avanço; a linha inteira é clicável (alvo grande) |
| Checkbox `✗` | clique | Conclui/desconclui sem sair da tela |
| Ordenação padrão | — | Mais recentes primeiro; sem duplicatas; origem sempre identificável |

**Casos extremos:** tarefa excluída em outra aba → mensagem "tarefa não encontrada" + retorno; projeto inexistente → erro amigável com retorno.

## Estados

| Estado | Comportamento |
|--------|---------------|
| Nenhuma tarefa no sistema | Estado vazio: "Tudo em dia — crie tarefas em seus projetos" + CTA "Ir para Projetos" |
| Filtro sem resultados | Mensagem com o termo buscado + ação limpar |
| Loading | Skeleton de 6 linhas |
| Muitas tarefas | Scroll performático (linhas leves, sem imagens) |

## Responsividade

| Breakpoint | Adaptação |
|------------|-----------|
| ≥ 1024px | Tabela/lista com colunas alinhadas |
| 768–1023px | Progresso compacto (só contador) |
| ≤ 767px | Cards empilhados: topo `projeto › etapa`, título grande, chips e progresso na linha de baixo; filtro sticky sob o header; alvo ≥ 40px |

## Acessibilidade

- Campo com `<label>` visível ("Filtrar por nome") e `type="search"`.
- Resultados anunciados: `aria-live="polite"` → "3 tarefas encontradas".
- Linhas são `<a>`/`<button>` reais (não `<div onclick>`); foco visível; leitor anuncia origem + título + progresso.
- Filtro operável por teclado: `Enter` aplica imediatamente, `Esc` limpa.
