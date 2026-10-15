<script setup>
import { computed } from 'vue'
import { useProjectsStore } from '@/stores/projectsStore'
import { useStagesStore } from '@/stores/stagesStore'
import { useSubtasksStore } from '@/stores/subtasksStore'
import { useLabelsStore } from '@/stores/labelsStore'
import { selectTaskProgress, selectTaskLabels } from '@/domain/selectors'
import ProgressBar from '@/components/base/ProgressBar.vue'
import LabelChip from '@/components/base/LabelChip.vue'

const props = defineProps({
  task: { type: Object, required: true },
  dragging: { type: Boolean, default: false }
})

const emit = defineEmits(['open', 'drag-start', 'drag-end'])

const subtasksStore = useSubtasksStore()
const labelsStore = useLabelsStore()

const progress = computed(() =>
  selectTaskProgress(props.task, subtasksStore.subtasks)
)

const labels = computed(() =>
  selectTaskLabels(props.task, labelsStore.taskLabels, labelsStore.labels)
)
</script>

<template>
  <article
    :class="[
      'card p-4 cursor-move focus-within:ring-2 focus-within:ring-primary transition-all',
      dragging ? 'opacity-40 rotate-1' : '',
      task._anchor ? 'ring-2 ring-primary shadow' : ''
    ]"
    draggable="true"
    tabindex="0"
    role="button"
    :aria-label="`Abrir tarefa ${task.titulo}`"
    @click="emit('open')"
    @keydown.enter.prevent="emit('open')"
    @dragstart="(e) => emit('drag-start', task.id, e)"
    @dragend="emit('drag-end')"
  >
    <h4 class="text-base font-semibold line-clamp-2">{{ task.titulo }}</h4>

    <div v-if="labels.length" class="mt-2 flex flex-wrap gap-1.5">
      <LabelChip v-for="label in labels" :key="label.id" :label="label" />
    </div>

    <div class="mt-3">
      <ProgressBar :done="progress.done" :total="progress.total" compact />
    </div>
  </article>
</template>
