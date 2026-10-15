<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import IconButton from './IconButton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})

const emit = defineEmits(['close'])
const panel = ref(null)

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        const focusable = panel.value?.querySelector(
          'input, textarea, select, button'
        )
        focusable?.focus()
      })
    } else {
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="presentation"
      @click.self="emit('close')"
    >
      <div
        ref="panel"
        class="w-full sm:max-w-[560px] bg-surface rounded-t-card sm:rounded-card shadow-lg max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <header class="flex items-start justify-between gap-4 p-5 border-b border-border">
          <div>
            <h2 class="text-lg font-bold">{{ title }}</h2>
            <p v-if="subtitle" class="text-sm text-muted mt-0.5">{{ subtitle }}</p>
          </div>
          <IconButton label="Fechar" @click="emit('close')">
            <span aria-hidden="true">&#x2715;</span>
          </IconButton>
        </header>
        <div class="p-5 overflow-y-auto">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="p-5 border-t border-border">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>
