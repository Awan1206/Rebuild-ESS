<template>
  <aside
  class="hidden md:flex h-screen sticky top-0 bg-white border-r border-gray-100 flex-col py-5 flex-shrink-0 transition-all duration-300 overflow-hidden w-[256px]"
  :class="isOpen ? 'translate-x-0 ml-0' : '-translate-x-full -ml-[256px]'">
    <div class="flex items-center gap-3 px-5 pb-6 select-none">
      <img src="/assets/img/ruas.png" class="w-8 h-8" />
      <span class="text-[18px] font-bold text-md text-[#1a1a2e]">RUAS ESS</span>
    </div>

    <!-- Nav -->
    <nav class="flex flex-col gap-0.5 flex-1 px-2.5 overflow-y-auto">
      <template v-for="item in navItems" :key="item.name">

        <!-- Item with submenu -->
        <div v-if="item.children">
          <button
            @click="toggleMenu(item.name)"
            class="w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors"
            :class="isParentActive(item)
              ? 'bg-blue-50 text-[#1e3a5f] font-semibold'
              : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e3a5f]'"
          >
            <span class="flex items-center gap-2.5">
              <span class="flex items-center flex-shrink-0" v-html="item.icon"></span>
              <span>{{ item.name }}</span>
            </span>
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              class="transition-transform duration-200 flex-shrink-0"
              :class="openMenus[item.name] ? 'rotate-180' : ''"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <!-- Submenu -->
          <div
            class="overflow-hidden transition-all duration-200"
            :class="openMenus[item.name] ? 'max-h-96' : 'max-h-0'"
          >
            <div class="flex flex-col gap-0.5 mt-0.5 pl-[25px]">
              <router-link
                v-for="child in item.children"
                :key="child.name"
                :to="child.path"
                class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors"
                :class="route.path === child.path
                  ? 'bg-blue-50 text-[#1e3a5f] font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e3a5f]'"
              >
                <span class="flex items-center flex-shrink-0" v-html="child.icon"></span>
                {{ child.name }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- Regular item -->
        <router-link
          v-else
          :to="item.path"
          class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors"
          :class="route.path === item.path
            ? 'bg-blue-50 text-[#1e3a5f] font-semibold'
            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e3a5f]'"
        >
          <span class="flex items-center flex-shrink-0" v-html="item.icon"></span>
          <span>{{ item.name }}</span>
        </router-link>

      </template>
    </nav>

    <!-- Footer -->
    <div class="flex flex-col gap-1 px-2.5 pt-4 border-t border-gray-100">
      <button @click="handleLogout" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] text-red-400 hover:bg-red-50 transition-colors w-full">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useSidebar } from '@/composables/layout/useSidebar.js'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const {
  route,
  navItems,
  openMenus,
  isParentActive,
  toggleMenu,
  handleLogout,
} = useSidebar()
</script>