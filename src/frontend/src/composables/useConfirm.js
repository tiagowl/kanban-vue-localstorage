import { ref } from 'vue'

const isOpen = ref(false)
const config = ref({ title: '', message: '', consequences: [] })
let resolveFn = null

export function useConfirm() {
  const confirm = (options) => {
    config.value = {
      title: options.title || 'Confirmar',
      message: options.message || '',
      consequences: options.consequences || []
    }
    isOpen.value = true
    return new Promise((resolve) => {
      resolveFn = resolve
    })
  }

  const confirmAction = () => {
    if (resolveFn) {
      resolveFn(true)
      resolveFn = null
    }
    isOpen.value = false
  }

  const cancel = () => {
    if (resolveFn) {
      resolveFn(false)
      resolveFn = null
    }
    isOpen.value = false
  }

  return {
    isOpen,
    config,
    confirm,
    confirmAction,
    cancel
  }
}
