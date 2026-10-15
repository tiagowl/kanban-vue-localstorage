<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

const tones = {
  success: 'border-l-success',
  error: 'border-l-danger',
  warning: 'border-l-warning',
  info: 'border-l-primary'
}

const icons = {
  success: '\u2713',
  error: '!',
  warning: '!',
  info: 'i'
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed z-[80] bottom-20 lg:bottom-4 right-4 flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      aria-live="polite"
      role="status"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-start gap-3 bg-surface shadow-lg rounded-card border border-border border-l-4 p-3',
          tones[toast.type] || tones.info
        ]"
      >
        <span aria-hidden="true" class="font-bold text-sm">{{ icons[toast.type] || 'i' }}</span>
        <p class="flex-1 text-sm">{{ toast.message }}</p>
        <button
          type="button"
          class="text-muted hover:text-text"
          aria-label="Fechar aviso"
          @click="remove(toast.id)"
        >
          <span aria-hidden="true">&#x2715;</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>
