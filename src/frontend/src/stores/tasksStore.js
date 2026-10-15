import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateId } from '@/domain/idGenerator'
import { isValidName } from '@/domain/rules'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])

  const byProject = computed(() => (projectId) =>
    tasks.value.filter((t) => t.projectId === projectId)
  )

  const byStage = computed(() => (stageId) =>
    tasks.value.filter((t) => t.stageId === stageId)
  )

  function addTask(payload) {
    if (!isValidName(payload.titulo)) {
      return { ok: false, error: 'Título obrigatório' }
    }
    const now = new Date().toISOString()
    const task = {
      id: generateId(),
      stageId: payload.stageId,
      projectId: payload.projectId,
      titulo: payload.titulo.trim(),
      descricao: payload.descricao || '',
      ordem: tasks.value.filter((t) => t.stageId === payload.stageId).length + 1,
      criadoEm: now,
      atualizadoEm: now
    }
    tasks.value.push(task)
    return { ok: true, task }
  }

  function updateTask(id, payload) {
    if (payload.titulo !== undefined && !isValidName(payload.titulo)) {
      return { ok: false, error: 'Título obrigatório' }
    }
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return { ok: false, error: 'Tarefa não encontrada' }
    if (payload.titulo !== undefined) task.titulo = payload.titulo.trim()
    if (payload.descricao !== undefined) task.descricao = payload.descricao
    if (payload.stageId !== undefined) task.stageId = payload.stageId
    task.atualizadoEm = new Date().toISOString()
    return { ok: true, task }
  }

  function moveTask(id, newStageId) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return { ok: false }
    if (task.stageId === newStageId) return { ok: false }
    task.stageId = newStageId
    task.atualizadoEm = new Date().toISOString()
    return { ok: true }
  }

  function removeTask(id) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index > -1) {
      tasks.value.splice(index, 1)
      return { ok: true }
    }
    return { ok: false }
  }

  return {
    tasks,
    byProject,
    byStage,
    addTask,
    updateTask,
    moveTask,
    removeTask
  }
})
