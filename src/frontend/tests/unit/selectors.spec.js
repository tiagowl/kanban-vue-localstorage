import { describe, it, expect } from 'vitest'
import { selectTaskProgress, selectGlobalTasks } from '@/domain/selectors'

describe('selectors', () => {
  it('calculates progress', () => {
    const task = { id: 't1' }
    const subtasks = [
      { taskId: 't1', concluida: true },
      { taskId: 't1', concluida: false },
      { taskId: 't2', concluida: true }
    ]
    const p = selectTaskProgress(task, subtasks)
    expect(p.done).toBe(1)
    expect(p.total).toBe(2)
  })

  it('selects global tasks with origin', () => {
    const tasks = [{ id: 't1', stageId: 's1', projectId: 'p1', titulo: 'Home' }]
    const projects = [{ id: 'p1', nome: 'Site X' }]
    const stages = [{ id: 's1', nome: 'A Fazer' }]
    const subtasks = []
    const taskLabels = []
    const labels = []
    const vm = selectGlobalTasks(tasks, projects, stages, subtasks, taskLabels, labels)
    expect(vm[0].origem).toBe('Site X › A Fazer')
    expect(vm[0].task.titulo).toBe('Home')
  })
})
