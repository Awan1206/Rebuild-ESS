import { ref, reactive, computed, watch } from 'vue'

export function useManageUser() {
  const positionOptions = ['Manager', 'Supervisor', 'Staff', 'Staff IT']
  const departmentOptions = ['Human Resource', 'Finance', 'Marketing', 'Operations', 'Information Technology']
  const roleOptions = ['Administrator', 'Manager', 'Staff', 'Human Resource', 'Employee', 'Finance']
  const employmentStatusOptions = ['Permanen', 'Kontrak', 'Magang']

  const users = ref([
    {
      id: 1,
      name: 'Awan',
      position: 'Pengembangan Web',
      department: 'Digital Marketing',
      employmentStatus: 'Magang',
      role: 'Karyawan',
      status: 'aktif'
    },
    {
      id: 2,
      name: 'Siti Aminah',
      position: 'Staff',
      department: 'Human Resource',
      employmentStatus: 'Permanen',
      role: 'Human Resource',
      status: 'aktif'
    },
    {
      id: 3,
      name: 'Budi Santoso',
      position: 'Staff',
      department: 'Finance',
      employmentStatus: 'Kontrak',
      role: 'Finance',
      status: 'aktif'
    },
    {
      id: 4,
      name: 'Rina Wulandari',
      position: 'Staff IT',
      department: 'Information Technology',
      employmentStatus: 'Magang',
      role: 'Employee',
      status: 'nonaktif'
    },
  ])

  /* ===================== SEARCH & PAGINATION ===================== */

  const userSearch = ref('')

  const filteredUsers = computed(() => {
    const q = userSearch.value.trim().toLowerCase()
    if (!q) return users.value
    return users.value.filter(u => u.name.toLowerCase().includes(q))
  })

  const perPage = 8
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / perPage)))
  const paginatedData = computed(() =>
    filteredUsers.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
  )

  watch(userSearch, () => {
    currentPage.value = 1
  })

  function employeeId(user) {
    return `EMP${String(user.id).padStart(3, '0')}`
  }

  /* ===================== MODAL STATE ===================== */

  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const editingUser = ref(null)
  const userToDelete = ref(null)

  const form = reactive({
    name: '',
    position: '',
    department: '',
    employmentStatus: 'Permanen',
    role: '',
    status: 'aktif'
  })

  function openAddModal() {
    editingUser.value = null
    form.name = ''
    form.position = ''
    form.department = ''
    form.employmentStatus = 'Permanen'
    form.role = ''
    form.status = 'aktif'
    showModal.value = true
  }

  function openEditModal(user) {
    editingUser.value = user
    form.name = user.name
    form.position = user.position
    form.department = user.department
    form.employmentStatus = user.employmentStatus
    form.role = user.role
    form.status = user.status
    showModal.value = true
  }

  function closeModal() {
    showModal.value = false
    editingUser.value = null
  }

  function saveUser() {
    if (!form.name.trim()) return

    if (editingUser.value) {
      editingUser.value.name = form.name
      editingUser.value.position = form.position
      editingUser.value.department = form.department
      editingUser.value.employmentStatus = form.employmentStatus
      editingUser.value.role = form.role
      editingUser.value.status = form.status
    } else {
      const newId = users.value.length
        ? Math.max(...users.value.map(u => u.id)) + 1
        : 1
      users.value.push({
        id: newId,
        name: form.name,
        position: form.position,
        department: form.department,
        employmentStatus: form.employmentStatus,
        role: form.role,
        status: form.status
      })
    }

    closeModal()
  }

  function confirmDelete(user) {
    userToDelete.value = user
    showDeleteModal.value = true
  }

  function deleteUser() {
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    showDeleteModal.value = false
    userToDelete.value = null
  }

  return {
    positionOptions,
    departmentOptions,
    roleOptions,
    employmentStatusOptions,
    users,
    userSearch,
    currentPage,
    filteredUsers,
    totalPages,
    paginatedData,
    employeeId,
    showModal,
    showDeleteModal,
    editingUser,
    userToDelete,
    form,
    openAddModal,
    openEditModal,
    closeModal,
    saveUser,
    confirmDelete,
    deleteUser,
  }
}