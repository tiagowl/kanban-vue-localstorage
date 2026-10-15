<script setup>
import { computed } from 'vue'

const props = defineProps({
  done: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  compact: { type: Boolean, default: false }
})

const percent = computed(() => {
  if (!props.total) return 0
  return Math.round((props.done / props.total) * 100)
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div
      v-if="!compact"
      class="h-1.5 flex-1 rounded-full bg-surface-2 overflow-hidden"
      role="progressbar"
      :aria-valuenow="done"
      aria-valuemin="0"
      :aria-valuemax="total"
      :aria-valuetext="`${done} de ${total} subtarefas concluídas`"
    >
      <div
        class="h-full rounded-full transition-all duration-300"
        :style="{ width: `${percent}%`, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }"
      />
    </div>
    <span class="text-xs text-muted tabular-nums whitespace-nowrap">
      {{ total ? `${done}/${total}` : '0 subt.' }}
    </span>
  </div>
</template>
