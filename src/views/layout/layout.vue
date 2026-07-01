<template>
  <div class="flex h-screen w-full overflow-x-hidden">
    <Sidebar :is-open="sidebarOpen" />

    <div class="flex flex-col flex-1 h-screen overflow-hidden">
      <Header :user="currentUser" @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div class="flex flex-col min-h-full">
          <div class="p-7 bg-gray-50 flex-1">
            <router-view :user="currentUser" />
          </div>
          <Footer />
        </div>
      </main>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { useLayout } from '@/composables/layout/useLayout.js'

// Lazy load semua komponen layout
const Sidebar  = defineAsyncComponent(() => import('@/components/layout/Sidebar.vue'))
const Header   = defineAsyncComponent(() => import('@/components/layout/Header.vue'))
const BottomNav = defineAsyncComponent(() => import('@/components/layout/BotNav.vue'))
const Footer   = defineAsyncComponent(() => import('@/components/layout/Footer.vue'))

const { sidebarOpen, currentUser, toggleSidebar } = useLayout()
</script>