<template>
  <header class="h-[58px] bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-7 gap-3 sm:gap-4 sticky top-0 z-10">
    <!-- Hamburger: hanya tampil di desktop -->
    <button
      @click="$emit('toggle-sidebar')"
      class="hidden sm:flex p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#1e3a5f] transition-colors flex-shrink-0"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <!-- Logo: hanya tampil di mobile -->
    <div class="flex sm:hidden items-center gap-2 flex-shrink-0">
      <img src="/assets/img/ruas.png" alt="Logo" class="h-7 w-auto object-contain" />
    </div>

    <div class="flex items-center gap-3 sm:gap-4 flex-shrink-0">
      <!-- Notifikasi -->
      <button class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#1e3a5f] transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </button>

      <!-- User -->
      <div class="flex items-center gap-2.5">
        <div class="text-right hidden sm:block">
          <p class="text-[13.5px] font-semibold text-[#1a1a2e] leading-tight">{{ user.name }}</p>
          <p class="text-[11.5px] text-gray-400 leading-tight">{{ user.role }}</p>
        </div>
        <div class="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center overflow-hidden flex-shrink-0">
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
          <span v-else class="text-xs font-bold text-white">{{ initials }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({ name: 'Aditya Pratama', role: 'UI/UX Designer', avatar: null })
  }
})

const initials = computed(() =>
  props.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
)
</script>