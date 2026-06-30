import { ref, reactive, computed } from 'vue'

export function useManageRole() {
  const roles = ref([
    { id: 1, name: 'Administrator', description: 'Memiliki akses penuh ke seluruh fitur dan pengaturan sistem.' },
    { id: 2, name: 'Manager', description: 'Dapat mengelola karyawan, absensi, dan laporan tim.' },
    { id: 3, name: 'Staff', description: 'Akses standar untuk melakukan presensi dan melihat data pribadi.' },
    { id: 4, name: 'Human Resource', description: 'Mengelola data karyawan, cuti, dan penggajian.' },
    { id: 5, name: 'Employee', description: 'Karyawan umum yang dapat melakukan absensi, melihat jadwal, dan data pribadi.' },
    { id: 6, name: 'Finance', description: 'Mengelola data keuangan, payroll, dan laporan finansial perusahaan.' },
  ])

  /* ===================== PAGINATION ===================== */

  const perPage = 8
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(roles.value.length / perPage)))
  const paginatedData = computed(() =>
    roles.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
  )

  /* ===================== MODAL STATE ===================== */

  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const editingRole = ref(null)
  const roleToDelete = ref(null)

  const form = reactive({
    name: '',
    description: ''
  })

  function openAddModal() {
    editingRole.value = null
    form.name = ''
    form.description = ''
    showModal.value = true
  }

  function openEditModal(role) {
    editingRole.value = role
    form.name = role.name
    form.description = role.description
    showModal.value = true
  }

  function closeModal() {
    showModal.value = false
    editingRole.value = null
  }

  function saveRole() {
    if (!form.name.trim()) return

    if (editingRole.value) {
      editingRole.value.name = form.name
      editingRole.value.description = form.description
    } else {
      const newId = roles.value.length
        ? Math.max(...roles.value.map(r => r.id)) + 1
        : 1
      roles.value.push({ id: newId, name: form.name, description: form.description })
    }

    closeModal()
  }

  function confirmDelete(role) {
    roleToDelete.value = role
    showDeleteModal.value = true
  }

  function deleteRole() {
    roles.value = roles.value.filter(r => r.id !== roleToDelete.value.id)
    showDeleteModal.value = false
    roleToDelete.value = null
  }

  return {
    roles,
    currentPage,
    totalPages,
    paginatedData,
    perPage,
    showModal,
    showDeleteModal,
    editingRole,
    roleToDelete,
    form,
    openAddModal,
    openEditModal,
    closeModal,
    saveRole,
    confirmDelete,
    deleteRole,
  }
}