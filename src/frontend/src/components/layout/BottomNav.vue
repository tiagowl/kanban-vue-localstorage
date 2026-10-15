<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { name: 'projects', label: 'Projetos', glyph: '\u2302' },
  { name: 'all-tasks', label: 'Tarefas', glyph: '\u25A4' },
  { name: 'all-subtasks', label: 'Subtarefas', glyph: '\u2713' }
]

function isActive(name) {
  if (name === 'projects') return route.name === 'projects' || route.name === 'project'
  return route.name === name
}
</script>

<template>
  <nav
    class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border"
    aria-label="Navegação"
  >
    <div class="grid grid-cols-3">
      <RouterLink
        v-for="item in items"
        :key="item.name"
        :to="{ name: item.name }"
        :class="[
          'flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          isActive(item.name) ? 'text-primary font-semibold' : 'text-muted'
        ]"
      >
        <span aria-hidden="true" class="text-base">{{ item.glyph }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
