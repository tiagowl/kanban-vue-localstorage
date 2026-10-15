<script setup>
import { ref } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import { useDragDrop } from '@/composables/useDragDrop'

const props = defineProps({
  stages: { type: Array, default: () => [] },
  tasksByStage: { type: Function, required: true }
})

const emit = defineEmits(['add-stage', 'add-task', 'open-task', 'move-task'])

const { draggingId, dragOverStageId, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop } =
  useDragDrop((taskId, stageId) => {
    emit('move-task', taskId, stageId)
  })

function onAddTask(stage) {
  emit('add-task', stage.id)
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
    <KanbanColumn
      v-for="stage in stages"
      :key="stage.id"
      :stage="stage"
      :tasks="tasksByStage(stage.id)"
      :dragging-id="draggingId"
      :is-drag-over="dragOverStageId === stage.id"
      @add-task="onAddTask(stage)"
      @open-task="(id) => emit('open-task', id)"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
      @drag-over="onDragOver"
      @drag-leave="onDragLeave"
      @drop="onDrop"
    />
  </div>
</template>
