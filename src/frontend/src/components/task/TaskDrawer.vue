<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasksStore'
import { useSubtasksStore } from '@/stores/subtasksStore'
import { useStagesStore } from '@/stores/stagesStore'
import { useLabelsStore } from '@/stores/labelsStore'
import { selectTaskProgress, selectTaskLabels } from '@/domain/selectors'
import { useConfirm } from '@/composables/useConfirm'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import CheckboxInput from '@/components/base/CheckboxInput.vue'
import ProgressBar from '@/components/base/ProgressBar.vue'
import LabelChip from '@/components/base/LabelChip.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  taskId: { type: String, default: null },
  highlightId: { type: String, default: '' }
})

const emit = defineEmits(['close'])

const router = useRouter()
const tasksStore = useTasksStore()
const subtasksStore = useSubtasksStore()
const stagesStore = useStagesStore()
const labelsStore = useLabelsStore()
const { confirm } = useConfirm()

const subtaskText = ref('')
const saving = ref(false)

const task = computed(() =>
  props.taskId ? tasksStore.tasks.find((t) => t.id === props.taskId) : null
)
const subtasks = computed(() =>
  task.value ? subtasksStore.byTask(task.value.id) : []
)
const progress = computed(() =>
  task.value ? selectTaskProgress(task.value, subtasksStore.subtasks) : { done: 0, total: 0 }
)
const labels = computed(() =>
  task.value ? selectTaskLabels(task.value, labelsStore.taskLabels, labelsStore.labels) : []
)
const stage = computed(() =>
  task.value ? stagesStore.stages.find((s) => s.id === task.value.stageId) : null
)
const project = computed(() => {
  if (!task.value) return null
  return router.currentRoute.value.params.projectId
    ? { id: router.currentRoute.value.params.projectId }
    : null
})

watch(() => props.open, (isOpen) => {
  if (!isOpen) subtaskText.value = ''
})

function addSubtask() {
  if (!subtaskText.value.trim() || !task.value) return
  subtasksStore.addSubtask({ taskId: task.value.id, texto: subtaskText.value })
  subtaskText.value = ''
}

async function removeTask() {
  if (!task.value) return
  const count = subtasks.value.length
  const ok = await confirm({
    title: 'Excluir tarefa?',
    message: `A tarefa e suas ${count} subtarefas serão excluídas.`,
    consequences: ['Esta ação não pode ser desfeita']
  })
  if (ok) {
    tasksStore.removeTask(task.value.id)
    subtasksStore.removeByTask(task.value.id)
    emit('close')
  }
}

function moveTaskTo(stageId) {
  if (task.value && stageId !== task.value.stageId) {
    tasksStore.moveTask(task.value.id, stageId)
  }
}

function toggleSubtask(id) {
  subtasksStore.toggleSubtask(id)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && task"
      class="fixed inset-0 z-50 bg-slate-900/40"
      role="presentation"
      @click.self="emit('close')"
    >
      <aside
        class="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-surface shadow-lg flex flex-col"
        role="dialog"
        aria-modal="true"
        :aria-label="task.titulo"
      >
        <header class="px-5 py-3 border-b border-border flex items-start justify-between gap-3">
          <div>
            <p class="text-xs text-muted">Projeto › {{ stage?.nome || 'Etapa' }}</p>
            <h2 class="text-lg font-bold mt-0.5">{{ task.titulo }}</h2>
          </div>
          <button
            type="button"
            class="icon-btn"
            aria-label="Fechar"
            @click="emit('close')"
          >
            <span aria-hidden="true">&#x2715;</span>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          <section>
            <h3 class="label">Descrição</h3>
            <p class="text-sm text-muted whitespace-pre-wrap">
              {{ task.descricao || 'Sem descrição' }}
            </p>
          </section>

          <section>
            <div class="flex items-center justify-between">
              <h3 class="label">Subtarefas</h3>
              <ProgressBar :done="progress.done" :total="progress.total" compact />
            </div>
            <ul class="mt-2 flex flex-col divide-y divide-border border border-border rounded-sm">
              <li
                v-for="subtask in subtasks"
                :id="`sub-${subtask.id}`"
                :key="subtask.id"
                :class="[
                  'flex items-start gap-2 p-2',
                  props.highlightId === `sub-${subtask.id}` ? 'ring-2 ring-primary rounded-sm' : ''
                ]"
              >
                <CheckboxInput
                  :checked="subtask.concluida"
                  :label="`Concluir ${subtask.texto}`"
                  @change="toggleSubtask(subtask.id)"
                />
                <span
                  :class="[
                    'flex-1 text-sm',
                    subtask.concluida ? 'line-through text-muted-2' : ''
                  ]"
                >
                  {{ subtask.texto }}
                </span>
              </li>
              <li v-if="!subtasks.length" class="p-2 text-sm text-muted-2">
                Sem subtarefas
              </li>
            </ul>
            <div class="mt-2 flex gap-2">
              <BaseInput
                v-model="subtaskText"
                placeholder="Adicionar subtarefa"
                @enter="addSubtask"
              />
              <BaseButton :disabled="!subtaskText.trim()" @click="addSubtask">
                Adicionar
              </BaseButton>
            </div>
          </section>

          <section>
            <h3 class="label">Mover para</h3>
            <select
              class="input"
              :value="stage?.id"
              @change="(e) => moveTaskTo(e.target.value)"
            >
              <option
                v-for="s in stagesStore.stages.filter((x) => x.projectId === task.projectId)"
                :key="s.id"
                :value="s.id"
              >
                {{ s.nome }}
              </option>
            </select>
          </section>
        </div>

        <footer class="px-5 py-3 border-t border-border">
          <BaseButton variant="danger" @click="removeTask">Excluir tarefa</BaseButton>
        </footer>
      </aside>
    </div>
  </Teleport>
</template>
