<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 3 },
  error: { type: String, default: '' },
  id: { type: String, default: () => `field-${Math.random().toString(36).slice(2, 9)}` }
})

const emit = defineEmits(['update:modelValue'])
const errorId = computed(() => `${props.id}-error`)
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="label">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? errorId : undefined"
      :class="['input resize-y', error ? 'border-danger focus:border-danger' : '']"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" :id="errorId" role="alert" class="mt-1 text-xs text-danger">
      {{ error }}
    </p>
  </div>
</template>
