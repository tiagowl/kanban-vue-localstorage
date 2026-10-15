<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  autofocus: { type: Boolean, default: false },
  id: { type: String, default: () => `field-${Math.random().toString(36).slice(2, 9)}` }
})

const emit = defineEmits(['update:modelValue', 'enter'])
const errorId = computed(() => `${props.id}-error`)
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="label">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :autofocus="autofocus"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? errorId : undefined"
      :class="['input', error ? 'border-danger focus:border-danger focus:ring-danger/20' : '']"
      @input="emit('update:modelValue', $event.target.value)"
      @keyup.enter="emit('enter')"
    />
    <p v-if="error" :id="errorId" role="alert" class="mt-1 text-xs text-danger">
      {{ error }}
    </p>
  </div>
</template>
