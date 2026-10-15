/**
 * Filtros puros para busca e classificação
 */

/**
 * Filtro por nome (case-insensitive, parcial)
 * @param {string} term
 * @returns {(item: Object) => boolean}
 */
export function byName(term) {
  const searchTerm = term ? term.trim().toLowerCase() : ''
  if (!searchTerm) return () => true
  return (item) => {
    const title = (item.titulo || item.nome || item.texto || '').toLowerCase()
    return title.includes(searchTerm)
  }
}

/**
 * Filtro por etapa
 * @param {string} stageId
 * @returns {(task: Object) => boolean}
 */
export function byStage(stageId) {
  if (!stageId) return () => true
  return (task) => task.stageId === stageId
}

/**
 * Filtro por conclusão
 * @param {boolean} done
 * @returns {(subtask: Object) => boolean}
 */
export function byDone(done) {
  return (subtask) => subtask.concluida === done
}
