<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['md', 'sm'].includes(v)
  },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const classes = computed(() => {
  const base = {
    primary: 'btn-primary',
    secondary: 'btn',
    danger: 'btn-danger',
    ghost: 'btn-ghost'
  }[props.variant]
  return [base, props.size === 'sm' ? 'btn-sm' : '']
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
