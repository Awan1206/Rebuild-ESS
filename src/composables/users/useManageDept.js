import { ref, reactive, computed } from 'vue'

export function useManageDept() {
  const activeTab = ref('department')

  const users = ref([
    { id: 1, name: 'Tri Mulyana' },
    { id: 2, name: 'Addakhil Choirul Huda' },
    { id: 3, name: 'Lenggo Algandy' },
    { id: 4, name: 'Nira Putri Syafiqa' },
    { id: 5, name: 'Irvina Novita Rani' },
    { id: 6, name: 'Mukhlasin Sidiq' },
    { id: 7, name: 'Oktaviatun Kusumarani' },
    { id: 8, name: 'Abhista a' },
    { id: 9, name: 'Abhista b' },
    { id: 10, name: 'Abhista c' },
    { id: 11, name: 'Abhista d' },
    { id: 12, name: 'Abhista e' },
  ])

  const departments = ref([
    {
      id: 1,
      name: 'Facility Management',
      approvers: [{ id: 1, name: 'Tri Mulyana' }, { id: 2, name: 'Addakhil Choirul Huda' }, { id: 3, name: 'Lenggo Algandy' }]
    },
    {
      id: 2,
      name: 'Admin & Finance',
      approvers: [{ id: 4, name: 'Nira Putri Syafiqa' }]
    },
    {
      id: 3,
      name: 'Human Resources',
      approvers: [{ id: 5, name: 'Irvina Novita Rani' }]
    },
    {
      id: 4,
      name: 'Commercial',
      approvers: [{ id: 6, name: 'Mukhlasin Sidiq' }]
    },
    {
      id: 5,
      name: 'Compliance',
      approvers: [{ id: 7, name: 'Oktaviatun Kusumarani' }]
    },
  ])

  const positions = ref([
    { id: 1, name: 'Direktur Utama', priority: 1 },
    { id: 2, name: 'Kepala Komersial', priority: 1 },
    { id: 3, name: 'Human Resources (SDM)', priority: 2 },
    { id: 4, name: 'Staf Akuntansi', priority: 2 },
    { id: 5, name: 'Staf Administrasi', priority: 2 },
    { id: 6, name: 'Digital Marketing', priority: 2 },
    { id: 7, name: 'Pengembangan Web', priority: 2 },
  ])

  /* ===================== APPROVER SEARCH (autocomplete) ===================== */

  const approverSearch = ref('')
  const approverResults = ref([])
  let approverTimer = null

  function onApproverSearch() {
    clearTimeout(approverTimer)
    const q = approverSearch.value.trim()

    if (q.length < 2) {
      approverResults.value = []
      return
    }

    approverTimer = setTimeout(() => {
      approverResults.value = users.value
        .filter(u => u.name.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 4) // max 5 hasil
    }, 300)
  }

  function toggleApprover(id) {
    if (departmentForm.approvers.includes(id)) {
      departmentForm.approvers = departmentForm.approvers.filter(a => a !== id)
    } else {
      departmentForm.approvers.push(id)
      approverSearch.value = ''
      approverResults.value = []
    }
  }

  /* ===================== PAGINATION ===================== */

  const perPage = 8

  const deptPage = ref(1)
  const deptTotalPages = computed(() => Math.max(1, Math.ceil(departments.value.length / perPage)))
  const paginatedDepartments = computed(() =>
    departments.value.slice((deptPage.value - 1) * perPage, deptPage.value * perPage)
  )

  const posPage = ref(1)
  const posTotalPages = computed(() => Math.max(1, Math.ceil(positions.value.length / perPage)))
  const paginatedPositions = computed(() =>
    positions.value.slice((posPage.value - 1) * perPage, posPage.value * perPage)
  )

  /* ===================== MODAL STATE ===================== */

  const showDepartmentModal = ref(false)
  const showPositionModal = ref(false)
  const showDeleteModal = ref(false)
  const deleteType = ref(null)
  const itemToDelete = ref(null)
  const editingDepartment = ref(null)
  const editingPosition = ref(null)

  const departmentForm = reactive({
    name: '',
    approvers: []
  })

  const positionForm = reactive({
    name: '',
    priority: 2
  })

  function openAddDepartmentModal() {
    editingDepartment.value = null
    departmentForm.name = ''
    departmentForm.approvers = []
    showDepartmentModal.value = true
  }

  function openEditDepartmentModal(dept) {
    editingDepartment.value = dept
    departmentForm.name = dept.name
    departmentForm.approvers = dept.approvers.map(ap => ap.id)
    showDepartmentModal.value = true
  }

  function closeDepartmentModal() {
    showDepartmentModal.value = false
    editingDepartment.value = null
    approverSearch.value = ''
    approverResults.value = []
    clearTimeout(approverTimer)
  }

  function saveDepartment() {
    if (!departmentForm.name.trim()) return

    const approvers = departmentForm.approvers.map(id => users.value.find(u => u.id === id))

    if (editingDepartment.value) {
      editingDepartment.value.name = departmentForm.name
      editingDepartment.value.approvers = approvers
    } else {
      const newId = departments.value.length
        ? Math.max(...departments.value.map(d => d.id)) + 1
        : 1

      departments.value.push({
        id: newId,
        name: departmentForm.name,
        approvers
      })
    }

    closeDepartmentModal()
  }

  function openEditPositionModal(pos) {
    editingPosition.value = pos
    positionForm.name = pos.name
    positionForm.priority = pos.priority
    showPositionModal.value = true
  }

  function openAddPositionModal() {
    editingPosition.value = null  // reset
    positionForm.name = ''
    positionForm.priority = 2
    showPositionModal.value = true
  }

  function closePositionModal() {
    showPositionModal.value = false
    editingPosition.value = null
  }

  function savePosition() {
    if (!positionForm.name.trim()) return

    if (editingPosition.value) {
      editingPosition.value.name = positionForm.name
      editingPosition.value.priority = Number(positionForm.priority)
    } else {
      const newId = positions.value.length
        ? Math.max(...positions.value.map(p => p.id)) + 1
        : 1
      positions.value.push({
        id: newId,
        name: positionForm.name,
        priority: Number(positionForm.priority)
      })
    }

    closePositionModal()
  }

  function confirmDeleteDepartment(dept) {
    deleteType.value = 'department'
    itemToDelete.value = dept
    showDeleteModal.value = true
  }

  function confirmDeletePosition(pos) {
    deleteType.value = 'position'
    itemToDelete.value = pos
    showDeleteModal.value = true
  }

  function deleteItem() {
    if (deleteType.value === 'department') {
      departments.value = departments.value.filter(d => d.id !== itemToDelete.value.id)
    } else {
      positions.value = positions.value.filter(p => p.id !== itemToDelete.value.id)
    }
    showDeleteModal.value = false
    itemToDelete.value = null
    deleteType.value = null
  }

  return {
    activeTab,
    users,
    departments,
    positions,
    perPage,
    approverSearch,
    approverResults,
    onApproverSearch,
    toggleApprover,
    deptPage,
    deptTotalPages,
    paginatedDepartments,
    posPage,
    posTotalPages,
    paginatedPositions,
    showDepartmentModal,
    showPositionModal,
    showDeleteModal,
    deleteType,
    itemToDelete,
    editingDepartment,
    editingPosition,
    departmentForm,
    positionForm,
    openAddDepartmentModal,
    openEditDepartmentModal,
    closeDepartmentModal,
    saveDepartment,
    openEditPositionModal,
    openAddPositionModal,
    closePositionModal,
    savePosition,
    confirmDeleteDepartment,
    confirmDeletePosition,
    deleteItem,
  }
}