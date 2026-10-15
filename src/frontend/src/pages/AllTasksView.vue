<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePagination } from '@/composables/usePagination'
import { useTasksStore } from '@/stores/tasksStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useStagesStore } from '@/stores/stagesStore'
import { useSubtasksStore } from '@/stores/subtasksStore'
import { useLabelsStore } from '@/stores/labelsStore'
import { selectGlobalTasks } from '@/domain/selectors'
import { byName } from '@/domain/filters'
import BaseInput from '@/components/base/BaseInput.vue'
import ProgressBar from '@/components/base/ProgressBar.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import LabelChip from '@/components/base/LabelChip.vue'
import ListPagination from '@/components/base/ListPagination.vue'

const router = useRouter()
const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const stagesStore = useStagesStore()
const subtasksStore = useSubtasksStore()
const labelsStore = useLabelsStore()

const filter = ref('')

const globalTasks = computed(() => {
  const all = selectGlobalTasks(
    tasksStore.tasks,
    projectsStore.projects,
    stagesStore.stages,
    subtasksStore.subtasks,
    labelsStore.taskLabels,
    labelsStore.labels
  )
  return all.filter(byName(filter.value))
})

const { state: pagination, setPage } = usePagination(globalTasks, { resetOn: filter })

function goToTask(vm) {
  router.push({
    name: 'project',
    params: { projectId: vm.project.id },
    query: { tarefa: vm.task.id, view: 'kanban' }
  })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-3">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">Todas as tarefas</h1>
          <p class="text-sm text-muted">
            {{ globalTasks.length }} tarefas
          </p>
        </div>
      </div>
      <BaseInput
        v-model="filter"
        type="search"
        placeholder="Filtrar por nome..."
        label="Buscar"
      />
    </header>

    <div v-if="globalTasks.length" class="flex flex-col gap-4">
    <div class="flex flex-col divide-y divide-border border border-border rounded-card">
      <button
        v-for="vm in pagination.items"
        :key="vm.task.id"
        type="button"
        class="flex flex-col sm:flex-row sm:items-center gap-3 p-4 text-left hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @click="goToTask(vm)"
      >
        <div class="flex-1 flex flex-col gap-1">
          <p class="text-xs text-muted">{{ vm.origem }}</p>
          <h3 class="text-base font-semibold">{{ vm.task.titulo }}</h3>
          <div v-if="vm.labels.length" class="flex flex-wrap gap-1.5">
            <LabelChip v-for="label in vm.labels" :key="label.id" :label="label" />
          </div>
        </div>
        <div class="flex items-center gap-4 self-end sm:self-center">
          <ProgressBar :done="vm.progress.done" :total="vm.progress.total" compact />
          <span aria-hidden="true" class="text-muted">→</span>
        </div>
      </button>
    </div>
    <ListPagination
      :page="pagination.page"
      :page-count="pagination.pageCount"
      :from="pagination.from"
      :to="pagination.to"
      :total="pagination.total"
      @update:page="setPage"
    />
    </div>

    <EmptyState
      v-else
      title="Nenhuma tarefa encontrada"
      :message="filter ? `Não há tarefas para “${filter}”` : 'Crie tarefas em seus projetos'"
      size="compact"
    />
  </div>
</template>
