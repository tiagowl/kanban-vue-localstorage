import { describe, it, expect } from 'vitest'
import { paginate, PAGE_SIZE } from '@/composables/usePagination'

describe('paginate', () => {
  const items = Array.from({ length: 18 }, (_, i) => i + 1)

  it('usa 8 itens por página', () => {
    expect(PAGE_SIZE).toBe(8)
    const first = paginate(items, 1)
    expect(first.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(first.pageCount).toBe(3)
    expect(first.from).toBe(1)
    expect(first.to).toBe(8)
  })

  it('mostra o restante na última página', () => {
    const last = paginate(items, 3)
    expect(last.items).toEqual([17, 18])
    expect(last.from).toBe(17)
    expect(last.to).toBe(18)
  })

  it('limita a página ao intervalo válido', () => {
    expect(paginate(items, 0).page).toBe(1)
    expect(paginate(items, 9).page).toBe(3)
    expect(paginate([], 2)).toMatchObject({ items: [], page: 1, pageCount: 1, total: 0, from: 0, to: 0 })
  })
})
