import { computed, ref, toValue, watch } from 'vue'

export const PAGE_SIZE = 8

/**
 * Recorta uma lista na página pedida.
 * @param {unknown[]} items
 * @param {number} page página 1-based
 * @param {number} [pageSize]
 * @returns {{ items: unknown[], page: number, pageCount: number, total: number, from: number, to: number }}
 */
export function paginate(items, page, pageSize = PAGE_SIZE) {
  const list = Array.isArray(items) ? items : []
  const size = pageSize > 0 ? pageSize : PAGE_SIZE
  const pageCount = Math.max(1, Math.ceil(list.length / size) || 1)
  const current = Math.min(Math.max(1, Number(page) || 1), pageCount)
  const start = (current - 1) * size
  const slice = list.slice(start, start + size)
  return {
    items: slice,
    page: current,
    pageCount,
    total: list.length,
    from: list.length ? start + 1 : 0,
    to: list.length ? start + slice.length : 0
  }
}

/**
 * Paginação reativa. `resetOn` volta para a página 1 quando o filtro muda.
 * @param {import('vue').MaybeRefOrGetter<unknown[]>} source
 * @param {{ pageSize?: number, resetOn?: import('vue').WatchSource | import('vue').WatchSource[] }} [options]
 */
export function usePagination(source, options = {}) {
  const pageSize = options.pageSize ?? PAGE_SIZE
  const page = ref(1)

  if (options.resetOn) {
    const sources = Array.isArray(options.resetOn) ? options.resetOn : [options.resetOn]
    watch(sources, () => {
      page.value = 1
    })
  }

  const state = computed(() => paginate(toValue(source), page.value, pageSize))

  watch(
    () => state.value.page,
    (current) => {
      if (page.value !== current) page.value = current
    }
  )

  function setPage(next) {
    page.value = next
  }

  return { page, state, setPage, pageSize }
}
