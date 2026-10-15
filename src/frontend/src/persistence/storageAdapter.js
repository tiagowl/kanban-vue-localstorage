import { STORAGE_KEY } from '@/domain/constants'

/**
 * Cria um adapter para armazenamento
 * @param {Object} options
 * @returns {Object}
 */
export function createStorageAdapter({ key = STORAGE_KEY, storage = window.localStorage } = {}) {
  return {
    key,
    isAvailable() {
      try {
        const k = '__t__'
        storage.setItem(k, k)
        storage.removeItem(k)
        return true
      } catch {
        return false
      }
    },
    get() {
      try {
        const raw = storage.getItem(key)
        if (!raw) return null
        return JSON.parse(raw)
      } catch {
        return { __corrupt: true }
      }
    },
    set(value) {
      try {
        storage.setItem(key, JSON.stringify(value))
        return true
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          throw e
        }
        throw e
      }
    },
    remove() {
      try {
        storage.removeItem(key)
      } catch {
        // ignore
      }
    }
  }
}
