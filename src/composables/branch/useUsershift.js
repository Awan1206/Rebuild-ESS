import { ref, reactive, computed, watch } from 'vue'

export function useUserShift() {
  /* ===================== DATA REFERENSI ===================== */

  const branches = ref([
    { id: 1, name: 'Branch Jakarta Pusat' },
    { id: 2, name: 'Branch Denpasar' },
  ])

  const shifts = ref([
    { id: 1, branchId: 1, name: 'Pagi',  startTime: '07:00', endTime: '15:00', crossesMidnight: false, lateTolerance: 15 },
    { id: 2, branchId: 1, name: 'Siang', startTime: '15:00', endTime: '23:00', crossesMidnight: false, lateTolerance: 15 },
    { id: 3, branchId: 2, name: 'Pagi',  startTime: '08:00', endTime: '16:00', crossesMidnight: false, lateTolerance: 10 },
    { id: 4, branchId: 2, name: 'Malam', startTime: '23:00', endTime: '07:00', crossesMidnight: true,  lateTolerance: 15 },
  ])

  const users = ref([
    { id: 1, name: 'Andi Pratama',    role: 'Kasir' },
    { id: 2, name: 'Siti Nurhaliza',  role: 'Supervisor' },
    { id: 3, name: 'Budi Santoso',    role: 'Staff Gudang' },
    { id: 4, name: 'Dewi Lestari',    role: 'Kasir' },
    { id: 5, name: 'Rizky Ramadhan',  role: 'Security' },
    { id: 6, name: 'Putri Ayu',       role: 'Staff Gudang' },
  ])

  const userShifts = ref([
    { id: 1, userId: 1, shiftId: 1 },
    { id: 2, userId: 2, shiftId: 1 },
    { id: 3, userId: 3, shiftId: 2 },
    { id: 4, userId: 5, shiftId: 3 },
  ])

  /* ===================== HELPERS ===================== */

  function branchName(branchId) {
    const b = branches.value.find(b => b.id === branchId)
    return b ? b.name : '-'
  }

  function userName(userId) {
    const u = users.value.find(u => u.id === userId)
    return u ? u.name : '-'
  }

  function shiftName(shiftId) {
    const s = shifts.value.find(s => s.id === shiftId)
    return s ? s.name : '-'
  }

  function shiftTime(shiftId) {
    const s = shifts.value.find(s => s.id === shiftId)
    return s ? `${s.startTime} - ${s.endTime}` : '-'
  }

  function shiftBranchId(shiftId) {
    const s = shifts.value.find(s => s.id === shiftId)
    return s ? s.branchId : null
  }

  /* ===================== FILTER ===================== */

  const userSearch      = ref('')
  const branchFilter    = ref('all')
  const shiftTypeFilter = ref('all')

  const shiftTypeOptions = computed(() => [...new Set(shifts.value.map(s => s.name))].sort())

  const filteredUserShifts = computed(() =>
    userShifts.value.filter(item => {
      const name        = userName(item.userId).toLowerCase()
      const matchSearch = name.includes(userSearch.value.trim().toLowerCase())
      const matchBranch = branchFilter.value === 'all' || shiftBranchId(item.shiftId) === branchFilter.value
      const matchType   = shiftTypeFilter.value === 'all' || shiftName(item.shiftId).toLowerCase().includes(shiftTypeFilter.value.toLowerCase())
      return matchSearch && matchBranch && matchType
    })
  )

  /* ===================== PAGINATION ===================== */

  const perPage     = 8
  const currentPage = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredUserShifts.value.length / perPage)))

  const paginatedData = computed(() =>
    filteredUserShifts.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
  )

  watch([userSearch, branchFilter, shiftTypeFilter], () => { currentPage.value = 1 })

  /* ===================== MODAL — USER SHIFT ===================== */

  const showModal       = ref(false)
  const showDeleteModal = ref(false)
  const editingItem     = ref(null)
  const itemToDelete    = ref(null)

  const form         = reactive({ userId: '', shiftId: '' })
  const formBranchId = ref('')

  const usersNoShift = computed(() => {
    const assignedIds = userShifts.value
      .filter(us => !editingItem.value || us.id !== editingItem.value.id)
      .map(us => us.userId)
    return users.value.filter(u => !assignedIds.includes(u.id))
  })

  const shiftsForSelectedBranch = computed(() => {
    if (!formBranchId.value) return []
    return shifts.value.filter(s => s.branchId === formBranchId.value)
  })

  function openAddModal() {
    editingItem.value  = null
    form.userId        = ''
    form.shiftId       = ''
    formBranchId.value = ''
    showModal.value    = true
  }

  function openEditModal(item) {
    editingItem.value  = item
    form.userId        = item.userId
    form.shiftId       = item.shiftId
    formBranchId.value = shiftBranchId(item.shiftId)
    showModal.value    = true
  }

  function closeModal() {
    showModal.value   = false
    editingItem.value = null
  }

  function saveUserShift() {
    if (!form.userId || !form.shiftId) return
    if (editingItem.value) {
      editingItem.value.userId  = form.userId
      editingItem.value.shiftId = form.shiftId
    } else {
      const newId = userShifts.value.length
        ? Math.max(...userShifts.value.map(i => i.id)) + 1
        : 1
      userShifts.value.push({ id: newId, userId: form.userId, shiftId: form.shiftId })
    }
    closeModal()
  }

  function confirmDelete(item) {
    itemToDelete.value    = item
    showDeleteModal.value = true
  }

  function deleteUserShift() {
    userShifts.value      = userShifts.value.filter(i => i.id !== itemToDelete.value.id)
    showDeleteModal.value = false
    itemToDelete.value    = null
  }

  /* ===================== RETURN ===================== */

  return {
    // Data
    branches,
    shifts,
    users,
    userShifts,
    usersNoShift,

    // Helpers
    branchName,
    userName,
    shiftName,
    shiftTime,
    shiftBranchId,

    // Filter
    userSearch,
    branchFilter,
    shiftTypeFilter,
    shiftTypeOptions,
    filteredUserShifts,

    // Pagination
    perPage,
    currentPage,
    totalPages,
    paginatedData,

    // Modal — User Shift
    showModal,
    showDeleteModal,
    editingItem,
    itemToDelete,
    form,
    formBranchId,
    shiftsForSelectedBranch,
    openAddModal,
    openEditModal,
    closeModal,
    saveUserShift,
    confirmDelete,
    deleteUserShift,
  }
}