# ADR-001 — Arquitetura SPA 100% client-side, sem backend

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software, Product Owner

---

## Contexto

O PO definiu que o sistema é um gerenciador de tarefas pessoal com persistência exclusiva em `localStorage` e sem autenticação/multiusuário (`requirements.md` §5). O produto deve funcionar offline, sem infraestrutura de servidor, deployável como site estático.

## Decisão

Adotar uma **Single Page Application (SPA)** que roda inteiramente no navegador, sem backend. A persistência é local (`localStorage`) e não há chamadas de rede de negócio. O deploy é um bundle estático (`dist/`).

## Consequências

**Positivas**
- Zero custo de infraestrutura de backend; deploy em qualquer host estático.
- Funciona offline; latência mínima (sem round-trips).
- Simplicidade operacional e de segurança (nenhum servidor a proteger).

**Negativas**
- Dados presos a **um** navegador/dispositivo (sem sync) — aceito no escopo.
- Limite de ~5MB da `localStorage` requer tratamento (ADR-005).
- Sem colaboração/multiusuário — fora do MVP.

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| Backend + banco (REST/GraphQL) | Contraria o mandato do PO; custo/ops desnecessários |
| BaaS (Firebase/Supabase) | Adiciona conta, rede e custo; fora do escopo |

## Referências

- `outputs/product-owner/requirements.md` §5 · `architecture-diagram.md` §1–2
- `adr/ADR-005-persistencia-localstorage.md`
