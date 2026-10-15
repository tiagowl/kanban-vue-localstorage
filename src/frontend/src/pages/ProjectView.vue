<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projectsStore'
import { useStagesStore } from '@/stores/stagesStore'
import { useTasksStore } from '@/stores/tasksStore'
import { useSubtasksStore } from '@/stores/subtasksStore'
import { useUiStore } from '@/stores/uiStore'
import { useAnchor } from '@/composables/useAnchor'
import { useToast } from '@/composables/useToast'
import BaseButton from '@/components/base/BaseButton.vue'
import SegmentedControl from '@/components/base/SegmentedControl.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'
import TaskDrawer from '@/components/task/TaskDrawer.vue'
import TaskForm from '@/components/task/TaskForm.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const stagesStore = useStagesStore()
const tasksStore = useTasksStore()
const subtasksStore = useSubtasksStore()
const uiStore = useUiStore()
const { success, error } = useToast()
const { activeAnchor, highlight } = useAnchor()

const view = ref('kanban')
const taskFormOpen = ref(false)
const taskFormStageId = ref('')
const taskFormMode = ref('create')
const stageFormOpen = ref(false)
const newStageName = ref('')
const stageError = ref('')

const projectId = computed(() => route.params.projectId)
const project = computed(() => projectsStore.byId(projectId.value))
const stages = computed(() => stagesStore.byProject(projectId.value))
const tasksByStage = (stageId) => tasksStore.byStage(stageId)

watch(
  () => route.query.view,
  (qv) => {
    if (qv === 'lista') view.value = 'lista'
    else view.value = 'kanban'
  },
  { immediate: true }
)

watch(view, (v) => {
  if (route.query.view === v) return
  router.replace({ query: { ...route.query, view: v }, hash: route.hash })
})

watch(
  () => route.query.tarefa,
  (taskId) => {
    if (typeof taskId !== 'string' || !taskId) return
    view.value = 'kanban'
    uiStore.openDrawer(taskId)
    const anchor = route.hash.startsWith('#') ? route.hash.slice(1) : ''
    if (anchor) highlight(anchor)
  },
  { immediate: true }
)

function openTask(id) {
  uiStore.openDrawer(id)
  if (route.query.tarefa === id && !route.hash) return
  const query = { ...route.query, tarefa: id, view: 'kanban' }
  router.replace({ query, hash: '' })
}

function closeDrawer() {
  uiStore.closeDrawer()
  if (!route.query.tarefa && !route.hash) return
  const query = { ...route.query }
  delete query.tarefa
  router.replace({ query, hash: '' })
}

onBeforeUnmount(() => {
  uiStore.closeDrawer()
})

function openNewTask(stageId) {
  taskFormMode.value = 'create'
  taskFormStageId.value = stageId || stages.value[0]?.id
  taskFormOpen.value = true
}

function closeTaskForm() {
  taskFormOpen.value = false
}

function handleSaveTask(payload) {
  tasksStore.addTask({
    titulo: payload.titulo,
    descricao: payload.descricao,
    stageId: payload.stageId,
    projectId: projectId.value
  })
  success('Tarefa criada')
  closeTaskForm()
}

function moveTask(taskId, stageId) {
  tasksStore.moveTask(taskId, stageId)
}

function openNewStage() {
  newStageName.value = ''
  stageError.value = ''
  stageFormOpen.value = true
}

function closeStageForm() {
  stageFormOpen.value = false
}

function saveStage() {
  const res = stagesStore.addStage({
    nome: newStageName.value,
    projectId: projectId.value
  })
  if (res.ok) {
    success('Etapa criada')
    closeStageForm()
  } else {
    stageError.value = res.error
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-3">
      <RouterLink
        :to="{ name: 'projects' }"
        class="text-sm text-muted hover:text-text self-start"
      >
        ← Projetos / {{ project?.nome || 'Projeto' }}
      </RouterLink>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">{{ project?.nome }}</h1>
          <p v-if="project?.descricao" class="text-sm text-muted">
            {{ project.descricao }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <SegmentedControl
            v-model="view"
            :options="[
              { label: 'Kanban', value: 'kanban' },
              { label: 'Lista', value: 'lista' }
            ]"
          />
          <BaseButton variant="secondary" @click="openNewStage">
            + Nova etapa
          </BaseButton>
          <BaseButton :disabled="!stages.length" @click="() => openNewTask()">
            + Nova tarefa
          </BaseButton>
        </div>
      </div>
    </header>

    <KanbanBoard
      v-if="view === 'kanban'"
      :stages="stages"
      :tasks-by-stage="tasksByStage"
      @add-task="openNewTask"
      @open-task="openTask"
      @move-task="moveTask"
    />

    <div v-else class="card p-4">
      <p class="text-sm text-muted">Visão lista em construção (mantida fiel ao wireframe).</p>
    </div>

    <EmptyState
      v-if="!stages.length"
      title="Crie a primeira etapa"
      message="As etapas definem as colunas do kanban."
      size="compact"
    >
      <template #action>
        <BaseButton @click="openNewStage">+ Nova etapa</BaseButton>
      </template>
    </EmptyState>

    <TaskDrawer
      :open="uiStore.drawerOpen"
      :task-id="uiStore.drawerTaskId"
      :highlight-id="activeAnchor"
      @close="closeDrawer"
    />
    <TaskForm
      :open="taskFormOpen"
      :mode="taskFormMode"
      :stages="stages"
      :stage-id="taskFormStageId"
      @close="closeTaskForm"
      @save="handleSaveTask"
    />

    <BaseModal :open="stageFormOpen" title="Nova etapa" @close="closeStageForm">
      <form class="flex flex-col gap-4" @submit.prevent="saveStage">
        <BaseInput
          v-model="newStageName"
          label="Nome da etapa"
          required
          :error="stageError"
          autofocus
        />
      </form>
      <template #footer>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <BaseButton variant="secondary" @click="closeStageForm">Cancelar</BaseButton>
          <BaseButton @click="saveStage">Salvar</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
