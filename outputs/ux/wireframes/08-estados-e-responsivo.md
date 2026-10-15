# WF-08 — Estados da Interface e Responsividade

**Stories:** US-22 (layout profissional), US-23 (persistência e falhas) · **Objetivo:** garantir estados completos e comportamento consistente de 360px a desktop largo.

---

## 1. Estados globais (aplicam-se a todas as telas)

| Estado | Padrão visual | Regra |
|--------|---------------|-------|
| **Loading** | Skeletons com shimmer (cards/linhas/colunas) | Nunca spinner em tela cheia; layout já reserva o espaço (sem layout shift) |
| **Vazio** | Ícone + título + micro-copy + **1 CTA** | Sempre um único próximo passo; nunca tela vazia "muda" |
| **Erro de carga** | Banner + "Tentar novamente" | Dados anteriores preservados quando possível |
| **Erro de gravação** | Toast + reversão da mutação em memória | Última gravação válida prevalece |
| **Offline/sem backend** | Indicador sutil "salvo localmente ✓" no header | Comunica que persistência é local (sem alarme) |

### Estado vazio — padrão

```
              ┌────────────────────────────┐
              │         [ ilustração ]     │
              │   Nenhuma tarefa aqui      │  ← título claro
              │   Crie tarefas em uma      │  ← micro-copy específica da tela
              │   etapa para começar.      │
              │                           │
              │   [ + Nova tarefa ]        │  ← 1 CTA primário
              └────────────────────────────┘
```

### Falhas de `localStorage` (US-23)

| Falha | Comportamento da UI |
|-------|---------------------|
| Indisponível (modo privado) | Banner persistente: "O navegador bloqueou o armazenamento — nada será salvo entre sessões"; app continua utilizável (**modo degradado, sem crash**) |
| Quota excedida | Toast de erro claro; alteração mantida só em memória; **dados já salvos preservados** |
| Formato corrompido | Recupera para estado vazio **com aviso**; nunca crash; chave `kanban:v1:*` versionada |
| Multi-aba | Última gravação prevalece, sem corrupção |

---

## 2. Shell de navegação responsivo

### Desktop ≥ 1024px

```
┌────────────────────────────────────────────────────────────────┐
│ K Kanban Local   Projetos  Todas as Tarefas  Subtarefas   ⋮   │
└────────────────────────────────────────────────────────────────┘
```

### Tablet 768–1023px

```
┌──────────────────────────────────────────────────────────────┐
│ K Kanban Local        Projetos  Tarefas  Subtarefas          │  ← rótulos reduzidos
└──────────────────────────────────────────────────────────────┘
```

### Mobile ≤ 767px

```
┌────────────────────────────────────────┐
│ K Kanban Local              (menu ☰)   │  ← menu abre painel de navegação
└────────────────────────────────────────┘
...conteúdo...
┌────────────────────────────────────────┐
│   [ ⌂ ]    [ ▤ ]    [ ✓ ]            │  ← alternativa: barra inferior fixa
└────────────────────────────────────────┘
   Projetos  Tarefas  Subtarefas
```

**Decisão de UX:** barra inferior fixa no mobile (alvos ≥ 40px, sempre visível) —Bruno navega com uma mão.

---

## 3. Comportamento responsivo por componente

| Componente | ≤ 767px | 768–1023px | ≥ 1024px |
|------------|---------|------------|-----------|
| Grid de projetos | 1 coluna + FAB `+` | 2 colunas | 3 colunas |
| Kanban | Colunas 85vw com scroll-snap; fallback "Mover para…" | Scroll horizontal, colunas 300px | 3–4 colunas visíveis |
| Lista | Cards empilhados | Oculta coluna "Etiquetas" | Tabela completa |
| Drawer de tarefa | Full-screen com `✕` no header; progresso sticky | 420px lateral | 480px lateral |
| Modais | Bottom sheets (deslizantes) | 560px centralizados | 560px centralizados |
| Filtros/globais | Sticky sob o header; chips roláveis | Inline | Inline |
| Tabelas/globais | Cards empilhados com origem no topo | Colunas reduzidas | Colunas completas |

---

## 4. Regras universais de qualidade (checklist de UI — US-22)

- [x] Contraste mínimo **WCAG 2.1 AA** (4.5:1 texto; 3:1 texto grande e ícones de estado).
- [x] **Foco visível** em todo elemento interativo (anel 2px + offset, cor primária).
- [x] **Alvos de clique ≥ 40×40px** (inclusive em telas menores).
- [x] Hover/active com mudança clara; disabled com contraste reduzido **+ dica** (`title`/tooltip).
- [x] Mensagens de erro em texto próximo ao campo; nunca apenas cor.
- [x] Operação dos 5 fluxos principais **por teclado** (criar tarefa, mover, concluir subtarefa, filtrar, navegar global → projeto).
- [x] Conteúdo longo: clamp de 2 linhas em títulos/descrições + tooltip; sem overflow horizontal (exceto kanban, que é intencional).
- [x] Nenhum conteúdo textual truncado de forma que perca significado.

---

## 5. Matriz de consistência (mesmo padrão em todas as telas)

| Padrão | Onde aparece |
|--------|--------------|
| Card com origem + progresso + chips | Kanban, lista, global de tarefas, global de subtarefas |
| `+` primário no canto superior direito (ou FAB no mobile) | Home, projeto, globais |
| Modal único de CRUD | Todos os cadastros |
| Confirmação destrutiva com consequências | Projeto, etapa, tarefa, subtarefa, etiqueta |
| Toast 4s no canto inferior direito | Toda mutação |
| Estado vazio + 1 CTA | Toda coleção potencialmente vazia |
