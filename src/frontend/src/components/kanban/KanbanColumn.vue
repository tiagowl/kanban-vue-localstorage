<script setup>
import { computed } from 'vue'
import TaskCard from '@/components/kanban/TaskCard.vue'

const props = defineProps({
  stage: { type: Object, required: true },
  tasks: { type: Array, default: () => [] },
  draggingId: { type: String, default: null },
  isDragOver: { type: Boolean, default: false },
  canAdd: { type: Boolean, default: true }
})

const emit = defineEmits(['add-task', 'open-task', 'move', 'drag-start', 'drag-end', 'drag-over', 'drag-leave', 'drop'])

const isEmpty = computed(() => props.tasks.length === 0)
</script>

<template>
  <div
    class="w-[280px] sm:w-[300px] flex-shrink-0 flex flex-col bg-surface-2 rounded-card border border-border overflow-hidden h-full max-h-[calc(100vh-220px)]"
    @dragover.prevent="emit('drag-over', stage.id)"
    @dragleave="emit('drag-leave', stage.id)"
    @drop.prevent="emit('drop', stage.id)"
  >
    <header class="px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h3 class="text-xs font-bold uppercase tracking-wider text-muted">
          {{ stage.nome }}
        </h3>
        <span class="text-xs text-muted-2 tabular-nums">{{ tasks.length }}</span>
      </div>
      <button
        type="button"
        class="text-muted hover:text-text text-sm"
        :aria-label="`Adicionar tarefa em ${stage.nome}`"
        title="Adicionar tarefa"
        @click="emit('add-task')"
      >
        +
      </button>
    </header>

    <div class="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-2">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :dragging="draggingId === task.id"
        @open="emit('open-task', task.id)"
        @drag-start="(e) => emit('drag-start', task.id, e)"
        @drag-end="emit('drag-end')"
      />

      <div
        v-if="isEmpty"
        class="border border-dashed border-border rounded-card py-4 text-center text-xs text-muted-2"
      >
        Sem tarefas
      </div>

      <button
        v-if="canAdd"
        type="button"
        class="border border-dashed border-border rounded-card py-2 text-center text-sm text-muted hover:text-text hover:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @click="emit('add-task')"
      >
        + Adicionar tarefa
      </button>
    </div>

    <div
      v-if="isDragOver"
      class="h-1.5 bg-primary"
      aria-hidden="true"
    />
  </div>
</template>
