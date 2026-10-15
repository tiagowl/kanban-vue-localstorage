/**
 * Regras de negócio puras (sem Vue, sem navegador)
 */

/**
 * Valida se nome é válido (não vazio, não só espaços)
 * @param {string} nome
 * @returns {boolean}
 */
export function isValidName(nome) {
  if (!nome) return false
  if (typeof nome !== 'string') return false
  return nome.trim().length > 0
}

/**
 * Verifica se etapa pode ser excluída (bloqueado se tiver tarefas)
 * @param {Object[]} tasks
 * @param {string} stageId
 * @returns {boolean}
 */
export function canDeleteStage(tasks, stageId) {
  if (!Array.isArray(tasks)) return true
  return !tasks.some((t) => t.stageId === stageId)
}

/**
 * Verifica se etiqueta pertence ao mesmo projeto da tarefa
 * @param {Object} label
 * @param {string} projectId
 * @returns {boolean}
 */
export function isLabelInProject(label, projectId) {
  if (!label || !projectId) return false
  return label.projectId === projectId
}

/**
 * Filtra etiquetas válidas para um projeto
 * @param {Object[]} labels
 * @param {string} projectId
 * @returns {Object[]}
 */
export function getLabelsForProject(labels, projectId) {
  if (!Array.isArray(labels)) return []
  return labels.filter((l) => l.projectId === projectId)
}
