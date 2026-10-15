<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { saveStatus } from '@/utils/saveStatus'

const route = useRoute()

const items = [
  { name: 'projects', label: 'Projetos', full: 'Projetos' },
  { name: 'all-tasks', label: 'Tarefas', full: 'Todas as Tarefas' },
  { name: 'all-subtasks', label: 'Subtarefas', full: 'Todas as Subtarefas' }
]

const statusText = computed(() => {
  switch (saveStatus.value) {
    case 'saving':
      return 'salvando…'
    case 'saved':
      return 'salvo agora'
    case 'error':
      return 'erro ao salvar'
    case 'unavailable':
      return 'armazenamento indisponível'
    default:
      return ''
  }
})

function isActive(name) {
  if (name === 'projects') return route.name === 'projects' || route.name === 'project'
  return route.name === name
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-border">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center gap-4">
      <RouterLink
        :to="{ name: 'projects' }"
        class="flex items-center gap-2 font-bold shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span
          class="w-7 h-7 rounded-sm bg-primary text-white flex items-center justify-center"
          aria-hidden="true"
        >
          K
        </span>
        <span class="hidden sm:inline">Kanban Local</span>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-1" aria-label="Navegação principal">
        <RouterLink
          v-for="item in items"
          :key="item.name"
          :to="{ name: item.name }"
          :class="[
            'px-3 py-1.5 text-sm rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            isActive(item.name)
              ? 'bg-primary-soft text-primary-ink'
              : 'text-muted hover:text-text'
          ]"
        >
          <span class="lg:hidden">{{ item.label }}</span>
          <span class="hidden lg:inline">{{ item.full }}</span>
        </RouterLink>
      </nav>

      <span
        class="ml-auto text-xs whitespace-nowrap"
        :class="
          saveStatus === 'error' || saveStatus === 'unavailable'
            ? 'text-warning'
            : 'text-muted-2'
        "
        aria-live="polite"
      >
        {{ statusText }}
      </span>
    </div>
  </header>
</template>
