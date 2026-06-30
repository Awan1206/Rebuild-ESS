import { ref, reactive, computed, watch } from 'vue'

export function useShift() {
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

  /* ===================== HELPERS ===================== */

  function branchName(branchId) {
    const b = branches.value.find(b => b.id === branchId)
    return b ? b.name : '-'
  }

  /* ===================== FILTER ===================== */

  const branchShiftFilter = ref('all')
  const shiftNameFilter   = ref('all')

  const shiftNameOptions = computed(() => [...new Set(shifts.value.map(s => s.name))].sort())

  const filteredShifts = computed(() =>
    shifts.value.filter(shift => {
      const matchBranch = branchShiftFilter.value === 'all' || shift.branchId === branchShiftFilter.value
      const matchName   = shiftNameFilter.value   === 'all' || shift.name.toLowerCase().includes(shiftNameFilter.value.toLowerCase())
      return matchBranch && matchName
    })
  )

  function resetShiftFilters() {
    branchShiftFilter.value = 'all'
    shiftNameFilter.value   = 'all'
  }

  /* ===================== PAGINATION ===================== */

  const perPage     = 8
  const currentPage = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredShifts.value.length / perPage)))

  const paginatedShifts = computed(() =>
    filteredShifts.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
  )

  watch([branchShiftFilter, shiftNameFilter], () => { currentPage.value = 1 })

  /* ===================== MODAL — SHIFT ===================== */

  const showShiftModal       = ref(false)
  const showDeleteShiftModal = ref(false)
  const editingShift         = ref(null)
  const shiftToDelete        = ref(null)

  const shiftForm = reactive({
    branchId:        '',
    name:            '',
    startTime:       '',
    endTime:         '',
    crossesMidnight: false,
    lateTolerance:   0,
  })

  function resetShiftForm() {
    shiftForm.branchId        = branches.value[0]?.id ?? ''
    shiftForm.name            = ''
    shiftForm.startTime       = ''
    shiftForm.endTime         = ''
    shiftForm.crossesMidnight = false
    shiftForm.lateTolerance   = 0
  }

  function openAddShiftModal() {
    editingShift.value   = null
    resetShiftForm()
    showShiftModal.value = true
  }

  function openEditShiftModal(shift) {
    editingShift.value        = shift
    shiftForm.branchId        = shift.branchId
    shiftForm.name            = shift.name
    shiftForm.startTime       = shift.startTime
    shiftForm.endTime         = shift.endTime
    shiftForm.crossesMidnight = shift.crossesMidnight
    shiftForm.lateTolerance   = shift.lateTolerance
    showShiftModal.value      = true
  }

  function closeShiftModal() {
    showShiftModal.value = false
    editingShift.value   = null
  }

  function saveShift() {
    if (!shiftForm.branchId || !shiftForm.name.trim() || !shiftForm.startTime || !shiftForm.endTime) return
    if (editingShift.value) {
      editingShift.value.branchId        = shiftForm.branchId
      editingShift.value.name            = shiftForm.name
      editingShift.value.startTime       = shiftForm.startTime
      editingShift.value.endTime         = shiftForm.endTime
      editingShift.value.crossesMidnight = shiftForm.crossesMidnight
      editingShift.value.lateTolerance   = shiftForm.lateTolerance
    } else {
      const newId = shifts.value.length ? Math.max(...shifts.value.map(s => s.id)) + 1 : 1
      shifts.value.push({
        id:              newId,
        branchId:        shiftForm.branchId,
        name:            shiftForm.name,
        startTime:       shiftForm.startTime,
        endTime:         shiftForm.endTime,
        crossesMidnight: shiftForm.crossesMidnight,
        lateTolerance:   shiftForm.lateTolerance,
      })
    }
    closeShiftModal()
  }

  function confirmDeleteShift(shift) {
    shiftToDelete.value        = shift
    showDeleteShiftModal.value = true
  }

  function deleteShift() {
    shifts.value               = shifts.value.filter(s => s.id !== shiftToDelete.value.id)
    showDeleteShiftModal.value = false
    shiftToDelete.value        = null
  }

  /* ===================== RETURN ===================== */

  return {
    // Data
    branches,
    shifts,

    // Helpers
    branchName,

    // Filter
    branchShiftFilter,
    shiftNameFilter,
    shiftNameOptions,
    filteredShifts,
    resetShiftFilters,

    // Pagination
    perPage,
    currentPage,
    totalPages,
    paginatedShifts,

    // Modal — Shift
    showShiftModal,
    showDeleteShiftModal,
    editingShift,
    shiftToDelete,
    shiftForm,
    openAddShiftModal,
    openEditShiftModal,
    closeShiftModal,
    saveShift,
    confirmDeleteShift,
    deleteShift,
  }
}