<script setup>
import Topbar from './Topbar.vue'
import BottomNav from './BottomNav.vue'
import AppToast from '@/components/base/AppToast.vue'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'
import NoticeDialog from '@/components/base/NoticeDialog.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Topbar />
    <main class="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 pb-24 lg:pb-6">
      <slot />
    </main>
    <BottomNav />
    <AppToast />
    <ConfirmDialog />
    <NoticeDialog />
  </div>
</template>
