# Stack Tecnológica — Kanban Local

**Agente:** Arquiteto de Software
**Data:** 2026-10-15
**Documento:** `tech-stack.md`
**Insumos:** `outputs/product-owner/requirements.md` (§5 Stack fixa) · `architecture-diagram.md`
**Critérios de avaliação:** requisitos de performance · escalabilidade (com o teto conhecido do `localStorage`) · segurança · manutenibilidade · curva de aprendizado · ecossistema/comunidade · licenciamento/custo.

---

## 1. Resumo da Stack

| Camada | Tecnologia | Versão alvo | Obrigatória? |
|--------|-----------|:-----------:|:-----------:|
| Linguagem | JavaScript (ES2022, ESM) + JSDoc | — | Sim |
| Framework UI | **Vue 3** (Composition API, `<script setup>`) | ^3.4+ | **Obrigatória (PO)** |
| Estado | **Pinia** | ^2.1+ | **Obrigatória (PO)** |
| Estilo | **Tailwind CSS** | ^3.4+ | **Obrigatória (PO)** |
| Build/bundler | **Vite** (com `@vitejs/plugin-vue`) | ^5+ | Recomendada |
| Roteamento | **Vue Router** | ^4.3+ | Recomendada |
| Persistência | **localStorage** (Web Storage API) | — | **Obrigatória (PO)** |
| Ícones | SVG inline (componentes próprios) | — | Recomendada |
| Testes unit/comp | Vitest + @vue/test-utils | ^1.6+ / ^2.4+ | Recomendada |
| Testes E2E | Playwright | ^1.45+ | Recomendada |
| Testes de a11y | axe-core (@axe-core/playwright) | ^4.10+ | Recomendada |
| Lint/format | ESLint + Prettier | ^9 / ^3 | Recomendada |
| IDs | `crypto.randomUUID()` com fallback | Web API | Recomendada |

> **Restrição dura do PO:** Vue 3, Pinia e Tailwind são **fixos** (não negociáveis). As demais escolhas são recomendações do arquiteto para viabilizar qualidade e manutenção.

---

## 2. Justificativa por Decisão

### 2.1 Vue 3 (Composition API) — *obrigatório*
- **Por quê:** mandato do PO; reatividade granular e `<script setup>` reduzem boilerplate; ótima performance em listas reativas (kanban).
- **Trade-off:** ecossistema menor que React, mas suficiente e maduro; curva de aprendizado baixa para SFC.
- **Alternativas (não elegíveis):** React, Svelte — descartadas por imposição de stack.

### 2.2 Pinia — *obrigatório*
- **Por quê:** store oficial do Vue 3, API simples, DevTools, suporte nativo a plugins (base do `persistencePlugin`) e a `subscribe` (usado na persistência).
- **Trade-off:** exige disciplina para não concentrar regra de negócio na store (mitigado pela camada de Domínio — ver `design-patterns.md`).

### 2.3 Tailwind CSS — *obrigatório*
- **Por quê:** materializa os **tokens do design system** via `theme.extend` (já especificado em `design-system.md` §6.1); utilitários aceleram a fidelidade ao protótipo e a responsividade.
- **Trade-off:** markup mais verboso; mitigado por componentes base (`BaseButton`, `Card`, etc.) e `@apply` pontual.
- **Configuração:** consultar `outputs/ux/design-system.md` §6.1 como fonte da verdade dos tokens.

### 2.4 Vite — *recomendado*
- **Por quê:** padrão de facto para Vue 3; HMR instantâneo, build otimizado (Rollup), code-splitting por rota.
- **Trade-off:** irrelevante para o escopo; sem contras relevantes.

### 2.5 Vue Router — *recomendado*
- **Por quê:** requisito funcional de navegação deep-link (US-19/US-21) com `?tarefa=` e `#sub-` (ver `architecture-diagram.md` §5).
- **Config:** `createWebHistory` em host com rewrite; fallback `createWebHashHistory` em host estático sem SPA fallback.

### 2.6 localStorage — *obrigatório*
- **Por quê:** mandato do PO; persistência local, sem backend.
- **Limite conhecido:** ~5MB por origem. Mitigações em ADR-005 e `architecture-diagram.md` §7.
- **Não usar IndexedDB no MVP:** complexidade/assincronia desnecessárias para o volume esperado; registrado como evolução em ADR-005.

### 2.7 JavaScript + JSDoc (em vez de TypeScript) — *decisão do arquiteto*
- **Por quê:** coerência com os artefatos existentes (`tailwind.config.js`, protótipo UX em JS); menor fricção para o time; JSDoc oferece tipagem útil e IntelliSense sem toolchain extra.
- **Trade-off:** segurança de tipos menor que TS. **ADR-010** documenta a decisão e o caminho de migração para TS caso o projeto cresça.

### 2.8 Vitest + Vue Test Utils — *recomendado*
- **Por quê:** integração nativa com Vite; testes de stores (Pinia) e regras de Domínio puros são triviais e rápidos; cobre os critérios de aceitação dos CRUDs e cascatas.

### 2.9 Playwright + axe-core — *recomendado*
- **Por quê:** valida os fluxos P1 de ponta a ponta (criação → kanban → global → navegação) conforme `usability-reports.md` §4 (C-00…C-05); `@axe-core/playwright` fecha a pendência de acessibilidade automatizada (§7 do relatório de usabilidade).

### 2.10 ESLint + Prettier — *recomendado*
- **Por quê:** padroniza o time e previne anti-patterns (ex.: acesso direto a `localStorage`); integra-se ao `eslint-plugin-vue`.

---

## 3. Versões e Ferramentas de Apoio

```jsonc
// package.json (referência)
{
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.0",
    "vue-router": "^4.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.6.0",
    "@vue/test-utils": "^2.4.0",
    "@pinia/testing": "^0.1.0",
    "playwright": "^1.45.0",
    "@axe-core/playwright": "^4.10.0",
    "eslint": "^9.0.0",
    "eslint-plugin-vue": "^9.0.0",
    "prettier": "^3.0.0"
  }
}
```

**Fontes:** `Inter` via `@fontsource/inter` ou `font-display: swap` em CDN com fallback `system-ui` (design-system §2.4).

---

## 4. Alternativas Consideradas (e por que foram descartadas)

| Decisão | Alternativa | Motivo do descarte |
|---------|-------------|--------------------|
| Estado | Vuex | Legado; Pinia é o padrão oficial e mais simples |
| Persistência | IndexedDB | Assíncrono e complexo para o volume do MVP; fica como evolução |
| Persistência | `pinia-plugin-persistedstate` | Boa opção, mas o requisito pede tratamento fino de quota/versão/cross-tab → plugin próprio (ADR-005) |
| Estilo | CSS puro/Sass com tokens | Tailwind é obrigatório e já tem mapeamento pronto no design system |
| Tipo | TypeScript | Curva e coerência com artefatos existentes; ver ADR-010 |
| Build | Webpack | Vite é superior em DX e mais leve |
| UI kit (Vuetify/PrimeVue) | — | O design system exige visual próprio/elegante; kits trariam overrides e peso desnecessários |

---

## 5. Requisitos de Ambiente

| Item | Requisito |
|------|-----------|
| Node.js | ≥ 20 LTS (dev) |
| Browsers alvo | Chrome/Edge 111+, Firefox 111+, Safari 16.4+ (suporte a `randomUUID`, `:has` opcional evitado) |
| Hospedagem | Qualquer host estático (Netlify/Vercel/GitHub Pages/S3) |
| Build de saída | `dist/` estático (HTML/JS/CSS) |
| CI | Instalar → lint → test:unit → build → e2e (ver `development-guidelines.md` §CI) |

---

## 6. Matriz de Adequação (resumo)

| Critério | Vue 3 | Pinia | Tailwind | Vite | localStorage |
|----------|:----:|:----:|:-------:|:----:|:-----------:|
| Performance (alvo) | Alto | Alto | Alto | Alto | Médio (teto 5MB) |
| Manutenibilidade | Alta | Alta | Média-Alta | Alta | Média |
| Curva de aprendizado | Baixa | Baixa | Média | Baixa | Baixa |
| Comunidade | Alta | Alta | Alta | Alta | N/A |
| Custo/licença | MIT | MIT | MIT | MIT | N/A |
| Adequação ao MVP | **Sim** | **Sim** | **Sim** | **Sim** | **Sim (com mitigações)** |

---

**Documentos relacionados:** `architecture-diagram.md` · `design-patterns.md` · `development-guidelines.md` · `adr/ADR-010-javascript-jsdoc.md`
