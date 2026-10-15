<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePagination } from '@/composables/usePagination'
import { useTasksStore } from '@/stores/tasksStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useStagesStore } from '@/stores/stagesStore'
import { useSubtasksStore } from '@/stores/subtasksStore'
import { selectGlobalSubtasks } from '@/domain/selectors'
import { byName } from '@/domain/filters'
import BaseInput from '@/components/base/BaseInput.vue'
import ProgressBar from '@/components/base/ProgressBar.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import CheckboxInput from '@/components/base/CheckboxInput.vue'
import ListPagination from '@/components/base/ListPagination.vue'

const router = useRouter()
const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()
const stagesStore = useStagesStore()
const subtasksStore = useSubtasksStore()

const filter = ref('')
const status = ref('todas')

const globalSubtasks = computed(() => {
  const all = selectGlobalSubtasks(
    subtasksStore.subtasks,
    tasksStore.tasks,
    projectsStore.projects,
    stagesStore.stages
  )
  let filtered = all.filter((item) => byName(filter.value)(item.subtask))
  if (status.value === 'pendentes') filtered = filtered.filter((i) => !i.subtask.concluida)
  if (status.value === 'concluidas') filtered = filtered.filter((i) => i.subtask.concluida)
  return filtered
})

const { state: pagination, setPage } = usePagination(globalSubtasks, {
  resetOn: [filter, status]
})

function goToSubtask(item) {
  router.push({
    name: 'project',
    params: { projectId: item.project.id },
    query: { tarefa: item.task.id, view: 'kanban' },
    hash: `#sub-${item.subtask.id}`
  })
}

function toggle(item) {
  subtasksStore.toggleSubtask(item.subtask.id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-3">
      <h1 class="text-2xl font-bold">Todas as subtarefas</h1>
      <BaseInput v-model="filter" type="search" placeholder="Filtrar por subtarefa..." />
      <div class="flex gap-2">
        <button
          v-for="s in ['todas', 'pendentes', 'concluidas']"
          :key="s"
          type="button"
          :class="[
            'px-3 py-1.5 text-sm rounded-sm border border-border',
            status === s ? 'bg-primary-soft text-primary-ink' : 'bg-surface text-muted hover:text-text'
          ]"
          @click="status = s"
        >
          {{ s === 'concluidas' ? 'Concluídas' : s === 'pendentes' ? 'Pendentes' : 'Todas' }}
        </button>
      </div>
    </header>

    <div v-if="globalSubtasks.length" class="flex flex-col gap-4">
    <div class="flex flex-col divide-y divide-border border border-border rounded-card">
      <div
        v-for="item in pagination.items"
        :key="item.subtask.id"
        class="flex flex-col sm:flex-row sm:items-center gap-3 p-4"
      >
        <div class="flex items-start gap-2 flex-1">
          <div @click.stop>
            <CheckboxInput
              :checked="item.subtask.concluida"
              :label="`Concluir ${item.subtask.texto}`"
              @change="toggle(item)"
            />
          </div>
          <button
            type="button"
            class="flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            @click="goToSubtask(item)"
          >
            <p class="text-xs text-muted">{{ item.project.nome }} › {{ item.task.titulo }}</p>
            <p :class="['text-sm', item.subtask.concluida ? 'line-through text-muted-2' : '']">
              {{ item.subtask.texto }}
            </p>
          </button>
        </div>
        <div class="flex items-center gap-4 self-end sm:self-center">
          <ProgressBar :done="item.progress.done" :total="item.progress.total" compact />
          <button
            type="button"
            class="text-muted hover:text-text"
            aria-label="Ir para a tarefa"
            @click="goToSubtask(item)"
          >
            →
          </button>
        </div>
      </div>
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
      title="Nenhuma subtarefa"
      message="Crie subtarefas dentro das tarefas dos seus projetos."
      size="compact"
    />
  </div>
</template>
