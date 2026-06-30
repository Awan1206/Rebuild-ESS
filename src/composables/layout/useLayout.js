import { ref } from 'vue'

export function useLayout() {
  const sidebarOpen = ref(true)

  const currentUser = ref(
    JSON.parse(localStorage.getItem('user') || 'null') || {
      name: 'Awan',
      role: 'Developer',
      avatar: null,
    }
  )

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    sidebarOpen,
    currentUser,
    toggleSidebar,
  }
}