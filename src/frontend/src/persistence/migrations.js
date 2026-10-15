import { SCHEMA_VERSION } from '@/domain/constants'

/**
 * Migra dados entre versões
 * @param {number} from
 * @param {number} to
 * @param {Object} data
 * @returns {Object}
 */
export function migrate(from, to, data) {
  let currentData = data
  let currentVersion = from

  if (currentVersion < to) {
    // Migrações futuras aqui
    currentVersion = to
  }

  return {
    schemaVersion: currentVersion,
    data: currentData
  }
}
