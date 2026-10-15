<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projectsStore'
import { useStagesStore } from '@/stores/stagesStore'
import { useTasksStore } from '@/stores/tasksStore'
import { useSubtasksStore } from '@/stores/subtasksStore'
import { useLabelsStore } from '@/stores/labelsStore'
import { selectTaskProgress } from '@/domain/selectors'
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectForm from '@/components/project/ProjectForm.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const router = useRouter()
const projectsStore = useProjectsStore()
const stagesStore = useStagesStore()
const tasksStore = useTasksStore()
const subtasksStore = useSubtasksStore()
const { confirm } = useConfirm()
const { success, error } = useToast()

const formOpen = ref(false)
const formMode = ref('create')
const editing = ref(null)

const projects = computed(() => projectsStore.projects)

function openCreate() {
  formMode.value = 'create'
  editing.value = null
  formOpen.value = true
}

function openEdit(project) {
  formMode.value = 'edit'
  editing.value = project
  formOpen.value = true
}

function closeForm() {
  formOpen.value = false
  editing.value = null
}

function projectProgress(projectId) {
  const tasks = tasksStore.tasks.filter((t) => t.projectId === projectId)
  if (!tasks.length) return { done: 0, total: 0 }
  let done = 0
  let total = 0
  for (const t of tasks) {
    const p = selectTaskProgress(t, subtasksStore.subtasks)
    done += p.done
    total += p.total
  }
  return { done, total: total || tasks.length }
}

function goToProject(id) {
  router.push({ name: 'project', params: { projectId: id } })
}

async function handleSave(payload) {
  if (formMode.value === 'create') {
    const res = projectsStore.addProject(payload)
    if (res.ok) {
      success('Projeto criado')
      closeForm()
    } else {
      error(res.error || 'Erro ao criar projeto')
    }
  } else if (editing.value) {
    const res = projectsStore.updateProject(editing.value.id, payload)
    if (res.ok) {
      success('Projeto atualizado')
      closeForm()
    } else {
      error(res.error || 'Erro ao editar projeto')
    }
  }
}

async function removeProject(project) {
  const stagesCount = stagesStore.stages.filter((s) => s.projectId === project.id).length
  const tasksCount = tasksStore.tasks.filter((t) => t.projectId === project.id).length
  const subtasksCount = subtasksStore.subtasks.filter((s) => {
    const t = tasksStore.tasks.find((x) => x.id === s.taskId)
    return t && t.projectId === project.id
  }).length

  const ok = await confirm({
    title: `Excluir projeto "${project.nome}"?`,
    message: 'Esta ação excluirá em cascata:',
    consequences: [
      `${stagesCount} etapas`,
      `${tasksCount} tarefas e ${subtasksCount} subtarefas`
    ]
  })

  if (ok) {
    projectsStore.removeProject(project.id)
    success('Projeto excluído')
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Meus projetos</h1>
        <p class="text-sm text-muted">{{ projects.length }} projetos</p>
      </div>
      <BaseButton @click="openCreate">
        <span aria-hidden="true">+</span>
        Novo projeto
      </BaseButton>
    </header>

    <div
      v-if="projects.length"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :stage-count="stagesStore.stages.filter((s) => s.projectId === project.id).length"
        :task-count="tasksStore.tasks.filter((t) => t.projectId === project.id).length"
        :progress="projectProgress(project.id)"
        @open="goToProject(project.id)"
        @edit="openEdit(project)"
        @remove="removeProject(project)"
      />
    </div>

    <EmptyState
      v-else
      title="Nenhum projeto ainda"
      message="Crie seu primeiro projeto para começar."
      size="md"
    >
      <template #icon>K</template>
      <template #action>
        <BaseButton @click="openCreate">Criar primeiro projeto</BaseButton>
      </template>
    </EmptyState>

    <ProjectForm
      :open="formOpen"
      :mode="formMode"
      :project="editing"
      @close="closeForm"
      @save="handleSave"
    />
  </div>
</template>
