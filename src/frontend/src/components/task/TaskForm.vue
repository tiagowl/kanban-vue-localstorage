<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  mode: { type: String, default: 'create', validator: (v) => ['create', 'edit'].includes(v) },
  task: { type: Object, default: () => ({}) },
  stages: { type: Array, default: () => [] },
  stageId: { type: String, default: '' }
})

const emit = defineEmits(['close', 'save'])

const titulo = ref('')
const descricao = ref('')
const selectedStageId = ref('')
const errors = ref({})

const title = computed(() =>
  props.mode === 'create' ? 'Nova tarefa' : 'Editar tarefa'
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      titulo.value = props.task?.titulo || ''
      descricao.value = props.task?.descricao || ''
      selectedStageId.value = props.stageId || props.task?.stageId || (props.stages[0]?.id || '')
      errors.value = {}
    }
  }
)

function validate() {
  errors.value = {}
  if (!titulo.value || !titulo.value.trim()) {
    errors.value.titulo = 'Título obrigatório'
    return false
  }
  if (!selectedStageId.value) {
    errors.value.stage = 'Selecione uma etapa'
    return false
  }
  return true
}

function onSave() {
  if (!validate()) return
  emit('save', {
    titulo: titulo.value,
    descricao: descricao.value,
    stageId: selectedStageId.value
  })
}
</script>

<template>
  <BaseModal :open="open" :title="title">
    <form class="flex flex-col gap-4" @submit.prevent="onSave">
      <BaseInput
        v-model="titulo"
        label="Título"
        required
        :error="errors.titulo"
        autofocus
      />
      <BaseTextarea
        v-model="descricao"
        label="Descrição (opcional)"
        :rows="3"
      />
      <div>
        <label class="label">Etapa *</label>
        <select
          v-model="selectedStageId"
          class="input"
          :aria-invalid="errors.stage ? 'true' : 'false'"
        >
          <option v-for="stage in stages" :key="stage.id" :value="stage.id">
            {{ stage.nome }}
          </option>
        </select>
        <p v-if="errors.stage" role="alert" class="mt-1 text-xs text-danger">
          {{ errors.stage }}
        </p>
      </div>
    </form>
    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
        <BaseButton @click="onSave">Salvar</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
