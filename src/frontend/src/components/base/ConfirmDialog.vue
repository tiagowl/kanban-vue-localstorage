<script setup>
import { nextTick, ref, watch } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import BaseButton from './BaseButton.vue'

const { isOpen, config, confirmAction, cancel } = useConfirm()
const keepBtn = ref(null)

watch(isOpen, (open) => {
  if (open) {
    nextTick(() => keepBtn.value?.$el?.focus?.())
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="presentation"
      @click.self="cancel"
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
        <div class="mt-3 text-sm text-muted space-y-2">
          <p v-if="config.message">{{ config.message }}</p>
          <ul v-if="config.consequences.length" class="list-disc pl-5 space-y-1">
            <li v-for="(item, i) in config.consequences" :key="i">{{ item }}</li>
          </ul>
          <p class="text-muted-2">Não é possível desfazer.</p>
        </div>
        <div class="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <BaseButton ref="keepBtn" variant="secondary" @click="cancel">
            Manter
          </BaseButton>
          <BaseButton variant="danger" @click="confirmAction">Excluir</BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
