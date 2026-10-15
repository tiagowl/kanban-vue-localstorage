import { describe, it, expect } from 'vitest'
import { isValidName, canDeleteStage } from '@/domain/rules'

describe('rules', () => {
  it('validates names', () => {
    expect(isValidName('Site X')).toBe(true)
    expect(isValidName('')).toBe(false)
    expect(isValidName('   ')).toBe(false)
  })

  it('blocks deleting stage with tasks', () => {
    const tasks = [{ id: 't1', stageId: 's1' }]
    expect(canDeleteStage(tasks, 's1')).toBe(false)
    expect(canDeleteStage(tasks, 's2')).toBe(true)
    expect(canDeleteStage([], 's1')).toBe(true)
  })
})
