<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTextarea from '@/components/base/BaseTextarea.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  mode: { type: String, default: 'create', validator: (v) => ['create', 'edit'].includes(v) },
  project: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['close', 'save'])

const nome = ref('')
const descricao = ref('')
const errors = ref({})

const title = computed(() =>
  props.mode === 'create' ? 'Novo projeto' : 'Editar projeto'
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      nome.value = props.project?.nome || ''
      descricao.value = props.project?.descricao || ''
      errors.value = {}
    }
  }
)

function validate() {
  errors.value = {}
  if (!nome.value || !nome.value.trim()) {
    errors.value.nome = 'Nome obrigatório'
    return false
  }
  return true
}

function onSave() {
  if (!validate()) return
  emit('save', {
    nome: nome.value,
    descricao: descricao.value
  })
}
</script>

<template>
  <BaseModal :open="open" :title="title" subtitle="Projetos">
    <form class="flex flex-col gap-4" @submit.prevent="onSave">
      <BaseInput
        v-model="nome"
        label="Nome"
        placeholder="Ex.: Site X"
        required
        :error="errors.nome"
        autofocus
      />
      <BaseTextarea
        v-model="descricao"
        label="Descrição (opcional)"
        placeholder="Landing page da nova campanha"
        :rows="3"
      />
    </form>
    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
        <BaseButton @click="onSave">Salvar</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
