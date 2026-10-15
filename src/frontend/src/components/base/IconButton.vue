<script setup>
defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'button' }
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    class="icon-btn"
    :aria-label="label"
    :title="label"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
