import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateId } from '@/domain/idGenerator'
import { isValidName } from '@/domain/rules'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])

  const byId = computed(() => (id) =>
    projects.value.find((p) => p.id === id)
  )

  function addProject(payload) {
    if (!isValidName(payload.nome)) {
      return { ok: false, error: 'Nome obrigatório' }
    }
    const now = new Date().toISOString()
    const project = {
      id: generateId(),
      nome: payload.nome.trim(),
      descricao: payload.descricao || '',
      criadoEm: now,
      atualizadoEm: now
    }
    projects.value.unshift(project)
    return { ok: true, project }
  }

  function updateProject(id, payload) {
    if (!isValidName(payload.nome)) {
      return { ok: false, error: 'Nome obrigatório' }
    }
    const project = projects.value.find((p) => p.id === id)
    if (!project) return { ok: false, error: 'Projeto não encontrado' }
    project.nome = payload.nome.trim()
    project.descricao = payload.descricao || ''
    project.atualizadoEm = new Date().toISOString()
    return { ok: true, project }
  }

  function removeProject(id) {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index > -1) {
      projects.value.splice(index, 1)
      return { ok: true }
    }
    return { ok: false }
  }

  return {
    projects,
    byId,
    addProject,
    updateProject,
    removeProject
  }
})
