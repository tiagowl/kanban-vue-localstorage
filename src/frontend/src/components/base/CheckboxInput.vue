<script setup>
defineProps({
  checked: { type: Boolean, default: false },
  label: { type: String, default: '' },
  big: { type: Boolean, default: false }
})

const emit = defineEmits(['change'])
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="checked"
    :aria-label="label || undefined"
    :title="label || undefined"
    :class="[
      'inline-flex items-center justify-center rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0',
      big ? 'w-6 h-6' : 'w-5 h-5',
      checked
        ? 'bg-success border-success text-white'
        : 'bg-surface border-border text-transparent hover:border-primary'
    ]"
    @click="emit('change', !checked)"
  >
    <svg
      :class="big ? 'w-4 h-4' : 'w-3 h-3'"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>
