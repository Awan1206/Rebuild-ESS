<template>
    <!-- Page Header -->
    <div class="flex items-start justify-between mb-7">
      <div>
        <h1 class="text-[26px] font-bold text-[#1a1a2e] mb-1">Department & Position</h1>
        <p class="text-[13.5px] text-gray-400">Kelola department dan position pada sistem.</p>
      </div>
      <button
        v-if="activeTab === 'department'"
        @click="openAddDepartmentModal"
        class="flex items-center gap-2 bg-[#1e3a5f] text-white rounded-xl px-5 py-3 text-[14px] font-semibold hover:bg-[#16304f] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah Department
      </button>
      <button
        v-else
        @click="openAddPositionModal"
        class="flex items-center gap-2 bg-[#1e3a5f] text-white rounded-xl px-5 py-3 text-[14px] font-semibold hover:bg-[#16304f] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah Position
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-5 border-b border-gray-200">
      <button
        @click="activeTab = 'department'"
        :class="[
          'px-5 py-2.5 text-[13.5px] font-semibold rounded-t-lg transition-colors -mb-px border-b-2',
          activeTab === 'department'
            ? 'text-[#1e3a5f] border-[#1e3a5f]'
            : 'text-gray-400 border-transparent hover:text-gray-600'
        ]"
      >
        Department
      </button>
      <button
        @click="activeTab = 'position'"
        :class="[
          'px-5 py-2.5 text-[13.5px] font-semibold rounded-t-lg transition-colors -mb-px border-b-2',
          activeTab === 'position'
            ? 'text-[#1e3a5f] border-[#1e3a5f]'
            : 'text-gray-400 border-transparent hover:text-gray-600'
        ]"
      >
        Position
      </button>
    </div>

    <!-- Department Table -->
    <div v-if="activeTab === 'department'" class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-nowrap border border-gray-200 rounded-lg">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-gray-600 uppercase bg-gray-100">
              <th class="px-4 py-3 text-center w-16">No</th>
              <th class="px-4 py-3 text-center">Department Name</th>
              <th class="px-4 py-3 text-center">PIC for Approvals</th>
              <th class="px-4 py-3 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(dept, index) in departments"
              :key="dept.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700 font-medium">
                {{ dept.name }}
              </td>
              <td class="px-4 py-3 border-r border-gray-200 text-sm text-gray-700">
                <div class="flex flex-col items-start gap-1">
                  <span v-for="ap in dept.approvers" :key="ap.id" class="flex items-center gap-1">
                    <span class="text-gray-400">-</span> {{ ap.name }}
                  </span>
                  <span v-if="dept.approvers.length === 0" class="text-gray-300 italic">Belum ada approver</span>
                </div>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="confirmDeleteDepartment(dept)"
                    class="text-red-500 hover:text-red-600 transition p-1 rounded hover:bg-red-50"
                    title="Hapus"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="departments.length === 0">
              <td colspan="4" class="py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum ada data department</h3>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Position Table -->
    <div v-if="activeTab === 'position'" class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-nowrap border border-gray-200 rounded-lg">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-gray-600 uppercase bg-gray-100">
              <th class="px-4 py-3 text-center w-16">No</th>
              <th class="px-4 py-3 text-center">Position Name</th>
              <th class="px-4 py-3 text-center">Position Priority</th>
              <th class="px-4 py-3 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(pos, index) in positions"
              :key="pos.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700 font-medium">
                {{ pos.name }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm">
                <span
                  :class="pos.priority === 1
                    ? 'text-red-500 font-semibold'
                    : 'text-gray-500'"
                >
                  {{ pos.priority === 1 ? 'High!' : 'Standard' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="confirmDeletePosition(pos)"
                    class="text-red-500 hover:text-red-600 transition p-1 rounded hover:bg-red-50"
                    title="Hapus"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="positions.length === 0">
              <td colspan="4" class="py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum ada data position</h3>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Department Modal -->
    <div
      v-if="showDepartmentModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      @click.self="closeDepartmentModal"
    >
      <div class="bg-white rounded-2xl p-6 w-[420px]">
        <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">Tambah Department</h2>

        <div class="flex flex-col gap-4">
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">NAMA DEPARTMENT</label>
            <input
              v-model="departmentForm.name"
              type="text"
              placeholder="Contoh: Marketing"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            />
          </div>
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">APPROVERS</label>
            <select
              v-model="departmentForm.approvers"
              multiple
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 h-32"
            >
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
            <p class="text-[11px] text-red-400 mt-1 italic">Person in Charge for Approvals in this Department.</p>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="closeDepartmentModal"
            class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            @click="saveDepartment"
            class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-[#1e3a5f] hover:bg-[#16304f] transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- Add Position Modal -->
    <div
      v-if="showPositionModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      @click.self="closePositionModal"
    >
      <div class="bg-white rounded-2xl p-6 w-[420px]">
        <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">Tambah Position</h2>

        <div class="flex flex-col gap-4">
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">NAMA POSITION</label>
            <input
              v-model="positionForm.name"
              type="text"
              placeholder="Contoh: Staff IT"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            />
          </div>
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">POSITION PRIORITY</label>
            <select
              v-model="positionForm.priority"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            >
              <option :value="1">High!</option>
              <option :value="2">Standard</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="closePositionModal"
            class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            @click="savePosition"
            class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-[#1e3a5f] hover:bg-[#16304f] transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white rounded-2xl p-6 w-[380px]">
        <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-2">
          Hapus {{ deleteType === 'department' ? 'Department' : 'Position' }}
        </h2>
        <p class="text-[13.5px] text-gray-400 mb-6">
          Apakah Anda yakin ingin menghapus
          {{ deleteType === 'department' ? 'department' : 'position' }}
          <span class="font-semibold text-[#1a1a2e]">{{ itemToDelete?.name }}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-end gap-2">
          <button
            @click="showDeleteModal = false"
            class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button
            @click="deleteItem"
            class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const { user } = defineProps({
  user: Object
})

const activeTab = ref('department')

const users = ref([
  { id: 1, name: 'Budi Santoso' },
  { id: 2, name: 'Siti Aminah' },
  { id: 3, name: 'Awan Pratama' },
  { id: 4, name: 'Rina Wulandari' },
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
    approvers: [{ id: 4, name: 'Nira Putri Syafika' }]
  },
  {
    id: 3,
    name: 'Human Resources',
    approvers: [{ id: 5, name: 'Irvina Novita Rani'}]
  },
  {
    id: 4,
    name: 'Commercial',
    approvers: [{ id: 6, name: 'Mukhlasin Sidiq'}]
  },
  {
    id: 5,
    name: 'Compliance',
    approvers: [{ id: 7, name: 'Oktaviatun Kusumarani'}]
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

const showDepartmentModal = ref(false)
const showPositionModal = ref(false)
const showDeleteModal = ref(false)
const deleteType = ref(null)
const itemToDelete = ref(null)

const departmentForm = reactive({
  name: '',
  approvers: []
})

const positionForm = reactive({
  name: '',
  priority: 2
})

function openAddDepartmentModal() {
  departmentForm.name = ''
  departmentForm.approvers = []
  showDepartmentModal.value = true
}

function closeDepartmentModal() {
  showDepartmentModal.value = false
}

function saveDepartment() {
  if (!departmentForm.name.trim()) return

  const newId = departments.value.length
    ? Math.max(...departments.value.map(d => d.id)) + 1
    : 1

  const approvers = departmentForm.approvers.map(id => users.value.find(u => u.id === id))

  departments.value.push({
    id: newId,
    name: departmentForm.name,
    approvers
  })

  closeDepartmentModal()
}

function openAddPositionModal() {
  positionForm.name = ''
  positionForm.priority = 2
  showPositionModal.value = true
}

function closePositionModal() {
  showPositionModal.value = false
}

function savePosition() {
  if (!positionForm.name.trim()) return

  const newId = positions.value.length
    ? Math.max(...positions.value.map(p => p.id)) + 1
    : 1

  positions.value.push({
    id: newId,
    name: positionForm.name,
    priority: Number(positionForm.priority)
  })

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
</script>