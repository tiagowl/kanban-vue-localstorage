import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const drawerOpen = ref(false)
  const drawerTaskId = ref(null)
  const modalOpen = ref(false)
  const modalType = ref(null)
  const modalData = ref(null)

  function openDrawer(taskId) {
    drawerTaskId.value = taskId
    drawerOpen.value = true
  }

  function closeDrawer() {
    drawerOpen.value = false
    drawerTaskId.value = null
  }

  function openModal(type, data = null) {
    modalType.value = type
    modalData.value = data
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
    modalType.value = null
    modalData.value = null
  }

  return {
    drawerOpen,
    drawerTaskId,
    modalOpen,
    modalType,
    modalData,
    openDrawer,
    closeDrawer,
    openModal,
    closeModal
  }
})
