<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['md', 'compact', 'tiny'].includes(v)
  }
})
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center text-center rounded-card border border-dashed border-border bg-surface/60',
      size === 'md' ? 'py-12 px-6 gap-3' : size === 'compact' ? 'py-6 px-4 gap-2' : 'py-3 px-3 gap-1'
    ]"
  >
    <div
      :class="[
        'flex items-center justify-center rounded-full bg-primary-soft text-primary font-bold',
        size === 'md' ? 'w-12 h-12 text-xl' : size === 'compact' ? 'w-9 h-9 text-base' : 'w-6 h-6 text-xs'
      ]"
      aria-hidden="true"
    >
      <slot name="icon">+</slot>
    </div>
    <h3 :class="size === 'md' ? 'text-[17px] font-bold' : 'text-sm font-semibold'">
      {{ title }}
    </h3>
    <p v-if="message" class="text-sm text-muted max-w-sm">{{ message }}</p>
    <div v-if="$slots.action" :class="size === 'tiny' ? '' : 'mt-1'">
      <slot name="action" />
    </div>
  </div>
</template>
