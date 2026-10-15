import { ref, nextTick } from 'vue'

/**
 * Realça e rola até um elemento âncora (ex.: subtarefa de origem).
 * @returns {{ activeAnchor: import('vue').Ref<string|null>, highlight: Function }}
 */
export function useAnchor() {
  const activeAnchor = ref(null)

  async function highlight(anchorId, duration = 2400) {
    activeAnchor.value = anchorId
    await nextTick()
    const el = document.getElementById(anchorId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.focus?.()
    }
    setTimeout(() => {
      if (activeAnchor.value === anchorId) activeAnchor.value = null
    }, duration)
  }

  return { activeAnchor, highlight }
}
