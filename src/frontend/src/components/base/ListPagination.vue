<script setup>
defineProps({
  page: { type: Number, required: true },
  pageCount: { type: Number, required: true },
  from: { type: Number, default: 0 },
  to: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
})

const emit = defineEmits(['update:page'])
</script>

<template>
  <nav
    v-if="pageCount > 1"
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    aria-label="Paginação"
  >
    <p class="text-sm text-muted">{{ from }}–{{ to }} de {{ total }}</p>
    <div class="flex flex-wrap items-center gap-1">
      <button
        type="button"
        class="btn btn-sm"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      >
        Anterior
      </button>
      <button
        v-for="n in pageCount"
        :key="n"
        type="button"
        :class="n === page ? 'btn-primary btn-sm' : 'btn btn-sm'"
        :aria-current="n === page ? 'page' : undefined"
        :aria-label="`Página ${n}`"
        @click="emit('update:page', n)"
      >
        {{ n }}
      </button>
      <button
        type="button"
        class="btn btn-sm"
        :disabled="page >= pageCount"
        @click="emit('update:page', page + 1)"
      >
        Próxima
      </button>
    </div>
  </nav>
</template>
