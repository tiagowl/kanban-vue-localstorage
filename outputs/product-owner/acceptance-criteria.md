# Critérios de Aceitação — Sistema Kanban Local

**Agente:** Product Owner
**Data:** 2026-10-15
**Estrutura por story:** Cenários de sucesso · Casos extremos · Validações necessárias
**Convenção:** ✅ Dado/Quando/Então

---

## Épico 1 — Gestão de Projetos

### US-01 Criar projeto
**Cenários de sucesso**
- ✅ Dado nome válido "Site X", quando confirmo a criação, então o projeto aparece na lista inicial e fica disponível no `localStorage`.
- ✅ Dado projeto criado, quando recarrego a página, então ele continua presente.

**Casos extremos**
- Nome vazio ou só espaços → criação bloqueada.
- Nome duplicado → permitido (não há restrição), mas aviso opcional exibido.
- `localStorage` cheio → mensagem de erro clara, sem perda dos dados já salvos.

**Validações**
- Campo nome obrigatório, com indicação visual de erro.
- Descrição realmente opcional (aceita vazio).
- Feedback visível de sucesso (toast/estado).

### US-02 Editar projeto
**Cenários de sucesso**
- ✅ Dado projeto "Site X", quando renomeio para "Site Y", então todas as etapas, tarefas e etiquetas permanecem vinculadas.

**Casos extremos**
- Esvaziar o nome → edição bloqueada.
- Editar em outra aba simultaneamente → última gravação prevalece (sem corrupção).

**Validações**
- Mesmas validações do formulário de criação.
- Alterações refletidas imediatamente em todas as telas (estado Pinia único).

### US-03 Excluir projeto
**Cenários de sucesso**
- ✅ Dado projeto selecionado, quando confirmo a exclusão, então projeto, etapas, tarefas, subtarefas e etiquetas são removidos e o `localStorage` é atualizado.

**Casos extremos**
- Cancelar na confirmação → nada é alterado.
- Excluir o único projeto → tela exibe estado vazio com CTA de criação.
- Falha ao gravar → operação revertida/mensagem de erro.

**Validações**
- Confirmação obrigatória antes de destruir dados.
- Verificação pós-exclusão: nenhum registro órfão persiste.

### US-04 Listar projetos
**Cenários de sucesso**
- ✅ Com 3 projetos, vejo os 3 na tela inicial com nome, descrição (quando houver) e indicadores resumidos.

**Casos extremos**
- Nenhum projeto → estado vazio amigável.
- Projeto sem descrição → layout não quebra.

**Validações**
- Ordenação estável (ex.: mais recente primeiro).
- Todo card tem ações acessíveis (abrir, editar, excluir).

## Épico 2 — Gestão de Etapas

### US-05 Criar etapa
**Cenários de sucesso**
- ✅ No projeto "Site X", crio a etapa "Em Andamento" e ela aparece como coluna na visão kanban.

**Casos extremos**
- Nome vazio → bloqueado.
- Criar etapa em projeto sem nenhuma etapa → kanban exibe estado vazio com CTA.

**Validações**
- Etapa sempre vinculada ao projeto corretamente (nunca órfã).
- Nome obrigatório.

### US-06 Editar/excluir etapa
**Cenários de sucesso**
- ✅ Renomeio etapa → coluna atualizada mantendo as tarefas.
- ✅ Excluo etapa vazia → coluna removida.

**Casos extremos**
- Excluir etapa **com tarefas** → diálogo avisa que as tarefas serão excluídas **ou** movidas (regra definida: **bloquear exclusão com tarefas, exigindo esvaziar ou mover antes**).
- Última etapa removida → kanban exibe CTA "criar etapa".

**Validações**
- Confirmação obrigatória na exclusão.
- Integridade pai-filho preservada.

## Épico 3 — Gestão de Tarefas

### US-07 Criar tarefa
**Cenários de sucesso**
- ✅ Crio tarefa "Escrever homepage" na etapa "A Fazer" → aparece no kanban e na lista.

**Casos extremos**
- Projeto sem etapas → botão de nova tarefa desabilitado com orientação.
- Título vazio → bloqueado.

**Validações**
- Tarefa sempre vinculada a uma etapa válida existente.
- Título obrigatório; demais campos conforme modelo definido.

### US-08 Editar tarefa
**Cenários de sucesso**
- ✅ Edito o título → refletido na visão kanban, lista e visões globais.

**Casos extremos**
- Esvaziar título → bloqueado.
- Tarefa já movida de etapa em outra aba → edição salva sem reverter a posição (última gravação prevalece).

**Validações**
- Estado Pinia como fonte única; persistência após cada mutação relevante.

### US-09 Excluir tarefa
**Cenários de sucesso**
- ✅ Confirmo exclusão → tarefa e suas subtarefas somem de todas as telas e do `localStorage`.

**Casos extremos**
- Cancelar → nada muda.
- Excluir tarefa referenciada na visão global aberta → lista se atualiza sem erro.

**Validações**
- Confirmação obrigatória; sem registros órfãos de subtarefas.

### US-10 Mover tarefa entre etapas (Kanban)
**Cenários de sucesso**
- ✅ Arrasto "Escrever homepage" de "A Fazer" para "Em Andamento" → posição salva e mantida após reload.

**Casos extremos**
- Mover para a mesma etapa → no-op.
- Movimento interrompido/rejeitado → estado visual revertido.
- Mover a última tarefa de uma coluna → coluna vazia exibe estado vazio.

**Validações**
- Tarefa nunca pode parar sem etapa.
- Persistência imediata da nova etapa da tarefa.

### US-11 Visualizar em modo lista
**Cenários de sucesso**
- ✅ Alterno Kanban ↔ Lista → mesmos dados, sem perda de filtros/estado.

**Casos extremos**
- Muitas tarefas → lista com scroll performático (renderização eficiente).
- Sem tarefas → estado vazio.

**Validações**
- Alternância preserva o contexto (projeto, filtros).
- Ambas as visões refletem mudanças em tempo real.

## Épico 4 — Gestão de Subtarefas

### US-12 Criar subtarefa
**Cenários de sucesso**
- ✅ Na tarefa "Escrever homepage", crio "Definir copy" → aparece na listagem da tarefa.

**Casos extremos**
- Texto vazio → bloqueado.
- Muitas subtarefas → listagem legível.

**Validações**
- Subtarefa sempre vinculada a uma tarefa existente.
- Estado inicial: não concluída.

### US-13 Marcar subtarefa como feita
**Cenários de sucesso**
- ✅ Marco "Definir copy" → visual marcada (check/riscado) e flag persistida; desmarcar reverte.

**Casos extremos**
- Clique rápido múltiplas vezes → estado consistente (sem duplicação).
- Reload após marcar → marcação mantida.

**Validações**
- Toggle binário persistido no `localStorage`.
- Indicador de progresso (x/y concluídas) atualizado, quando exibido.

### US-14 Editar/excluir subtarefa
**Cenários de sucesso**
- ✅ Renomeio ou excluo a subtarefa → refletido na tarefa e nas visões globais.

**Casos extremos**
- Excluir última subtarefa → tarefa permanece válida.
- Texto vazio na edição → bloqueado.

**Validações**
- Confirmação na exclusão; sincronização com a página global de subtarefas.

## Épico 5 — Etiquetas

### US-15 Criar/gerenciar etiquetas do projeto
**Cenários de sucesso**
- ✅ Crio "urgente" (cor/nome) no projeto "Site X" → disponível para vincular às tarefas do projeto.

**Casos extremos**
- Nome vazio ou duplicado no mesmo projeto → bloqueado/aviso.
- Excluir etiqueta usada por tarefas → desvinculada de todas sem apagar as tarefas.

**Validações**
- Etiquetas nunca aparecem em tarefas de outro projeto.
- Confirmação na exclusão.

### US-16 Vincular várias etiquetas a várias tarefas
**Cenários de sucesso**
- ✅ Vinculo "urgente" e "cliente A" à tarefa T1; "urgente" à T2 → exibidas corretamente nos cards.

**Casos extremos**
- Vincular a tarefa de outro projeto → impossibilitado pela UI (regra de escopo).
- Remover etiqueta do projeto → tarefas afetadas atualizadas sem erro.

**Validações**
- Relação N↔N restrita ao mesmo projeto.
- Alterações refletidas no kanban, lista e visões globais.

## Épico 6 — Visões Globais

### US-17 Visualizar todas as tarefas
**Cenários de sucesso**
- ✅ Com 3 projetos e 10 tarefas, a página lista as 10 com identificação do projeto de origem.

**Casos extremos**
- Nenhuma tarefa → estado vazio.
- Muitas tarefas → renderização performática.

**Validações**
- Sem duplicatas; ordenação estável; origem (projeto/etapa) sempre identificável.

### US-18 Filtrar tarefas por nome
**Cenários de sucesso**
- ✅ Digito "home" → apenas tarefas cujo nome contém "home" (case-insensitive).

**Casos extremos**
- Filtro sem resultados → mensagem "nenhuma tarefa encontrada" + limpar filtro.
- Limpar filtro → lista completa restaurada.

**Validações**
- Filtro não altera os dados, apenas a exibição.
- Reativa a digitação (debounce recomendado).

### US-19 Navegar da tarefa global → projeto
**Cenários de sucesso**
- ✅ Clico na tarefa "Escrever homepage" → abro a página do projeto "Site X" com essa tarefa em foco (detalhe/selecionada).

**Casos extremos**
- Tarefa excluída em outra aba → mensagem "tarefa não encontrada" + retorno à visão global.
- Projeto da tarefa inexistente → tratamento de erro amigável.

**Validações**
- Navegação preserva o estado do sistema e usa rota com projeto + tarefa (ex.: `/projetos/:idProjeto?tarefa=:idTarefa`).
- Um clique basta; sem passos intermediários.

### US-20 Visualizar todas as subtarefas
**Cenários de sucesso**
- ✅ A página lista subtarefas de todos os projetos, indicando projeto, tarefa de origem e status.

**Casos extremos**
- Tarefa sem subtarefas → não gera entradas vazias.
- Nenhuma subtarefa no sistema → estado vazio.

**Validações**
- Sincronização em tempo real com criações/exclusões.

### US-21 Navegar da subtarefa global → tarefa no projeto
**Cenários de sucesso**
- ✅ Clico na subtarefa "Definir copy" → abro o projeto "Site X" com a tarefa "Escrever homepage" em foco e a subtarefa visível.

**Casos extremos**
- Tarefa/projeto de origem removido → mensagem de erro amigável + retorno.
- Dados corrompidos no `localStorage` → fallback para estado vazio com aviso.

**Validações**
- Navegação em 1 clique; âncora na tarefa de origem garantida.

## Épico 7 — Experiência e Qualidade

### US-22 Layout profissional e consistente
**Cenários de sucesso**
- ✅ Todas as telas seguem o mesmo design system (cores, tipografia, espaçamento, componentes) e funcionam em desktop e telas menores.

**Casos extremos**
- Conteúdo longo → sem overflow quebrado.
- Estados vazios, de carregamento e de erro sempre definidos.

**Validações**
- Checklist de UI: contraste, foco visível, alvo de clique ≥ 40px, feedback hover/active, mensagens de erro claras.
- Acessibilidade básica: navegação por teclado nos fluxos principais.

### US-23 Persistência em `localStorage`
**Cenários de sucesso**
- ✅ Após criar/editar/excluir dados e recarregar a página, o estado é idêntico ao anterior.

**Casos extremos**
- `localStorage` indisponível (modo privado) → aviso e modo degradado sem crashes.
- Espaço insuficiente → erro claro; dados anteriores preservados.
- Formato corrompido → recuperação para estado vazio com aviso (não crash).

**Validações**
- Toda mutação de estado persiste (subscriber Pinia ou persistência explícita).
- Chaves de persistência versionadas (ex.: `kanban:v1:*`) para evolução futura.

---

**Ver:** `user-stories.md` · `backlog.md`
