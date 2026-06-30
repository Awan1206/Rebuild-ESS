<template>
  <div class="md:hidden">
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around h-16"
        style="padding-bottom: env(safe-area-inset-bottom)">

      <!-- Beranda -->
      <router-link
        to="/dashboard"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative"
        :class="isActive('/dashboard') ? 'text-[#1e3a5f]' : 'text-gray-400'"
      >
        <span class="absolute top-1.5 w-1 h-1 rounded-full bg-[#1e3a5f] transition-opacity"
              :class="isActive('/dashboard') ? 'opacity-100' : 'opacity-0'" />
        <component :is="IconHome" class="w-5 h-5" />
        <span class="text-[10px] font-semibold tracking-wide">Beranda</span>
      </router-link>

      <!-- Attendance -->
      <button
        @click="toggleSubmenu(attendanceMenu)"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative"
        :class="isGroupActive(attendanceMenu) ? 'text-[#1e3a5f]' : 'text-gray-400'"
      >
        <span class="absolute top-1.5 w-1 h-1 rounded-full bg-[#1e3a5f] transition-opacity"
              :class="isGroupActive(attendanceMenu) ? 'opacity-100' : 'opacity-0'" />
        <component :is="IconAttendance" class="w-5 h-5" />
        <span class="text-[10px] font-semibold tracking-wide">Attendance</span>
      </button>

      <!-- All (Hamburger) -->
      <button
        @click="toggleSubmenu(allMenu)"
        class="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative"
        :class="isAllActive ? 'text-[#1e3a5f]' : 'text-gray-400'"
      >
        <span class="absolute top-1.5 w-1 h-1 rounded-full bg-[#1e3a5f] transition-opacity"
              :class="isAllActive ? 'opacity-100' : 'opacity-0'" />
        <component :is="IconMenu" class="w-5 h-5" />
        <span class="text-[10px] font-semibold tracking-wide">All</span>
      </button>

    </nav>

    <!-- Overlay -->
    <Transition name="fade">
      <div
        v-if="activeSubmenu"
        class="fixed inset-0 z-30 bg-black/30"
        @click="closeSubmenu"
      />
    </Transition>

    <!-- Submenu Sheet -->
    <Transition name="slide-up">
      <div
        v-if="activeSubmenu"
        class="fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl overflow-hidden pb-16"
        style="padding-bottom: calc(4rem + env(safe-area-inset-bottom))"
      >
        <!-- Handle bar -->
        <div class="flex justify-center pt-3 pb-1">
          <div class="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <!-- Header -->
        <div class="px-5 py-3 border-b border-gray-100">
          <p class="text-[13px] font-bold text-[#1a1a2e] tracking-wide">{{ activeSubmenu.label }}</p>
        </div>

        <!-- Items -->
        <div class="py-2 overflow-y-auto max-h-[60vh]">
          <template v-for="item in activeSubmenu.children" :key="item.to ?? item.label">

            <!-- Group header (untuk menu All) -->
            <template v-if="item.isGroup">
              <p class="px-5 pt-4 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {{ item.label }}
              </p>
              <router-link
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                @click="closeSubmenu"
                class="flex items-center gap-4 px-5 py-3 transition-colors"
                :class="isActive(child.to) ? 'text-[#1e3a5f] bg-blue-50' : 'text-gray-700 hover:bg-gray-50'"
              >
                <component :is="child.icon" class="w-5 h-5 flex-shrink-0" />
                <span class="text-[14px] font-medium">{{ child.label }}</span>
                <span v-if="isActive(child.to)" class="ml-auto w-1.5 h-1.5 rounded-full bg-[#1e3a5f]" />
              </router-link>
            </template>

            <!-- Item biasa -->
            <router-link
              v-else
              :to="item.to"
              @click="closeSubmenu"
              class="flex items-center gap-4 px-5 py-3.5 transition-colors"
              :class="isActive(item.to) ? 'text-[#1e3a5f] bg-blue-50' : 'text-gray-700 hover:bg-gray-50'"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span class="text-[14px] font-medium">{{ item.label }}</span>
              <span v-if="isActive(item.to)" class="ml-auto w-1.5 h-1.5 rounded-full bg-[#1e3a5f]" />
            </router-link>

          </template>

          <!-- Logout Button (hanya untuk menu All) -->
          <div v-if="activeSubmenu.label === 'Semua Menu'" class="border-t border-gray-100 mt-2 pt-2">
            <button
              @click="handleLogout"
              class="flex items-center gap-4 px-5 py-3.5 w-full transition-colors text-red-500 hover:bg-red-50"
            >
              <component :is="IconLogout" class="w-5 h-5 flex-shrink-0" />
              <span class="text-[14px] font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useBotNav } from '@/composables/layout/useBotNav.js'

const {
  activeSubmenu,
  attendanceMenu,
  allMenu,
  isActive,
  isGroupActive,
  isAllActive,
  toggleSubmenu,
  closeSubmenu,
  handleLogout,
  IconHome,
  IconAttendance,
  IconMenu,
  IconLogout,
} = useBotNav()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.25s ease }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%) }
</style>