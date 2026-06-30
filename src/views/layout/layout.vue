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
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import BottomNav from '@/components/layout/BotNav.vue'
import Footer from '@/components/layout/Footer.vue'
import { useLayout } from '@/composables/layout/useLayout.js'

const { sidebarOpen, currentUser, toggleSidebar } = useLayout()
</script>