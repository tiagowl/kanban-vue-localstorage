<script setup>
import BaseButton from '@/components/base/BaseButton.vue'
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center gap-4">
    <h1 class="text-2xl font-bold">Página não encontrada</h1>
    <p class="text-muted">A página que você procura não existe ou foi movida.</p>
    <BaseButton @click="$router.push({ name: 'projects' })">Voltar para projetos</BaseButton>
  </div>
</template>
