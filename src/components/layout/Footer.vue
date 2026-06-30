<template>
  <footer class="p-3 text-center text-xs text-gray-500">
    <p>&copy; {{ currentYear }} PT Rezeki Utami Sejahtera.</p>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const currentYear = computed(() => new Date().getFullYear())
</script>