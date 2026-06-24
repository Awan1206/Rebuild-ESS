<template>
  <div class="flex h-screen w-full overflow-x-hidden">
    <Sidebar :is-open="sidebarOpen" />

    <div class="flex flex-col flex-1 h-screen overflow-hidden">
      <Header :user="currentUser" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 overflow-y-auto">
        <div class="p-7 bg-gray-50 min-h-full pb-24 md:pb-7">
          <router-view :user="currentUser" />
        </div>
      </main>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'
import BottomNav from '../components/BotNav.vue'

const sidebarOpen = ref(true)

const currentUser = ref(
  JSON.parse(localStorage.getItem('user') || 'null') || {
    name: 'Awan',
    role: 'Developer',
    avatar: null,
  }
)
</script>