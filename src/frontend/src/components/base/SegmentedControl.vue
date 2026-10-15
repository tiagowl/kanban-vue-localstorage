<script setup>
defineProps({
  modelValue: { type: [String, Boolean], default: '' },
  options: { type: Array, required: true },
  label: { type: String, default: 'Visualização' }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div
    class="inline-flex items-center gap-1 rounded-sm bg-surface-2 p-1"
    role="tablist"
    :aria-label="label"
  >
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      role="tab"
      :aria-selected="modelValue === opt.value"
      :class="[
        'px-3 py-1.5 text-sm rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        modelValue === opt.value
          ? 'bg-surface text-primary shadow-sm'
          : 'text-muted hover:text-text'
      ]"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
