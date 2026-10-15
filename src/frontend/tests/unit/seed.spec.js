import { describe, it, expect, vi } from 'vitest'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createSeedData, isEmptyData } from '@/persistence/seed'
import { persistencePlugin } from '@/persistence/persistencePlugin'
import { createStorageAdapter } from '@/persistence/storageAdapter'
import { STORAGE_KEY } from '@/domain/constants'
import { useLabelsStore } from '@/stores/labelsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useStagesStore } from '@/stores/stagesStore'
import { useSubtasksStore } from '@/stores/subtasksStore'
import { useTasksStore } from '@/stores/tasksStore'

function memoryStorage(initial) {
  const map = new Map(initial ? [[STORAGE_KEY, initial]] : [])
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
    snapshot() {
      return map.get(STORAGE_KEY)
    }
  }
}

describe('seed', () => {
  it('preenche todas as coleções com referências válidas', () => {
    const data = createSeedData()

    expect(isEmptyData(data)).toBe(false)
    expect(data.projects.length).toBeGreaterThan(0)
    expect(data.stages.length).toBeGreaterThan(0)
    expect(data.tasks.length).toBeGreaterThan(0)
    expect(data.subtasks.length).toBeGreaterThan(0)
    expect(data.labels.length).toBeGreaterThan(0)
    expect(data.taskLabels.length).toBeGreaterThan(0)

    const projectIds = new Set(data.projects.map((p) => p.id))
    const stageIds = new Set(data.stages.map((s) => s.id))
    const taskIds = new Set(data.tasks.map((t) => t.id))
    const labelIds = new Set(data.labels.map((l) => l.id))

    for (const stage of data.stages) {
      expect(projectIds.has(stage.projectId)).toBe(true)
    }
    for (const task of data.tasks) {
      expect(projectIds.has(task.projectId)).toBe(true)
      expect(stageIds.has(task.stageId)).toBe(true)
      const stage = data.stages.find((s) => s.id === task.stageId)
      expect(stage.projectId).toBe(task.projectId)
    }
    for (const subtask of data.subtasks) {
      expect(taskIds.has(subtask.taskId)).toBe(true)
      expect(subtask.texto.trim().length).toBeGreaterThan(0)
    }
    for (const label of data.labels) {
      expect(projectIds.has(label.projectId)).toBe(true)
    }
    for (const link of data.taskLabels) {
      expect(taskIds.has(link.taskId)).toBe(true)
      expect(labelIds.has(link.labelId)).toBe(true)
      const task = data.tasks.find((t) => t.id === link.taskId)
      const label = data.labels.find((l) => l.id === link.labelId)
      expect(label.projectId).toBe(task.projectId)
    }
  })

  it('trata coleções vazias como armazenamento vazio', () => {
    expect(isEmptyData(null)).toBe(true)
    expect(
      isEmptyData({
        projects: [],
        stages: [],
        tasks: [],
        subtasks: [],
        labels: [],
        taskLabels: []
      })
    ).toBe(true)
    expect(isEmptyData({ projects: [{ id: 'p1' }] })).toBe(false)
  })
})

describe('persistencePlugin seed', () => {
  function boot(storage) {
    const pinia = createPinia()
    pinia.use(persistencePlugin({ adapter: createStorageAdapter({ storage }) }))
    createApp({ template: '<div />' }).use(pinia)
    return {
      projects: useProjectsStore(),
      stages: useStagesStore(),
      tasks: useTasksStore(),
      subtasks: useSubtasksStore(),
      labels: useLabelsStore()
    }
  }

  it('grava o seed quando o armazenamento está vazio', () => {
    const storage = memoryStorage()
    const { projects, stages, tasks, subtasks, labels } = boot(storage)

    expect(projects.projects.map((p) => p.nome)).toEqual([
      'Site X',
      'App Mobile',
      'Estudo Vue'
    ])
    expect(stages.stages.length).toBe(8)
    expect(tasks.tasks.length).toBe(15)
    expect(subtasks.subtasks.length).toBe(18)
    expect(labels.labels.length).toBe(5)
    expect(labels.taskLabels.length).toBe(7)

    const saved = JSON.parse(storage.snapshot())
    expect(saved.data.projects).toHaveLength(3)
    expect(saved.data.taskLabels).toHaveLength(7)
  })

  it('preserva dados já gravados', () => {
    const existing = {
      schemaVersion: 1,
      data: {
        projects: [
          {
            id: 'p-real',
            nome: 'Projeto real',
            descricao: '',
            criadoEm: '2026-10-02T00:00:00.000Z',
            atualizadoEm: '2026-10-02T00:00:00.000Z'
          }
        ],
        stages: [],
        tasks: [],
        subtasks: [],
        labels: [],
        taskLabels: []
      }
    }
    const storage = memoryStorage(JSON.stringify(existing))
    const { projects } = boot(storage)
    expect(projects.projects).toHaveLength(1)
    expect(projects.projects[0].nome).toBe('Projeto real')
  })

  it('persiste mutações sem embrulhar os refs', async () => {
    vi.useFakeTimers()
    const storage = memoryStorage()
    const { projects } = boot(storage)

    projects.addProject({ nome: 'Extra', descricao: 'novo' })
    await vi.advanceTimersByTimeAsync(200)

    const saved = JSON.parse(storage.snapshot())
    expect(saved.data.projects.some((p) => p.nome === 'Extra')).toBe(true)
    expect(saved.data.projects.every((p) => p && p.nome && !p.value)).toBe(true)
    expect(saved.data.stages.length).toBeGreaterThan(0)
    vi.useRealTimers()
  })
})
