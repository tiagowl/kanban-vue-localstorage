import { ref } from 'vue'

/**
 * Gerencia o estado do drag-and-drop de tarefas entre colunas.
 * @param {(taskId: string, stageId: string) => void} onMove
 * @returns {Object}
 */
export function useDragDrop(onMove) {
  const draggingId = ref(null)
  const dragOverStageId = ref(null)

  function onDragStart(taskId, event) {
    draggingId.value = taskId
    if (event && event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', taskId)
    }
  }

  function onDragEnd() {
    draggingId.value = null
    dragOverStageId.value = null
  }

  function onDragOver(stageId, event) {
    if (event) event.preventDefault()
    dragOverStageId.value = stageId
  }

  function onDragLeave(stageId) {
    if (dragOverStageId.value === stageId) {
      dragOverStageId.value = null
    }
  }

  function onDrop(stageId, event) {
    if (event) event.preventDefault()
    const taskId = draggingId.value
    dragOverStageId.value = null
    draggingId.value = null
    if (taskId) onMove(taskId, stageId)
  }

  return {
    draggingId,
    dragOverStageId,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop
  }
}
