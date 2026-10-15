# WF-07 — Formulários, Confirmações e Feedback

**Stories:** US-01/02/03/05/06/07/09/14/15 (CRUDs e exclusões) · **Regras:** RN-01…RN-05 e critérios de aceitação de validação
**Objetivo:** padrão único de criação/edição/destruição em todo o sistema (≤ 3 cliques, sempre com feedback).

---

## 1. Modal de formulário (criar/editar — padrão único)

```
┌─────────────────────────────────────────────┐ ✕
│  Novo projeto                          (i) │  ← título = "Novo X" / "Editar X"
│─────────────────────────────────────────────│
│  Nome *                                     │  ← foco automático ao abrir
│  ┌───────────────────────────────────────┐  │
│  │ Site X                                │  │
│  └───────────────────────────────────────┘  │
│  ! Informe um nome                          │  ← erro inline sob o campo
│                                              │
│  Descrição (opcional)                        │
│  ┌───────────────────────────────────────┐  │
│  │ Landing page da nova campanha          │  │  ← textarea, expansível
│  └───────────────────────────────────────┘  │
│                                              │
│         [ Cancelar ]   [ Salvar ]            │  ← Salvar = primário, Enter salva
└─────────────────────────────────────────────┘
```

### Variantes por entidade

| Entidade | Campos | Observações de validação (CA) |
|----------|--------|-------------------------------|
| Projeto | Nome*, Descrição | Nome vazio/só espaços → bloqueado; duplicado → permitido **com aviso** |
| Etapa | Nome* | Sempre vinculada ao projeto atual (nunca órfã) |
| Tarefa | Título*, Etapa (seletor), Descrição, Etiquetas (chips) | Botão desabilitado + dica se o projeto não tem etapas; etiquetas **só do projeto** |
| Subtarefa | Texto* | Estado inicial: não concluída |
| Etiqueta | Nome*, Cor (paleta de 8) | Nome vazio ou duplicado **no mesmo projeto** → bloqueado/aviso |

**Comportamento transversal:** `Esc` cancela · clique fora cancela (se nada alterado) · salvar → modal fecha → **toast de sucesso** → item aparece no topo da lista/card na coluna.

---

## 2. Modal de confirmação destrutiva (padrão único)

```
┌─────────────────────────────────────────────┐
│  !  Excluir projeto "Site X"?               │
│─────────────────────────────────────────────│
│  Esta ação excluirá em cascata:             │  ← consequências explícitas
│  • 4 etapas                                 │
│  • 12 tarefas e 5 subtarefas                │
│  • 6 etiquetas                              │
│  Não é possível desfazer.                   │
│                                              │
│        [ Manter ]      [ Excluir ]           │  ← "Manter" é o foco inicial
└─────────────────────────────────────────────┘
```

| Cenário | Texto/reação (conforme CA) |
|---------|----------------------------|
| Excluir **etapa com tarefas** | **Bloqueio:** "Esta etapa tem 4 tarefas. Mova ou esvazie-a antes de excluir." + ação "Entendi" (regra do PO) |
| Excluir tarefa | "A tarefa e suas 5 subtarefas serão excluídas" |
| Excluir subtarefa | "Excluir a subtarefa 'Definir copy'?" (simples) |
| Cancelar | Nada é alterado; foco retorna ao elemento de origem |
| Último projeto excluído | Home exibe estado vazio + CTA |
| Falha ao gravar | Operação revertida + toast de erro |

---

## 3. Toasts (feedback transiente)

```
┌──────────────────────────────────────────┐
│ ✓ Projeto "Site X" criado            ✕  │  ← sucesso: borda/ícone verde
│ ! Não foi possível salvar. Verifique    │  ← erro: borda/ícone vermelho
│    o espaço do navegador.           ✕  │
└──────────────────────────────────────────┘
     canto inferior direito · 4s · `aria-live="polite"`
```

| Evento | Mensagem (exemplo) |
|--------|--------------------|
| Criação/editação | `✓ Projeto "Site X" criado` |
| Exclusão | `✓ Tarefa excluída` |
| Movimentação kanban | `✓ Movida para "Em Andamento"` |
| `localStorage` cheio | `! Espaço insuficiente — alterações não salvas. Exclua dados antigos.` |
| Modo privado/indisponível | `! Armazenamento indisponível — os dados não persistirão entre sessões.` |
| Dados corrompidos | `! Dados ilegíveis recuperados para estado vazio.` |

---

## 4. Gestão de etiquetas (modal dedicado — US-15)

```
┌─────────────────────────────────────────────┐ ✕
│  Etiquetas de "Site X"                      │
│─────────────────────────────────────────────│
│  ● urgente                          ✎  X   │  ← ao excluir: desvincula das
│  ● cliente A                        ✎  X   │     tarefas sem apagá-las (RN-04)
│  ● estudo                           ✎  X   │
│                                              │
│  [+ Nova etiqueta]                           │
│  Nome *  [____________]  Cor: ● ● ● ● ● ● ● ●│
└─────────────────────────────────────────────┘
```

---

## 5. Hierarquia e regras transversais

1. **Um padrão, todos os CRUDs:** mesmo modal, mesmas validações, mesmo toast.
2. **Erros sempre inline**, junto ao campo (nunca apenas toast).
3. **Destrutivo sempre confirmado** e com consequências listadas; foco inicial em "Manter"/"Cancelar".
4. **Feedback em 3 camadas:** imediato (estado do botão) → curto (toast) → persistente (item novo/atualizado na tela).
5. **≤ 3 cliques:** `+ Nova tarefa` sempre acessível do projeto; `+` da coluna pré-preenche a etapa.

## Responsividade

- ≤ 767px: modais viram **folhas deslizantes de baixo** (bottom sheets) com alvos ≥ 40px; botões de ação fixos no rodapé do sheet.
- Botões primários em largura total no mobile.

## Acessibilidade

- `role="dialog"`, `aria-modal`, título com `aria-labelledby`, foco preso, `Esc` fecha, foco devolvido ao gatilho.
- Erros com `aria-invalid="true"` + `aria-describedby` apontando para a mensagem.
- Ícones decorativos com `aria-hidden="true"`; mensagens sempre em texto (não só cor/ícone).
