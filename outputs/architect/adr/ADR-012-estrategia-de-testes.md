# ADR-012 — Estratégia de testes (Vitest + Playwright + axe)

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software, Tester

---

## Contexto

As CA cobrem regras críticas de integridade (cascatas, bloqueios, RNS), persistência resiliente e navegação. O UX documentou um plano de teste moderado R2 (cenários C-00…C-05) e deixou pendente a validação automatizada de acessibilidade (`usability-reports.md` §7/§9). O backlog define DoD com verificação manual de persistência e ausência de órfãos.

## Decisão

Adotar uma **pirâmide de testes**:
- **Unitário (Vitest)** para `domain/` (regras, seletores, filtros) e `stores/` (`@pinia/testing`).
- **Componente (Vitest + @vue/test-utils)** para componentes presentational (props/emit).
- **E2E (Playwright)** para os fluxos C-00…C-05.
- **Acessibilidade (@axe-core/playwright)** nas páginas principais.
- **Persistência:** testes com `InMemoryStorage` simulando quota excedida e corrupção.

Cobertura mínima: **80%** em `src/domain` e `src/persistence`.

## Consequências

**Positivas**
- Regras de integridade protegidas contra regressão (maior risco do MVP).
- Integração nativa com Vite (Vitest) → execução rápida.
- Fecha a pendência de acessibilidade do UX com verificação automatizada.

**Negativas**
- Manutenção de dois conjuntos E2E (ponteiro e teclado) por causa do ADR-009.
- E2E é mais lento — mantido enxuto nos fluxos P1.

## Casos obrigatórios

- Excluir etapa com tarefas → bloqueado (CA US-06).
- Excluir projeto → remove toda a árvore, sem órfãos (CA US-03).
- Remover etiqueta → desvincula sem apagar tarefas (RN-04).
- Reload preserva estado (CA US-23); quota/corrupção tratados.
- Filtro case-insensitive parcial (RN-05).
- Global → tarefa/subtarefa em 1 clique (US-19/US-21).

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| Só E2E | Lento, frágil e caro; regras puras merecem teste unitário |
| Cypress (E2E) | Playwright tem melhor integração com a11y (axe) e multi-browser |
| Jest | Vitest integra nativamente ao Vite; menos configuração |
| Sem a11y automatizada | Contraria US-22 e a pendência do UX |

## Referências

- `outputs/ux/usability-reports.md` §4/§5/§7 · `outputs/product-owner/backlog.md` §6 · `development-guidelines.md` §8
