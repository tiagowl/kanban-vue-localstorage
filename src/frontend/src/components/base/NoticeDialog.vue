<script setup>
import { nextTick, ref, watch } from 'vue'
import { useNotice } from '@/composables/useNotice'
import BaseButton from './BaseButton.vue'

const { isOpen, config, close } = useNotice()
const okBtn = ref(null)

watch(isOpen, (open) => {
  if (open) nextTick(() => okBtn.value?.$el?.focus?.())
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="presentation"
      @click.self="close"
    >
      <div
        class="w-full sm:max-w-[520px] bg-surface rounded-t-card sm:rounded-card shadow-lg p-5"
        role="alertdialog"
        aria-modal="true"
        :aria-label="config.title"
      >
        <h2 class="text-lg font-bold flex items-start gap-2">
          <span aria-hidden="true" class="text-warning">!</span>
          <span>{{ config.title }}</span>
        </h2>
        <p class="mt-3 text-sm text-muted">{{ config.message }}</p>
        <div class="mt-5 flex sm:justify-end">
          <BaseButton ref="okBtn" @click="close">Entendi</BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
