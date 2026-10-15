import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateId } from '@/domain/idGenerator'
import { isValidName } from '@/domain/rules'

export const useSubtasksStore = defineStore('subtasks', () => {
  const subtasks = ref([])

  const byTask = computed(() => (taskId) =>
    subtasks.value.filter((s) => s.taskId === taskId)
  )

  function addSubtask(payload) {
    if (!isValidName(payload.texto)) {
      return { ok: false, error: 'Texto obrigatório' }
    }
    const subtask = {
      id: generateId(),
      taskId: payload.taskId,
      texto: payload.texto.trim(),
      concluida: false,
      ordem: subtasks.value.filter((s) => s.taskId === payload.taskId).length + 1
    }
    subtasks.value.push(subtask)
    return { ok: true, subtask }
  }

  function updateSubtask(id, payload) {
    if (payload.texto !== undefined && !isValidName(payload.texto)) {
      return { ok: false, error: 'Texto obrigatório' }
    }
    const subtask = subtasks.value.find((s) => s.id === id)
    if (!subtask) return { ok: false, error: 'Subtarefa não encontrada' }
    if (payload.texto !== undefined) subtask.texto = payload.texto.trim()
    if (payload.concluida !== undefined) subtask.concluida = payload.concluida
    return { ok: true, subtask }
  }

  function toggleSubtask(id) {
    const subtask = subtasks.value.find((s) => s.id === id)
    if (!subtask) return { ok: false }
    subtask.concluida = !subtask.concluida
    return { ok: true }
  }

  function removeSubtask(id) {
    const index = subtasks.value.findIndex((s) => s.id === id)
    if (index > -1) {
      subtasks.value.splice(index, 1)
      return { ok: true }
    }
    return { ok: false }
  }

  function removeByTask(taskId) {
    subtasks.value = subtasks.value.filter((s) => s.taskId !== taskId)
  }

  return {
    subtasks,
    byTask,
    addSubtask,
    updateSubtask,
    toggleSubtask,
    removeSubtask,
    removeByTask
  }
})
