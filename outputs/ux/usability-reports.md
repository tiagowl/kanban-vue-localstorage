# Relatórios de Usabilidade — Sistema Kanban Local

**Agente:** UX Designer
**Data:** 2026-10-15
**Referências:** `user-research.md` (hipóteses H-01…H-07, jornadas §4) · `wireframes/` · `prototypes/` · US-01…US-23 e CA em `outputs/product-owner/acceptance-criteria.md`
**Escopo:** avaliar a usabilidade dos fluxos do MVP antes da implementação em Vue 3 + Pinia + Tailwind.

---

## 1. Método

| Rodada | Técnica | Participantes | Status nesta entrega |
|--------|---------|---------------|----------------------|
| R1 | Avaliação heurística (Nielsen, 10 heurísticas) sobre wireframes + protótipo | 2 avaliadores UX | **Concluída** (relatório §3) |
| R2 | Teste moderado de usabilidade (pensar em voz alta) sobre o protótipo | 5 participantes (2 Ana / 2 Bruno / 1 Carla) | **Plano detalhado** (§4–§6) — execução na fase de desenvolvimento |
| R2 | Questionário SUS pós-teste | 5 participantes | Pendente de execução |
| R3 | Verificação por teclado e leitor de tela (NVDA) | 1 especialista | **Pré-check** (§7) — validação final na implementação |

**Protótipo avaliado:** `prototypes/index.html` (navegável, persistência em `localStorage`, dados de demonstração com 3 projetos / 15 tarefas / ~25 subtarefas).

**Critério de sucesso global:** SUS ≥ 80 · 0 erros que impeçam conclusão de tarefa nos cenários C-01…C-05.

---

## 2. Hipóteses × Resultado

| ID | Hipótese | Cenário | Resultado R1 (heurística) | Como confirmar em R2 |
|----|----------|---------|---------------------------|----------------------|
| H-01 | Encontrar tarefa global em ≤ 5 s | C-03 | **Aceita** — rotas globais com origem visível e filtro reativo | Cronometrar 3 buscas por participante (mediana ≤ 5 s) |
| H-02 | Criar tarefa em ≤ 3 cliques | C-01 | **Validada** — 2 cliques (botão global) ou 1 ("+" da coluna) | Contagem de cliques por criação |
| H-03 | Global → projeto em 1 clique | C-03/C-04 | **Validada** — linha inteira é alvo clicável | Taxa de sucesso na 1ª tentativa ≥ 90% |
| H-04 | Estados vazios com CTA reduzem abandono | C-00 | **Aceita** — home/projeto/global têm estado vazio + CTA único | Conclusão sem ajuda em conta vazia |
| H-05 | Confirmação evita exclusão acidental | C-05 | **Validada** — modal com consequências explícitas e foco inicial em "Manter" | 0 exclusões acidentais |
| H-06 | Progresso x/y motiva conclusão de subtarefas | C-02 | **Aceita** — barra + contador visível no card e no drawer | Nº de subtarefas concluídas por sessão |
| H-07 | Consistência gera percepção de profissionalismo | — | **Aceita** — componentes reutilizados em kanban/lista/global | SUS ≥ 80 |

---

## 3. Avaliação Heurística (R1) — Achados

**Escala de severidade:** P1 = bloqueia tarefa · P2 = atrito relevante · P3 = melhoria desejável.

### 3.1 Achados priorizados

| ID | Heurística | Tela/Fluxo | Achado | Sev. | Ação de refinamento | Status |
|----|-----------|------------|--------|:----:|---------------------|--------|
| A-01 | Prevenção de erro / Ajuda a recuperar | WF-02 kanban | Excluir etapa **com tarefas** podia levar a perda silenciosa | P1 | Bloqueio com aviso "Mova ou esvazie as tarefas antes de excluir" + contagem de tarefas | Aplicado no protótipo |
| A-02 | Prevenção de erro | WF-04 drawer | `Esc` enquanto editava subtarefa fechava o drawer e descartava a edição | P2 | `Esc` cancela a edição inline; 2º `Esc` fecha o drawer | Corrigido no protótipo |
| A-03 | Controle e liberdade | WF-04 drawer | Após navegar da global, o usuário podia perder o ponto de origem | P1 | Âncora visual (`anchor`) + `scrollIntoView` + destaque de borda por 2,4 s | Aplicado |
| A-04 | Visibilidade do status | WF-01/WF-05 | Usuário não sabia se os dados foram salvos | P2 | Indicador "salvo agora" no header + toast em cada mutação | Aplicado |
| A-05 | Prevenção de erro | WF-07 modais | Botões de rodapé dentro de `<form>` podiam disparar submit implícito e recarregar a página | P1 | `preventDefault` sempre; modais sem formulário tratam submit como no-op | Corrigido no protótipo |
| A-06 | Consistência e padrões | todas | Cards/estados vazios/confirmações repetiam padrões divergentes | P2 | Biblioteca única (card, chip, empty, toast, modal) — ver `design-system.md` | Aplicado |
| A-07 | Reconhecer em vez de lembrar | WF-05/WF-06 | Visões globais não mostravam projeto/etapa de origem | P1 | Chip `origem` (projeto › etapa) sempre visível | Aplicado |
| A-08 | Feedback | todas | Exclusões/movimentações sem confirmação visual | P2 | Toasts (`✓` sucesso / `!` alerta) em toda ação | Aplicado |
| A-09 | Estética e minimalismo | WF-03 lista | Colunas de progresso/etiquetas competiam com o título em telas pequenas | P3 | `lr-prog` oculto em ≤ 767px; conteúdo essencial mantido | Aplicado |
| A-10 | Acessibilidade | global | Foco de teclado dependia de `Tab` sem contenção em drawer/modal | P2 | Focus trap + `:focus-visible` e restauração de foco ao fechar | Aplicado |
| A-11 | Ajuda a usuários a reconhecer/diagnosticar erros | WF-07 | Erros de campo genéricos | P2 | Erro inline por campo + `aria-invalid` + foco no 1º campo inválido | Aplicado |
| A-12 | Ajuda e documentação | todas | Recursos "Could" (busca em subtarefas, ordenação) podiam confundir | P3 | Estado vazio e dicas contextuais deixam a limitação explícita | Aplicado |

### 3.2 Verificação das 10 heurísticas de Nielsen

| # | Heurística | Situação |
|---|-----------|----------|
| 1 | Visibilidade do status do sistema | OK — save status, toasts, contadores, progresso x/y |
| 2 | Correspondência com o mundo real | OK — "A Fazer / Em Andamento / Concluído", metáfora kanban |
| 3 | Controle e liberdade | OK — `Esc`/clique no fundo, desfazer via reabertura, toggle sem perder contexto |
| 4 | Consistência e padrões | OK — design system único |
| 5 | Prevenção de erro | OK — confirmações com consequências, bloqueio de etapa com tarefas, validações |
| 6 | Reconhecer em vez de lembrar | OK — origem e progresso sempre visíveis |
| 7 | Flexibilidade e eficiência | OK — 1 clique global→tarefa, "+" inline, teclado |
| 8 | Estética e minimalismo | OK — cabeçalhos enxutos, ações secundárias em hover/foco |
| 9 | Recuperação de erros | OK — mensagens claras e específicas por campo |
| 10 | Ajuda e documentação | Parcial — micro-copy contextual presente; falta onboarding opcional (P3, não bloqueante) |

---

## 4. Plano de Teste Moderado (R2)

**Objetivo:** validar H-01, H-04, H-06 e H-07 com usuários reais.
**Formato:** sessões de 30–40 min, remotas, moderadas, think-aloud. Sem telemetria; observação e notas.
**Ambiente:** protótipo em `prototypes/index.html` (Chrome desktop ≥ 1280px e 1 sessão mobile 390px).
**Métricas:** tempo por tarefa, nº de cliques, taxa de sucesso, erros, pedidos de ajuda, SUS.

### 4.1 Roteiro por cenário

| Cenário | Persona | Tarefa | Critério de sucesso | Mede |
|---------|---------|--------|---------------------|------|
| C-00 | Ana | Partindo de app vazio, criar o 1º projeto e a 1ª etapa sem ajuda | Conclui sem instrução; entende o CTA | H-04 |
| C-01 | Ana | Criar projeto "Site X", 3 etapas e 1 tarefa com 3 subtarefas | ≤ 3 cliques por criação; subtarefas salvas | H-02 |
| C-02 | Bruno | Mover tarefa entre colunas; concluir 2 subtarefas; recarregar e confirmar persistência | Estado idêntico após reload | H-06 / US-23 |
| C-03 | Carla | Na página "Todas as Tarefas", achar "Escrever homepage" e abrir no projeto | Encontrar em ≤ 5 s; 1 clique até o projeto | H-01 / H-03 |
| C-04 | Bruno | Em "Todas as Subtarefas", abrir uma subtarefa e reconhecer a origem destacada | Identifica projeto/tarefa de origem | H-03 / US-21 |
| C-05 | Ana | Excluir um projeto e uma etapa com tarefas | Confirma consequências; não exclui por engano | H-05 |

### 4.2 Tarefas de acompanhamento (entrevista)

- "O que aconteceu quando você moveu a tarefa?" (feedback percebido)
- "Como você sabe que os dados foram salvos?" (persistência percebida)
- "O que você faria para achar uma tarefa de outro projeto?" (modelo mental)

---

## 5. Métricas e Metas

| Métrica | Meta | Coleta |
|---------|------|--------|
| Taxa de sucesso por cenário | ≥ 90% | Observação |
| Tempo para achar tarefa global (C-03) | mediana ≤ 5 s | Cronômetro |
| Cliques até criar tarefa (C-01) | ≤ 3 | Contagem manual |
| Erros críticos (bloqueiam a tarefa) | 0 | Observação |
| Pedidos de ajuda | ≤ 1 por cenário | Observação |
| SUS (System Usability Scale) | ≥ 80 | Questionário pós-teste |
| Confiança na persistência (escala 1–5) | ≥ 4 | Entrevista |

### 5.1 Questionário SUS (pós-teste)

10 itens padrão, escala 1–5, alternando positivos/negativos; escore final = (soma ajustada) × 2,5. Pontuação ≥ 80 = "excelente"; 68 = média de mercado (referência). Aplicado a todos os participantes imediatamente após os cenários.

---

## 6. Registro de Refinamentos (wireframe → protótipo)

| Origem | Refinamento | Onde |
|--------|-------------|------|
| A-01 | Excluir etapa com tarefas é bloqueado, com mensagem e contagem | `app.js` (`delete-stage`) |
| A-02 | `Esc` cancela edição inline de subtarefa antes de fechar o drawer | `app.js` (listener `keydown`) |
| A-03 | Âncora de origem em tarefa/subtarefa (borda + scroll + fade) | `styles.css` `.anchor` / `app.js` |
| A-04 | Status "salvo agora" no header (com flash) | `index.html` + `app.js` |
| A-05 | Submit de modais sem formulário neutralizado (sem reload) | `app.js` (`openModal`) |
| A-07 | Chip de origem `projeto › etapa` em todas as visões globais | `app.js` (view tarefas) |
| A-10 | Focus trap em drawer/modal; `:focus-visible` global | `app.js` + `styles.css` |
| A-11 | Erro inline por campo com foco automático no 1º inválido | `app.js` (formulários) |

---

## 7. Pré-check de Acessibilidade

| Critério (WCAG 2.1 AA) | Verificação | Resultado |
|------------------------|-------------|-----------|
| Contraste de texto ≥ 4,5:1 | Tokens `--text`/`--muted` sobre `--surface`/`--bg` | OK (`#0F172A` e `#64748B` sobre `#FFFFFF`) |
| Foco visível | `:focus-visible` com outline primário 2px | OK |
| Alvos de toque ≥ 40 px | `.btn`, `.icon-btn`, `.check`, linhas de lista | OK |
| Operação por teclado | Todos os fluxos: `Tab`, `Enter`, `Space`, `Esc` | OK (focus trap em drawer/modal) |
| Nome acessível em ícones | `aria-label` em todos os botões-ícone | OK |
| Regiões dinâmicas | Filtros anunciam resultados; toasts com `role="status"` | OK |
| Estrutura semântica | `header`, `main`, `nav`, listas; `h1`→`h3` | OK |
| Zoom 200% sem perda | Layout fluido, sem larguras fixas críticas | OK |

**Pendência (implementação):** rodar axe-core/Pa11y no app Vue e validar com leitor de tela real (NVDA/VoiceOver).

---

## 8. Conclusões e Riscos

**Conclusões R1:**
- Os 4 fluxos P1 (criação, drawer, visões globais, feedback/confirmações) estão livres de bloqueios após os refinamentos A-01…A-11.
- A hipótese de maior risco é **H-04** (estado vazio em 1ª execução) — mitigada por CTA único e micro-copy específica; **deve** ser confirmada em R2.
- **H-07** (percepção de profissionalismo) depende da execução fiel de `design-system.md` na fase de UI/Vue.

**Riscos residuais:**

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| `localStorage` indisponível/cheio em modo privado | Média | Alto (perda de dados) | Aviso claro + modo degradado (US-23/CA) — validar em R2 |
| Drag-and-drop pouco acessível por teclado | Média | Médio | Alternativa "Mover para…" no menu do card (já prevista) |
| Carga cognitiva em muitos projetos | Baixa | Médio | Visões globais + filtro; considerar agrupamento (Could) |
| Busca em subtarefas ausente no MVP | Baixa | Baixo | Comunicação no estado vazio |

---

## 9. Próximos Passos

1. Executar R2 com 5 participantes e aplicar SUS; registrar métricas em nova versão deste relatório.
2. Reavaliar os achados P2/P3 remanescentes (onboarding opcional — heurística 10).
3. Validar acessibilidade automatizada (axe-core) já na implementação Vue.
4. Transpor o design system para tokens Tailwind (`theme.extend`) — ver `design-system.md`.

**Saída esperada de R2:** matriz de severidade atualizada + decisão go/no-go para o MVP, referenciando US/CA em `outputs/product-owner/`.
