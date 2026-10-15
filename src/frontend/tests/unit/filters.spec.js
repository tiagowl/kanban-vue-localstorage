import { describe, it, expect } from 'vitest'
import { byName } from '@/domain/filters'

describe('filters', () => {
  it('filters case-insensitive and partial', () => {
    const items = [{ titulo: 'Escrever homepage' }, { titulo: 'Revisar textos' }]
    expect(items.filter(byName('home'))).toHaveLength(1)
    expect(items.filter(byName('HOME'))).toHaveLength(1)
    expect(items.filter(byName('xyz'))).toHaveLength(0)
    expect(items.filter(byName(''))).toHaveLength(2)
  })
})
