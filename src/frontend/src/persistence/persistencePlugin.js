import { unref } from 'vue'
import { SCHEMA_VERSION } from '@/domain/constants'
import { migrate } from '@/persistence/migrations'
import { createSeedData, isEmptyData } from '@/persistence/seed'
import { createStorageAdapter } from '@/persistence/storageAdapter'
import { setSaveStatus } from '@/utils/saveStatus'

const EMPTY = {
  projects: [],
  stages: [],
  tasks: [],
  subtasks: [],
  labels: [],
  taskLabels: []
}

/**
 * Mapeia cada store para as chaves do envelope persistido
 * @type {Record<string, string[]>}
 */
const STORE_SLICES = {
  projects: ['projects'],
  stages: ['stages'],
  tasks: ['tasks'],
  subtasks: ['subtasks'],
  labels: ['labels', 'taskLabels']
}

function readData(pinia, previous) {
  const raw = pinia.state.value
  const fallback = previous && !previous.__corrupt ? previous : EMPTY

  const pick = (storeId, key) => {
    const storeState = raw[storeId]
    if (storeState && Object.prototype.hasOwnProperty.call(storeState, key)) {
      const value = unref(storeState[key])
      if (Array.isArray(value)) return value
    }
    return Array.isArray(fallback[key]) ? fallback[key] : []
  }

  return {
    projects: pick('projects', 'projects'),
    stages: pick('stages', 'stages'),
    tasks: pick('tasks', 'tasks'),
    subtasks: pick('subtasks', 'subtasks'),
    labels: pick('labels', 'labels'),
    taskLabels: pick('labels', 'taskLabels')
  }
}

/**
 * Plugin de persistência do Pinia.
 * - Hidrata cada store a partir do envelope versionado (`kanban:v1`).
 * - Se o armazenamento está ausente ou todas as coleções estão vazias, grava o seed de demonstração.
 * - Persiste o estado agregado com debounce e `flush` no `beforeunload`.
 * - Reidrata em `StorageEvent` (última gravação prevalece).
 * - Coleções de stores ainda não criadas são preservadas na gravação.
 * @param {{ adapter?: ReturnType<typeof createStorageAdapter> }} options
 * @returns {import('pinia').PiniaPlugin}
 */
export function persistencePlugin({ adapter = createStorageAdapter() } = {}) {
  let timer = null
  let listenersAttached = false
  let availabilityChecked = false
  let resolvedEnvelope = null

  function resolveEnvelope() {
    if (resolvedEnvelope) return resolvedEnvelope

    const stored = adapter.get()
    if (stored && stored.__corrupt) {
      resolvedEnvelope = stored
      return resolvedEnvelope
    }

    if (stored && stored.data && !isEmptyData(stored.data)) {
      let data = stored.data
      let schemaVersion = stored.schemaVersion
      if (stored.schemaVersion !== SCHEMA_VERSION) {
        const migrated = migrate(stored.schemaVersion, SCHEMA_VERSION, stored.data)
        data = migrated.data
        schemaVersion = migrated.schemaVersion
      }
      resolvedEnvelope = { ...stored, schemaVersion, data }
      return resolvedEnvelope
    }

    const envelope = {
      schemaVersion: SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      data: createSeedData()
    }
    try {
      adapter.set(envelope)
      setSaveStatus('saved')
    } catch (e) {
      setSaveStatus(e && e.name === 'QuotaExceededError' ? 'error' : 'unavailable')
    }
    resolvedEnvelope = envelope
    return resolvedEnvelope
  }

  function buildEnvelope(pinia) {
    const previous = resolvedEnvelope && resolvedEnvelope.data ? resolvedEnvelope.data : EMPTY
    return {
      schemaVersion: SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      data: readData(pinia, previous)
    }
  }

  return ({ store, pinia }) => {
    if (!availabilityChecked) {
      availabilityChecked = true
      setSaveStatus(adapter.isAvailable() ? 'saved' : 'unavailable')
    }

    const sliceKeys = STORE_SLICES[store.$id]

    if (sliceKeys) {
      const stored = resolveEnvelope()
      if (stored && !stored.__corrupt && stored.data) {
        for (const key of sliceKeys) {
          store[key] = Array.isArray(stored.data[key]) ? stored.data[key] : EMPTY[key]
        }
      } else if (stored && stored.__corrupt) {
        for (const key of sliceKeys) store[key] = EMPTY[key]
      }

      const persist = () => {
        const envelope = buildEnvelope(pinia)
        setSaveStatus('saving')
        try {
          adapter.set(envelope)
          resolvedEnvelope = envelope
          setSaveStatus('saved')
        } catch (e) {
          setSaveStatus(e && e.name === 'QuotaExceededError' ? 'error' : 'unavailable')
        }
      }

      store.$subscribe(() => {
        setSaveStatus('saving')
        if (timer) clearTimeout(timer)
        timer = setTimeout(persist, 150)
      })
    }

    if (!listenersAttached && typeof window !== 'undefined') {
      listenersAttached = true

      const flush = () => {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        const envelope = buildEnvelope(pinia)
        try {
          adapter.set(envelope)
          resolvedEnvelope = envelope
        } catch {
          // ignore
        }
      }

      window.addEventListener('beforeunload', flush)

      window.addEventListener('storage', (event) => {
        if (event.key !== adapter.key && event.key !== undefined) {
          // só reage à chave de persistência, se exposta
        }
        const stored = adapter.get()
        if (!stored || stored.__corrupt || !stored.data) return
        const data = stored.data
        pinia.state.value.projects && (pinia.state.value.projects.projects = data.projects ?? [])
        pinia.state.value.stages && (pinia.state.value.stages.stages = data.stages ?? [])
        pinia.state.value.tasks && (pinia.state.value.tasks.tasks = data.tasks ?? [])
        pinia.state.value.subtasks && (pinia.state.value.subtasks.subtasks = data.subtasks ?? [])
        if (pinia.state.value.labels) {
          pinia.state.value.labels.labels = data.labels ?? []
          pinia.state.value.labels.taskLabels = data.taskLabels ?? []
        }
      })
    }
  }
}
