/**
 * Seletores e view-models puros
 */

/**
 * Calcula progresso de subtarefas
 * @param {Object} task
 * @param {Object[]} subtasks
 * @returns {{done: number, total: number}}
 */
export function selectTaskProgress(task, subtasks) {
  if (!Array.isArray(subtasks) || !task) {
    return { done: 0, total: 0 }
  }
  const list = subtasks.filter((s) => s.taskId === task.id)
  const done = list.filter((s) => s.concluida).length
  return { done, total: list.length }
}

/**
 * Resolve etiquetas de uma tarefa
 * @param {Object} task
 * @param {Object[]} taskLabels
 * @param {Object[]} labels
 * @returns {Object[]}
 */
export function selectTaskLabels(task, taskLabels, labels) {
  if (!task || !Array.isArray(taskLabels) || !Array.isArray(labels)) {
    return []
  }
  const labelIds = taskLabels
    .filter((tl) => tl.taskId === task.id)
    .map((tl) => tl.labelId)
  return labels.filter((l) => labelIds.includes(l.id))
}

/**
 * Seleciona tarefas globais com origem
 * @param {Object[]} tasks
 * @param {Object[]} projects
 * @param {Object[]} stages
 * @param {Object[]} subtasks
 * @param {Object[]} taskLabels
 * @param {Object[]} labels
 * @returns {Array}
 */
export function selectGlobalTasks(
  tasks,
  projects,
  stages,
  subtasks,
  taskLabels,
  labels
) {
  if (!Array.isArray(tasks)) return []

  return tasks.map((task) => {
    const stage = stages.find((s) => s.id === task.stageId) || {}
    const project = projects.find((p) => p.id === task.projectId) || {}
    const progress = selectTaskProgress(task, subtasks)
    const taskLabelsResolved = selectTaskLabels(task, taskLabels, labels)
    return {
      task,
      stage,
      project,
      progress,
      labels: taskLabelsResolved,
      origem: `${project.nome || ''} › ${stage.nome || ''}`
    }
  })
}

/**
 * Seleciona subtarefas globais com origem
 * @param {Object[]} subtasks
 * @param {Object[]} tasks
 * @param {Object[]} projects
 * @param {Object[]} stages
 * @returns {Array}
 */
export function selectGlobalSubtasks(subtasks, tasks, projects, stages) {
  if (!Array.isArray(subtasks)) return []

  return subtasks.map((subtask) => {
    const task = tasks.find((t) => t.id === subtask.taskId) || {}
    const stage = stages.find((s) => s.id === task.stageId) || {}
    const project = projects.find((p) => p.id === task.projectId) || {}
    const progress = selectTaskProgress(task, subtasks)
    return {
      subtask,
      task,
      stage,
      project,
      progress,
      origem: `${project.nome || ''} › ${task.titulo || ''}`
    }
  })
}
