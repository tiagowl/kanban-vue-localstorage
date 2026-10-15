# Design System — Sistema Kanban Local

**Agente:** UX Designer
**Data:** 2026-10-15
**Referências:** `wireframes/` · `prototypes/styles.css` (implementação de referência) · `usability-reports.md`
**Objetivo:** especificar tokens, componentes e regras visuais para implementação fiel em **Vue 3 + Pinia + Tailwind CSS**.

---

## 1. Princípios

1. **Clareza acima de ornamento** — hierarquia por peso, cor e espaçamento; nada decorativo compete com a ação.
2. **Consistência** — um único conjunto de componentes reutilizado em kanban, lista e visões globais.
3. **Feedback em 3 camadas** — imediato (estado do botão) → curto (toast) → persistente (estado do item).
4. **Acessibilidade por padrão** — contraste AA, foco visível, alvos ≥ 40px, operável por teclado.
5. **Densidade responsiva** — de 360px a 1280px+ sem perda de função.

---

## 2. Tokens

### 2.1 Cores base

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg` | `#F8FAFC` | Fundo da aplicação |
| `--surface` | `#FFFFFF` | Cards, modais, drawer |
| `--surface-2` | `#F1F5F9` | Colunas, cabeçalhos de grupo, hovers |
| `--border` | `#E2E8F0` | Bordas e divisores |
| `--text` | `#0F172A` | Texto principal |
| `--muted` | `#64748B` | Texto secundário (contraste AA sobre `--surface`) |
| `--muted-2` | `#94A3B8` | Ícones decorativos, placeholders, dicas |

### 2.2 Cores semânticas

| Token | Hex | Soft | Uso |
|-------|-----|------|-----|
| `--primary` | `#4F46E5` | `#EEF2FF` (`--primary-soft`) | Ações primárias, foco, seleção |
| `--primary-hover` | `#4338CA` | — | Hover de ações primárias |
| `--primary-ink` | `#3730A3` | — | Texto sobre `--primary-soft` |
| `--success` | `#059669` | `#D1FAE5` | Concluído, toasts de sucesso, checkbox marcado |
| `--danger` | `#E11D48` | `#FFE4E6` | Ações destrutivas, erros de validação |
| `--warning` | `#D97706` | `#FEF3C7` | Avisos, `localStorage` cheio/indisponível |

**Gradiente de marca/realce:** `linear-gradient(135deg, #4F46E5, #7C3AED)` (marca e barras de progresso).

### 2.3 Paleta de etiquetas (8 cores)

Cada cor define `bg` (fundo do chip), `fg` (texto) e `dot` (marcador). Contraste `fg`/`bg` ≥ 4,5:1.

| Chave | bg | fg | dot |
|-------|-----|-----|-----|
| `rose` | `#FFE4E6` | `#BE123C` | `#F43F5E` |
| `orange` | `#FFEDD5` | `#C2410C` | `#F97316` |
| `amber` | `#FEF3C7` | `#B45309` | `#F59E0B` |
| `emerald` | `#D1FAE5` | `#047857` | `#10B981` |
| `teal` | `#CCFBF1` | `#0F766E` | `#14B8A6` |
| `sky` | `#E0F2FE` | `#0369A1` | `#0EA5E9` |
| `violet` | `#EDE9FE` | `#6D28D9` | `#8B5CF6` |
| `purple` | `#F3E8FF` | `#7E22CE` | `#A855F7` |

### 2.4 Tipografia

| Item | Valor |
|------|-------|
| Família | `Inter`, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif |
| Base | 14px / linha 1.5 |
| `h1` (título de página) | 24px, peso 700, `letter-spacing: -.02em` |
| `h2` (modal) | 18px, peso 700 |
| `h3` (estado vazio) | 17px |
| Título de card | 16px, peso 700 |
| Texto de card / corpo | 13,5px |
| Secundário / labels | 12–12,5px, peso 500–600 |
| Labels de seção | 11,5px, peso 700, uppercase, `letter-spacing: .06em` |
| Números (progresso/contadores) | `font-variant-numeric: tabular-nums` |

### 2.5 Espaçamento (escala base 4px)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48` → gap padrão de cards **16px**; padding de card **20px**; padding de página **24px 20px**.

### 2.6 Raios

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-card` | 14px | Cards, colunas, modais (16px), grupos |
| `--radius` | 10px | Listas, avisos |
| `--radius-sm` | 8px | Botões, inputs, nav |
| pílula | 999px | Chips, badges, origem, contadores |

### 2.7 Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow` | `0 1px 2px rgba(15,23,42,.05), 0 8px 24px -12px rgba(15,23,42,.15)` | Cards e busca |
| `--shadow-lg` | `0 24px 48px -16px rgba(15,23,42,.25)` | Drawer, modal, toast |

### 2.8 Movimento

| Interação | Duração | Easing |
|-----------|---------|--------|
| Hover / cor | 150ms | ease |
| Drawer (slide-in) | 250ms | `cubic-bezier(.32,.72,0,1)` |
| Modal / backdrop | 150–200ms | ease |
| Toast (entrada) | 200ms | ease (slide-up 8px) |
| Barra de progresso | 300ms | ease |
| Destaque de âncora | fade 2400ms | ease |

**Reduzir movimento:** respeitar `@media (prefers-reduced-motion: reduce)` desabilitando transform/slide.

---

## 3. Componentes

### 3.1 Botões

| Variante | Aparência | Uso |
|----------|-----------|-----|
| Primário (`btn-primary`) | Fundo `--primary`, texto branco | Ação principal da tela (Salvar, + Novo) |
| Secundário (`btn`) | Fundo `--surface`, borda `--border` | Ações neutras (Cancelar) |
| Perigo (`btn-danger`) | Fundo `--danger`, texto branco | Confirmação destrutiva |
| Fantasma (`btn-ghost`) | Transparente, texto `--muted` | Ações terciárias |
| Ícone (`icon-btn`) | 40×40, transparente | Editar, excluir, fechar, menu |
| Pequeno (`btn-sm`) | Altura 34px | Dentro de cards/listas |

**Tamanhos:** padrão 40px · pequeno 34px. **Estados:** default · hover · active (`translateY(1px)`) · focado (`:focus-visible`) · disabled (`opacity .5`, `not-allowed`).

### 3.2 Card de projeto

Estrutura: nome (botão que abre) → descrição (2 linhas, clamp) → métricas (`N etapas · N tarefas`) → barra de progresso + `x/y concluídas` → rodapé com "Abrir projeto" e ações secundárias (editar/excluir em hover/foco).

### 3.3 Card de tarefa (kanban)

Estrutura: checkbox de conclusão + título (até 3 linhas) → chips de etiqueta → progresso x/y + barra → menu rápido. Estados: default · hover (borda `#C7D2FE`) · dragging (`opacity .45`, `rotate 1.5deg`) · done (`line-through` + `--muted`) · **anchor** (borda primária + glow 3px).

### 3.4 Coluna kanban

Cabeçalho (nome uppercase + contador) · corpo rolável com `drop-hover` (borda primária + fundo 6% primário) · estado vazio tracejado · botão "+ Nova tarefa" em linha tracejada. Largura 300px (280px em tablet, 85vw em mobile com `scroll-snap`).

### 3.5 Linha de lista / grupo

Grupo por etapa (cabeçalho `--surface-2` colapsável) + linhas com: checkbox · título · etiquetas · progresso · menu. Linha inteira clicável; hover com barra primária à esquerda (3px). Em ≤ 767px, o progresso é oculto.

### 3.6 Linha global (tarefas)

`origem` (chip `projeto › etapa`) · checkbox · título · etiquetas · progresso · seta `→`. Hover com `translateX(2px)`. Alvo de clique = linha inteira (1 clique até o projeto).

### 3.7 Drawer de tarefa

Painel lateral fixo (480px; 100vw em mobile). Cabeçalho com origem + fechar. Corpo: título inline · descrição · etiquetas (seletor escopado ao projeto) · seletor "Mover para…" · subtarefas (checkbox + edição inline + excluir) · input "+ Adicionar subtarefa". Rodapé com "Excluir tarefa".

### 3.8 Modal

Backdrop `rgba(15,23,42,.5)`; modal 560px (bottom-sheet em mobile). Cabeçalho (título + subtítulo + `X`) · corpo (campos) · rodapé (Cancelar + ação primária). Confirmações: título interrogativo, lista de consequências, destaque de aviso, foco inicial em **Manter**.

### 3.9 Campos e validação

Inputs/textarea/select com altura ≥ 40px, borda `--border`, foco primário com glow `0 0 0 3px rgba(79,70,229,.15)`. Erro: borda `--danger` + glow + mensagem inline (`role="alert"`) + `aria-invalid`. Campo obrigatório marcado com `*` em `--danger`.

### 3.10 Chips de etiqueta

Pílula `bg`/`fg` da paleta; opcional `x` de remoção; variante `chip-add` tracejada para adicionar.

### 3.11 Checkbox

20px (24px na variante `big`), raio 6px; marcado = fundo `--success` com check branco; foco visível.

### 3.12 Toast

Card com barra lateral de status (sucesso `--success` / alerta `--warning` / erro `--danger`), ícone textual, mensagem. Posição fixa inferior-direita (mobile: acima da barra inferior). `role="status"`, auto-dismiss.

### 3.13 Estado vazio

Bloco tracejado centralizado: ícone (soft primário) · título · micro-copy específica · 1 CTA. Variantes `compact` e `tiny` para colunas/grupos.

### 3.14 Navegação

Topbar fixa (marca + nav + status "salvo agora"). Item ativo com fundo `--primary-soft`. Em ≤ 767px, a nav migra para **barra inferior fixa** (Projetos · Tarefas · Subtarefas).

---

## 4. Acessibilidade

- Contraste AA: `--text` e `--muted` sobre `--surface`/`--bg` ≥ 4,5:1.
- `:focus-visible`: outline 2px `--primary`, offset 2px, em todo elemento interativo.
- Alvos de toque ≥ 40×40px (botões-ícone, checkbox, linhas).
- Teclado: `Tab`/`Shift+Tab` (com focus trap em drawer/modal), `Enter`/`Space` ativam, `Esc` fecha/cancela; `Esc` na edição inline cancela só a edição.
- Semântica: `header`/`main`/`nav`, listas, botões reais; ícones decorativos com `aria-hidden="true"`; botões-ícone com `aria-label`.
- Regiões dinâmicas: filtros anunciam contagem (`aria-live="polite"`); toasts com `role="status"`.
- Restaurar foco ao elemento de origem ao fechar drawer/modal.

---

## 5. Responsividade

| Faixa | Largura | Regras-chave |
|-------|--------:|--------------|
| Desktop | ≥ 1024px | Grid de projetos multicoluna; kanban com scroll horizontal; drawer 480px |
| Tablet | 768–1023px | Colunas 280px; chip de origem truncado (150px) |
| Mobile | ≤ 767px | Nav inferior; grid 1 coluna; colunas 85vw com scroll-snap; drawer full-screen; modal bottom-sheet; ações full-width; toasts acima da nav; progresso de lista oculto |

---

## 6. Mapeamento Vue 3 + Tailwind

### 6.1 Tokens em `tailwind.config.js`

```js
theme: {
  extend: {
    colors: {
      bg: '#F8FAFC', surface: '#FFFFFF', 'surface-2': '#F1F5F9', border: '#E2E8F0',
      text: '#0F172A', muted: '#64748B', 'muted-2': '#94A3B8',
      primary: { DEFAULT: '#4F46E5', hover: '#4338CA', soft: '#EEF2FF', ink: '#3730A3' },
      success: { DEFAULT: '#059669', soft: '#D1FAE5' },
      danger:  { DEFAULT: '#E11D48', soft: '#FFE4E6' },
      warning: { DEFAULT: '#D97706', soft: '#FEF3C7' },
    },
    borderRadius: { card: '14px', DEFAULT: '10px', sm: '8px' },
    boxShadow: {
      DEFAULT: '0 1px 2px rgba(15,23,42,.05), 0 8px 24px -12px rgba(15,23,42,.15)',
      lg: '0 24px 48px -16px rgba(15,23,42,.25)',
    },
    fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
  }
}
```

### 6.2 Componentes Vue sugeridos

| Componente | Responsabilidade |
|------------|------------------|
| `AppShell.vue` | Topbar, nav inferior, container, status de salvamento |
| `ProjectCard.vue` | Card de projeto (métricas + ações) |
| `KanbanBoard.vue` / `KanbanColumn.vue` | Colunas + drop targets |
| `TaskCard.vue` | Card de tarefa (kanban) |
| `TaskListRow.vue` / `TaskGroup.vue` | Visão lista por etapa |
| `GlobalTaskRow.vue` | Linha das visões globais (com `origem`) |
| `TaskDrawer.vue` | Drawer de detalhe + subtarefas |
| `SubtaskItem.vue` | Checkbox + edição inline + excluir |
| `BaseModal.vue` / `ConfirmDialog.vue` | Modal padrão e confirmação destrutiva |
| `BaseButton.vue` / `IconButton.vue` | Botões e botões-ícone |
| `LabelChip.vue` / `LabelPicker.vue` | Chip de etiqueta e seletor escopado |
| `BaseInput.vue` / `FieldError.vue` | Campos e erros inline |
| `ProgressBar.vue` / `EmptyState.vue` / `AppToast.vue` | Progresso, vazio, feedback |
| `SegmentedControl.vue` | Toggle Kanban ↔ Lista |

### 6.3 Pinia (estado)

- Stores: `projetos`, `etapas`, `tarefas`, `subtarefas`, `etiquetas`, `ui` (drawer/modal/toast).
- Persistência: plugin que serializa em `localStorage` (chave de produção própria, ex.: `kanban:v1`) com tratamento de quota/indisponibilidade.
- Regras de negócio: exclusão em cascata confirmada; desvincular etiqueta não apaga tarefas (RN-04); bloqueio de exclusão de etapa com tarefas.

---

## 7. Uso e Governança

- **Fonte da verdade:** este documento + `prototypes/styles.css` como implementação de referência.
- **Mudança de token:** atualizar tabela §2 e `styles.css`/`tailwind.config.js` no mesmo commit.
- **Checklist antes de mesclar UI:** contraste AA · foco visível · alvo ≥ 40px · estados (hover/foco/disabled/vazio/erro) · responsivo 360/768/1024/1280 · sem emoji como ícone funcional (usar glifos tipográficos ou SVG com `aria-label`).

---

## 8. Inventário de entrega (UX)

| Artefato | Caminho |
|----------|---------|
| Pesquisa de usuário | `outputs/ux/user-research.md` |
| Wireframes | `outputs/ux/wireframes/` (index + WF-01…WF-08) |
| Protótipo navegável | `outputs/ux/prototypes/` (`index.html`, `styles.css`, `app.js`) |
| Relatórios de usabilidade | `outputs/ux/usability-reports.md` |
| Design system | `outputs/ux/design-system.md` |
