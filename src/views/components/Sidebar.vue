<template>
  <aside class="w-[185px] min-h-screen bg-white border-r border-gray-100 flex flex-col py-5 flex-shrink-0">
    <div class="flex items-center gap-2 px-5 pb-6">
      <img src="/assets/img/ruas.png" className="w-8 h-8" />
      <span class="font-bold text-sm text-[#1a1a2e]">RUAS ESS</span>
    </div>

    <!-- Nav -->
    <nav class="flex flex-col gap-0.5 flex-1 px-2.5">
      <a
        v-for="item in navItems"
        :key="item.name"
        href="#"
        class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors"
        :class="item.active
          ? 'bg-blue-50 text-[#1e3a5f] font-semibold'
          : 'text-gray-500 hover:bg-gray-50 hover:text-[#1e3a5f]'"
      >
        <span class="flex items-center flex-shrink-0" v-html="item.icon"></span>
        <span>{{ item.name }}</span>
      </a>
    </nav>

    <!-- Footer -->
    <div class="flex flex-col gap-1 px-2.5 pt-4 border-t border-gray-100">
      <button
        class="bg-[#1e3a5f] text-white rounded-lg py-2.5 px-3 text-[13.5px] font-semibold mb-1 hover:bg-[#16304f] transition-colors"
      >
        Clock In/Out
      </button>
      <a href="#" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] text-gray-500 hover:bg-gray-50 transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        Help Center
      </a>
      <a href="#" class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] text-red-400 hover:bg-red-50 transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </a>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const navItems = ref([
  {
    name: 'Dashboard', active: true,
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`
  },
  {
    name: 'Attendance', active: false,
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
  },
  {
    name: 'Leave Requests', active: false,
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg>`
  },
  {
    name: 'Employee Directory', active: false,
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
  {
    name: 'Reports', active: false,
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  },
  {
    name: 'Settings', active: false,
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  },
])
</script>