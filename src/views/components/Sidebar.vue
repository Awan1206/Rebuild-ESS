<template>
  <aside
  class="hidden md:flex h-screen sticky top-0 bg-white border-r border-gray-100 flex-col py-5 flex-shrink-0 transition-all duration-300 overflow-hidden w-[256px]"
  :class="isOpen ? 'translate-x-0 ml-0' : '-translate-x-full -ml-[256px]'">
    <div class="flex items-center gap-2 px-5 pb-6">
      <img src="/assets/img/ruas.png" className="w-8 h-8" />
      <span class="font-bold text-sm text-[#1a1a2e]">RUAS ESS</span>
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
            <div class="flex flex-col gap-0.5 mt-0.5 pl-[34px]">
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
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const route = useRoute()
const router = useRouter()

const navItems = ref([
  {
    name: 'Dashboard', path: '/dashboard',
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`
  },
  {
    name: 'Attendance',
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    children: [
      {
        name: 'Timesheet', path: '/attendance',
        icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
      },
      {
        name: 'Monitor', path: '/attendance/monitor',
        icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
      },
      {
        name: 'Review', path: '/attendance/review',
        icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`
      },
    ]
  },
  {
    name: 'Manage Branch',
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    children: [
      {
        name: 'Branch', path: '/branch',
        icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`
      },
      {
        name: 'Shift', path: '/shift',
        icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
      },
    ]
  },
  {
    name: 'Users',
    icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    children: [
      {
        name: 'Manage Users', path: '/users/manage',
        icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
      },
      {
        name: 'Manage Roles', path: '/users/roles',
        icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
      },
      {
        name: 'Manage Department & Position', path: '/users/department-position',
        icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="6" height="14"/><rect x="9" y="3" width="6" height="18"/><rect x="16" y="10" width="6" height="11"/></svg>`
      },
    ]
  },
])

// Track which dropdown menus are open
const openMenus = reactive({})

function isParentActive(item) {
  return item.children?.some(c => c.path === route.path)
}

function syncOpenMenus() {
  navItems.value.forEach(item => {
    if (item.children && isParentActive(item)) {
      openMenus[item.name] = true
    }
  })
}

// Auto-open menu if one of its children matches the current route
syncOpenMenus()
watch(() => route.path, syncOpenMenus)

function toggleMenu(name) {
  openMenus[name] = !openMenus[name]
}

function handleLogout() {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>