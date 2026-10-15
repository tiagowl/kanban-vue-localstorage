# ADR-004 — Tailwind CSS com tokens do design system

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software, UX Designer

---

## Contexto

O PO fixou **Tailwind CSS** (`requirements.md` §5) e exigiu UI bonita, elegante e profissional (F-11/US-22). O UX já entregou um design system com tokens completos e um mapeamento pronto para `tailwind.config.js` (`design-system.md` §6.1).

## Decisão

Usar **Tailwind CSS** com os **tokens do design system** declarados em `theme.extend` (cores, raio, sombra, tipografia). O `design-system.md` é a **fonte da verdade** visual. Padrões repetidos são extraídos em **componentes base** (não em classes utilitárias duplicadas em massa).

## Consequências

**Positivas**
- Fidelidade direta ao protótipo e consistência (H-07).
- Responsividade e estados (`hover`, `focus-visible`, `disabled`) rápidos de expressar.
- Troca de tema/tokens centralizada no config.

**Negativas**
- Markup verboso — mitigado por componentes base e `@apply` pontual.
- Curva inicial para quem não conhece utilitários.

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| CSS puro / Sass com tokens | Mais boilerplate; Tailwind é obrigatório |
| UI kit (Vuetify/PrimeVue) | Visual próprio exigido; overrides pesados; bundle maior |
| CSS-in-JS | Não idiomático no ecossistema Vue/Tailwind escolhido |

## Referências

- `outputs/ux/design-system.md` §2/§6.1 · `tech-stack.md` §2.3 · `development-guidelines.md` §6
