import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateId } from '@/domain/idGenerator'
import { isValidName } from '@/domain/rules'

export const useLabelsStore = defineStore('labels', () => {
  const labels = ref([])
  const taskLabels = ref([])

  const byProject = computed(() => (projectId) =>
    labels.value.filter((l) => l.projectId === projectId)
  )

  function addLabel(payload) {
    if (!isValidName(payload.nome)) {
      return { ok: false, error: 'Nome obrigatório' }
    }
    const label = {
      id: generateId(),
      projectId: payload.projectId,
      nome: payload.nome.trim(),
      cor: payload.cor || 'violet'
    }
    labels.value.push(label)
    return { ok: true, label }
  }

  function updateLabel(id, payload) {
    if (payload.nome !== undefined && !isValidName(payload.nome)) {
      return { ok: false, error: 'Nome obrigatório' }
    }
    const label = labels.value.find((l) => l.id === id)
    if (!label) return { ok: false, error: 'Etiqueta não encontrada' }
    if (payload.nome !== undefined) label.nome = payload.nome.trim()
    if (payload.cor !== undefined) label.cor = payload.cor
    return { ok: true, label }
  }

  function removeLabel(id) {
    const index = labels.value.findIndex((l) => l.id === id)
    if (index > -1) {
      labels.value.splice(index, 1)
      taskLabels.value = taskLabels.value.filter((tl) => tl.labelId !== id)
      return { ok: true }
    }
    return { ok: false }
  }

  function linkTaskLabel(taskId, labelId) {
    const exists = taskLabels.value.find(
      (tl) => tl.taskId === taskId && tl.labelId === labelId
    )
    if (exists) return { ok: false }
    taskLabels.value.push({ taskId, labelId })
    return { ok: true }
  }

  function unlinkTaskLabel(taskId, labelId) {
    const index = taskLabels.value.findIndex(
      (tl) => tl.taskId === taskId && tl.labelId === labelId
    )
    if (index > -1) {
      taskLabels.value.splice(index, 1)
      return { ok: true }
    }
    return { ok: false }
  }

  function getTaskLabels(taskId) {
    return taskLabels.value.filter((tl) => tl.taskId === taskId)
  }

  return {
    labels,
    taskLabels,
    byProject,
    addLabel,
    updateLabel,
    removeLabel,
    linkTaskLabel,
    unlinkTaskLabel,
    getTaskLabels
  }
})
