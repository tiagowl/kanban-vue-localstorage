# ADR-005 — Persistência em `localStorage` com envelope versionado

**Status:** Aceita
**Data:** 2026-10-15
**Decisores:** Arquiteto de Software

---

## Contexto

O PO fixou `localStorage` como persistência (US-23). Os critérios de aceitação exigem robustez: sobreviver a reload, tratar quota excedida, storage indisponível (modo privado) e dados corrompidos sem crash, além de chaves versionadas para evolução (CA-US-23). Há risco arquitetural classificado como **Alto** no backlog.

## Decisão

Implementar uma **camada única de persistência** (`StorageAdapter` + `persistencePlugin`) com:
- **Chave versionada** `kanban:v1` e `schemaVersion` no envelope.
- **Serialização defensiva** (`try/catch`) e detecção de corrupção → fallback para estado vazio com aviso.
- **Gravação com debounce** (150ms) + `flush` no `beforeunload`.
- **Tratamento de quota** (`QuotaExceededError`) → aviso persistente, mantendo o estado em memória.
- **Migrações** centralizadas (`persistence/migrations.js`).
- **Sync cross-tab** via `StorageEvent` (última gravação prevalece).

Nenhum componente/store acessa `localStorage` diretamente (P-02).

## Consequências

**Positivas**
- Evolução de esquema segura (versionamento + migrações).
- Falhas de storage não derrubam a aplicação (modo degradado).
- Testável com um `InMemoryStorage`.

**Negativas**
- Lógica adicional a manter (adapter, plugin, migrações).
- Debounce pode perder a última gravação se o navegador fechar abruptamente — mitigado pelo flush no `beforeunload`.
- `localStorage` é síncrono e limitado a ~5MB.

## Alternativas consideradas

| Alternativa | Motivo do descarte |
|-------------|--------------------|
| `pinia-plugin-persistedstate` | Menos controle sobre quota/versão/cross-tab exigidos pelas CA |
| IndexedDB | Assíncrono e complexo para o volume do MVP; evolução futura |
| Cookies | Limite de tamanho (~4KB); inadequado |

## Referências

- `architecture-diagram.md` §7 · `development-guidelines.md` §5 · `design-patterns.md` DP-02/DP-03/DP-09
- `outputs/product-owner/acceptance-criteria.md` US-23
