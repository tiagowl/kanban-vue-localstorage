import { ref } from 'vue'

/**
 * Estado global de persistência exibido no shell.
 * 'saved' | 'saving' | 'error' | 'unavailable'
 */
export const saveStatus = ref('saved')

export function setSaveStatus(status) {
  saveStatus.value = status
}
