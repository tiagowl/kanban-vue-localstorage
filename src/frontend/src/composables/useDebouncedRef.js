import { ref, watch } from 'vue'

/**
 * Deriva um valor com debounce a partir de uma fonte reativa.
 * O input permanece responsivo; apenas o valor derivado é atrasado.
 * @param {import('vue').Ref} source
 * @param {number} delay
 * @returns {import('vue').Ref}
 */
export function useDebouncedRef(source, delay = 200) {
  const debounced = ref(source.value)

  watch(source, (value) => {
    const timer = setTimeout(() => {
      debounced.value = value
    }, delay)
    return () => clearTimeout(timer)
  })

  return debounced
}
