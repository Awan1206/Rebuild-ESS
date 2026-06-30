import { ref, computed, defineComponent, h, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// ── Icon builder ──────────────────────────────────────
const icon = (paths) => markRaw(defineComponent({
  render: () => h('svg', {
    viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', 'stroke-width': '2',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round'
  }, paths.map(([tag, attrs]) => h(tag, attrs)))
}))

export const IconHome       = icon([['path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }], ['polyline', { points: '9 22 9 12 15 12 15 22' }]])
export const IconAttendance = icon([['rect', { x: '3', y: '4', width: '18', height: '18', rx: '2' }], ['line', { x1: '16', y1: '2', x2: '16', y2: '6' }], ['line', { x1: '8', y1: '2', x2: '8', y2: '6' }], ['line', { x1: '3', y1: '10', x2: '21', y2: '10' }]])
export const IconMenu       = icon([['line', { x1: '3', y1: '6', x2: '21', y2: '6' }], ['line', { x1: '3', y1: '12', x2: '21', y2: '12' }], ['line', { x1: '3', y1: '18', x2: '21', y2: '18' }]])
export const IconTimesheet  = icon([['path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }], ['polyline', { points: '14 2 14 8 20 8' }], ['line', { x1: '16', y1: '13', x2: '8', y2: '13' }], ['line', { x1: '16', y1: '17', x2: '8', y2: '17' }]])
export const IconMonitor    = icon([['rect', { x: '2', y: '3', width: '20', height: '14', rx: '2' }], ['line', { x1: '8', y1: '21', x2: '16', y2: '21' }], ['line', { x1: '12', y1: '17', x2: '12', y2: '21' }]])
export const IconReview     = icon([['path', { d: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' }], ['path', { d: 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' }]])
export const IconBranch     = icon([['path', { d: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18' }], ['path', { d: 'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' }], ['path', { d: 'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2' }]])
export const IconShift      = icon([['circle', { cx: '12', cy: '12', r: '10' }], ['polyline', { points: '12 6 12 12 16 14' }]])
export const IconUsers      = icon([['path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }], ['circle', { cx: '9', cy: '7', r: '4' }], ['path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }], ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }]])
export const IconRole       = icon([['path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' }]])
export const IconDept       = icon([['rect', { x: '2', y: '7', width: '6', height: '14' }], ['rect', { x: '9', y: '3', width: '6', height: '18' }], ['rect', { x: '16', y: '10', width: '6', height: '11' }]])
export const IconLogout     = icon([['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }], ['polyline', { points: '16 17 21 12 16 7' }], ['line', { x1: '21', y1: '12', x2: '9', y2: '12' }]])

// ── Menu definitions ──────────────────────────────────
export const attendanceMenu = {
  label: 'Attendance',
  children: [
    { to: '/attendance/timesheet', label: 'Timesheet', icon: IconTimesheet },
    { to: '/attendance/monitor',   label: 'Monitor',   icon: IconMonitor   },
    { to: '/attendance/review',    label: 'Review',    icon: IconReview    },
  ]
}

export const allMenu = {
  label: 'Semua Menu',
  children: [
    {
      isGroup: true,
      label: 'Attendance',
      children: [
        { to: '/attendance/timesheet', label: 'Timesheet', icon: IconTimesheet },
        { to: '/attendance/monitor',   label: 'Monitor',   icon: IconMonitor   },
        { to: '/attendance/review',    label: 'Review',    icon: IconReview    },
      ]
    },
    {
      isGroup: true,
      label: 'Manage Branch',
      children: [
        { to: '/branch',      label: 'Branch',     icon: IconBranch },
        { to: '/shift',       label: 'Shift',      icon: IconShift  },
        { to: '/usershift',  label: 'UserShift',  icon: IconUsers  },
      ]
    },
    {
      isGroup: true,
      label: 'Users',
      children: [
        { to: '/users/manage',              label: 'Manage Users',   icon: IconUsers },
        { to: '/users/roles',               label: 'Manage Roles',   icon: IconRole  },
        { to: '/users/department-position', label: 'Dept & Jabatan', icon: IconDept  },
      ]
    },
  ]
}

export function useBotNav() {
  const route = useRoute()
  const router = useRouter()
  const activeSubmenu = ref(null)

  function isActive(to) {
    return route.path === to
  }

  function isGroupActive(item) {
    return item.children?.some(c => isActive(c.to))
  }

  function isAnyMenuActive() {
    return allMenu.children.some(group => {
      if (group.isGroup && group.label === 'Attendance') return false
      return group.isGroup
        ? group.children.some(c => isActive(c.to))
        : isActive(group.to)
    })
  }

  function toggleSubmenu(item) {
    activeSubmenu.value = activeSubmenu.value?.label === item.label ? null : item
  }

  function closeSubmenu() {
    activeSubmenu.value = null
  }

  function handleLogout() {
    // Implementasi logout
    // Contoh: hapus token, redirect ke login
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
    closeSubmenu()
  }

  const isAllActive = computed(() =>
    activeSubmenu.value?.label === 'Semua Menu' || isAnyMenuActive()
  )

  return {
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
  }
}