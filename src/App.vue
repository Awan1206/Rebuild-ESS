<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex flex-col flex-1 overflow-hidden">
      <Header :user="currentUser" />
      <main class="flex-1 overflow-y-auto">
        <Dashboard :user="currentUser"/>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './views/components/Sidebar.vue'
import Header from './views/components/Header.vue'
import Dashboard from './views/Dashboard.vue'

const currentUser = ref({
  name: 'Abhista',
  role: 'Web Developer',
  avatar: null,
})
</script>