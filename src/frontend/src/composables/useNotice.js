import { ref } from 'vue'

const isOpen = ref(false)
const config = ref({ title: '', message: '' })

export function useNotice() {
  const notify = (options) => {
    config.value = {
      title: options.title || 'Aviso',
      message: options.message || ''
    }
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return { isOpen, config, notify, close }
}
