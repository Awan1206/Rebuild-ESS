<template>
  <div class="md:hidden">
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around h-16"
        style="padding-bottom: env(safe-area-inset-bottom)">

      <template v-for="item in navItems" :key="item.to">
        <!-- Item dengan submenu -->
        <button
          v-if="item.children"
          @click="toggleSubmenu(item)"
          class="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative"
          :class="isGroupActive(item) ? 'text-[#1e3a5f]' : 'text-gray-400'"
        >
          <span class="absolute top-1.5 w-1 h-1 rounded-full bg-[#1e3a5f] transition-opacity"
                :class="isGroupActive(item) ? 'opacity-100' : 'opacity-0'" />
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-[10px] font-semibold tracking-wide">{{ item.label }}</span>
        </button>

        <!-- Item tanpa submenu -->
        <router-link
          v-else
          :to="item.to"
          class="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative"
          :class="isActive(item.to) ? 'text-[#1e3a5f]' : 'text-gray-400'"
        >
          <span class="absolute top-1.5 w-1 h-1 rounded-full bg-[#1e3a5f] transition-opacity"
                :class="isActive(item.to) ? 'opacity-100' : 'opacity-0'" />
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-[10px] font-semibold tracking-wide">{{ item.label }}</span>
        </router-link>
      </template>

    </nav>

    <!-- Overlay gelap -->
    <Transition name="fade">
      <div
        v-if="activeSubmenu"
        class="fixed inset-0 z-40 bg-black/30"
        @click="closeSubmenu"
      />
    </Transition>

    <!-- Submenu Sheet -->
    <Transition name="slide-up">
      <div
        v-if="activeSubmenu"
        class="fixed bottom-16 left-0 right-0 z-50 bg-white rounded-t-2xl overflow-hidden"
        style="padding-bottom: env(safe-area-inset-bottom)"
      >
        <!-- Handle bar -->
        <div class="flex justify-center pt-3 pb-1">
          <div class="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <!-- Header submenu -->
        <div class="px-5 py-3 border-b border-gray-100">
          <p class="text-[13px] font-bold text-[#1a1a2e] tracking-wide">{{ activeSubmenu.label }}</p>
        </div>

        <!-- List item submenu -->
        <div class="py-2">
          <router-link
            v-for="child in activeSubmenu.children"
            :key="child.to"
            :to="child.to"
            @click="closeSubmenu"
            class="flex items-center gap-4 px-5 py-3.5 transition-colors"
            :class="isActive(child.to) ? 'text-[#1e3a5f] bg-blue-50' : 'text-gray-700 hover:bg-gray-50'"
          >
            <component :is="child.icon" class="w-5 h-5 flex-shrink-0" />
            <span class="text-[14px] font-medium">{{ child.label }}</span>
            <span v-if="isActive(child.to)"
                  class="ml-auto w-1.5 h-1.5 rounded-full bg-[#1e3a5f]" />
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeSubmenu = ref(null)

function isActive(to) {
  return route.path === to || route.path.startsWith(to + '/')
}

function isGroupActive(item) {
  return item.children?.some(c => isActive(c.to))
}

function toggleSubmenu(item) {
  activeSubmenu.value = activeSubmenu.value?.label === item.label ? null : item
}

function closeSubmenu() {
  activeSubmenu.value = null
}

// ── Icon builder ──────────────────────────────────────
const icon = (paths) => defineComponent({
  render: () => h('svg', {
    viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', 'stroke-width': '2',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round'
  }, paths.map(([tag, attrs]) => h(tag, attrs)))
})

const IconHome     = icon([['path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }], ['polyline', { points: '9 22 9 12 15 12 15 22' }]])
const IconBranch   = icon([['circle', { cx: '12', cy: '5', r: '3' }], ['circle', { cx: '5', cy: '19', r: '3' }], ['circle', { cx: '19', cy: '19', r: '3' }], ['line', { x1: '12', y1: '8', x2: '5', y2: '16' }], ['line', { x1: '12', y1: '8', x2: '19', y2: '16' }]])
const IconShift    = icon([['circle', { cx: '12', cy: '12', r: '10' }], ['polyline', { points: '12 6 12 12 16 14' }]])
const IconUsers    = icon([['path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }], ['circle', { cx: '9', cy: '7', r: '4' }], ['path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }], ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }]])
const IconRole     = icon([['rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }], ['path', { d: 'M9 9h6M9 12h6M9 15h4' }]])
const IconDept     = icon([['rect', { x: '2', y: '7', width: '20', height: '14', rx: '2' }], ['path', { d: 'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2' }], ['line', { x1: '12', y1: '12', x2: '12', y2: '16' }], ['line', { x1: '10', y1: '14', x2: '14', y2: '14' }]])

// ── Nav items ─────────────────────────────────────────
const navItems = [
  { to: '/dashboard',    label: 'Beranda',  icon: IconHome   },
  { to: '/branch',       label: 'Cabang',   icon: IconBranch },
  { to: '/shift',        label: 'Shift',    icon: IconShift  },
  {
    label: 'Pengguna',
    icon: IconUsers,
    children: [
      { to: '/users/manage',              label: 'Kelola Pengguna',    icon: IconUsers },
      { to: '/users/roles',               label: 'Kelola Role',        icon: IconRole  },
      { to: '/users/department-position', label: 'Dept & Jabatan',     icon: IconDept  },
    ]
  },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.25s ease }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%) }
</style>