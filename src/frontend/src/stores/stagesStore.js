import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateId } from '@/domain/idGenerator'
import { isValidName, canDeleteStage } from '@/domain/rules'

export const useStagesStore = defineStore('stages', () => {
  const stages = ref([])

  const byProject = computed(() => (projectId) =>
    stages.value.filter((s) => s.projectId === projectId).sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
  )

  function addStage(payload) {
    if (!isValidName(payload.nome)) {
      return { ok: false, error: 'Nome obrigatório' }
    }
    const maxOrder = Math.max(0, ...stages.value.filter(s => s.projectId === payload.projectId).map(s => s.ordem || 0))
    const stage = {
      id: generateId(),
      projectId: payload.projectId,
      nome: payload.nome.trim(),
      ordem: maxOrder + 1,
      criadoEm: new Date().toISOString()
    }
    stages.value.push(stage)
    return { ok: true, stage }
  }

  function updateStage(id, payload) {
    if (!isValidName(payload.nome)) {
      return { ok: false, error: 'Nome obrigatório' }
    }
    const stage = stages.value.find((s) => s.id === id)
    if (!stage) return { ok: false, error: 'Etapa não encontrada' }
    stage.nome = payload.nome.trim()
    return { ok: true, stage }
  }

  function removeStage(id, tasks) {
    if (!canDeleteStage(tasks, id)) {
      return { ok: false, error: 'Não é possível excluir etapa com tarefas' }
    }
    const index = stages.value.findIndex((s) => s.id === id)
    if (index > -1) {
      stages.value.splice(index, 1)
      return { ok: true }
    }
    return { ok: false }
  }

  return {
    stages,
    byProject,
    addStage,
    updateStage,
    removeStage
  }
})
