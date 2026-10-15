<script setup>
import { computed } from 'vue'
import { getLabelColor } from '@/utils/labelColors'

const props = defineProps({
  label: { type: Object, required: true },
  removable: { type: Boolean, default: false }
})

const emit = defineEmits(['remove'])
const color = computed(() => getLabelColor(props.label.cor))
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold"
    :style="{ background: color.bg, color: color.fg }"
  >
    <span
      class="w-1.5 h-1.5 rounded-full"
      :style="{ background: color.dot }"
      aria-hidden="true"
    />
    {{ label.nome }}
    <button
      v-if="removable"
      type="button"
      class="ml-0.5 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
      :aria-label="`Remover etiqueta ${label.nome}`"
      @click.stop="emit('remove', label)"
    >
      <span aria-hidden="true">&#x2715;</span>
    </button>
  </span>
</template>
