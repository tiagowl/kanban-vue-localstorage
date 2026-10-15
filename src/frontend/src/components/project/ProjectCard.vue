<script setup>
import ProgressBar from '@/components/base/ProgressBar.vue'

defineProps({
  project: { type: Object, required: true },
  stageCount: { type: Number, default: 0 },
  taskCount: { type: Number, default: 0 },
  progress: { type: Object, default: () => ({ done: 0, total: 0 }) }
})

const emit = defineEmits(['open', 'edit', 'remove'])
</script>

<template>
  <article class="card flex flex-col group">
    <div class="flex items-start justify-between gap-2">
      <button
        type="button"
        class="text-left flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        @click="emit('open')"
      >
        <h3 class="text-base font-bold line-clamp-1">{{ project.nome }}</h3>
      </button>
      <div class="flex gap-1">
        <button
          type="button"
          class="icon-btn w-8 h-8"
          :aria-label="`Editar ${project.nome}`"
          title="Editar projeto"
          @click="emit('edit')"
        >
          <span aria-hidden="true">&#x270E;</span>
        </button>
        <button
          type="button"
          class="icon-btn w-8 h-8"
          :aria-label="`Excluir ${project.nome}`"
          title="Excluir projeto"
          @click="emit('remove')"
        >
          <span aria-hidden="true">&#x2715;</span>
        </button>
      </div>
    </div>

    <p v-if="project.descricao" class="mt-1.5 text-sm text-muted line-clamp-2">
      {{ project.descricao }}
    </p>

    <p class="mt-3 text-xs text-muted-2">
      {{ stageCount }} etapas · {{ taskCount }} tarefas
    </p>

    <div class="mt-2">
      <ProgressBar :done="progress.done" :total="progress.total" />
    </div>

    <button
      type="button"
      class="mt-4 btn btn-sm self-start"
      @click="emit('open')"
    >
      Abrir projeto
      <span aria-hidden="true">→</span>
    </button>
  </article>
</template>
