<template>
  <!-- Page Header -->
  <div class="flex items-start justify-between mb-4 lg:mb-7">
    <div>
      <h1 class="text-[20px] lg:text-[26px] font-bold text-[#1a1a2e] mb-0.5 lg:mb-1">Department &amp; Position</h1>
      <p class="text-[12px] lg:text-[13.5px] text-gray-400">Kelola department dan position pada sistem.</p>
    </div>
    <button
      @click="activeTab === 'department' ? openAddDepartmentModal() : openAddPositionModal()"
      class="flex items-center gap-2 bg-[#1e3a5f] text-white rounded-xl px-4 lg:px-5 py-2.5 lg:py-3 text-[13px] lg:text-[14px] font-semibold hover:bg-[#16304f] transition-colors"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      <span class="hidden sm:inline">{{ activeTab === 'department' ? 'Tambah Department' : 'Tambah Position' }}</span>
      <span class="sm:hidden">Tambah</span>
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

  <!-- ============ DEPARTMENT TAB ============ -->
  <div v-if="activeTab === 'department'">
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

      <!-- Top Bar -->
      <div class="flex items-center justify-between px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <h2 class="text-[15px] lg:text-[17px] font-bold text-gray-900">Data Department</h2>
          <span class="text-[12px] lg:text-[12.5px] text-gray-400">{{ departments.length }} department</span>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden flex flex-col divide-y divide-gray-100">
        <EmptyState v-if="paginatedDepartments.length === 0" message="Belum ada data department." />
        <div v-for="(dept, index) in paginatedDepartments" :key="dept.id" class="px-5 py-5 flex flex-col gap-3">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] text-gray-400 font-mono mb-0.5">#{{ (deptPage - 1) * perPage + index + 1 }}</p>
              <p class="text-[14px] font-semibold text-gray-900">{{ dept.name }}</p>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5">PIC FOR APPROVALS</p>
            <div class="flex flex-col gap-0.5">
              <span v-for="ap in dept.approvers" :key="ap.id" class="text-[12.5px] text-gray-700">
                <span class="text-gray-400">-</span> {{ ap.name }}
              </span>
              <span v-if="dept.approvers.length === 0" class="text-[12.5px] text-gray-300 italic">Belum ada approver</span>
            </div>
          </div>
          <div class="flex gap-2 mt-1">
            <ActionButton label="Edit" @click="openEditDepartmentModal(dept)" />
            <ActionButton variant="danger" label="Hapus" @click="confirmDeleteDepartment(dept)" />
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full min-w-[800px] border-collapse">
          <thead class="bg-gray-100 border-b border-gray-200">
            <tr class="text-center text-xs font-bold tracking-[0.1em] text-gray-600">
              <th class="px-6 py-4 w-[60px] border-r border-gray-200">NO</th>
              <th class="px-6 py-4 border-r border-gray-200">DEPARTMENT NAME</th>
              <th class="px-6 py-4 border-r border-gray-200">PIC FOR APPROVALS</th>
              <th class="px-3 py-4 w-[80px]">AKSI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="paginatedDepartments.length === 0">
              <td colspan="4">
                <EmptyState message="Belum ada data department." />
              </td>
            </tr>
            <tr
              v-for="(dept, index) in paginatedDepartments"
              :key="dept.id"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="px-6 py-3 text-center text-[12px] text-gray-500 font-mono border-r border-gray-200">
                {{ (deptPage - 1) * perPage + index + 1 }}
              </td>
              <td class="px-6 py-3 border-r border-gray-200">
                <span class="text-[13.5px] text-gray-900 font-medium">{{ dept.name }}</span>
              </td>
              <td class="px-6 py-3 border-r border-gray-200">
                <div class="flex flex-col items-start gap-1 text-[13px] text-gray-500">
                  <span v-for="ap in dept.approvers" :key="ap.id">
                    <span class="text-gray-400">-</span> {{ ap.name }}
                  </span>
                  <span v-if="dept.approvers.length === 0" class="text-gray-300 italic">Belum ada approver</span>
                </div>
              </td>
              <td class="px-3 py-3 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <IconButton title="Edit" @click="openEditDepartmentModal(dept)" />
                  <IconButton variant="danger" title="Hapus" @click="confirmDeleteDepartment(dept)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination v-model="deptPage" :total-pages="deptTotalPages" />
    </div>
  </div>

  <!-- ============ POSITION TAB ============ -->
  <div v-else>
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

      <!-- Top Bar -->
      <div class="flex items-center justify-between px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <h2 class="text-[15px] lg:text-[17px] font-bold text-gray-900">Data Position</h2>
          <span class="text-[12px] lg:text-[12.5px] text-gray-400">{{ positions.length }} position</span>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden flex flex-col divide-y divide-gray-100">
        <EmptyState v-if="paginatedPositions.length === 0" message="Belum ada data position." />
        <div v-for="(pos, index) in paginatedPositions" :key="pos.id" class="px-5 py-5 flex flex-col gap-3">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] text-gray-400 font-mono mb-0.5">#{{ (posPage - 1) * perPage + index + 1 }}</p>
              <p class="text-[14px] font-semibold text-gray-900">{{ pos.name }}</p>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">POSITION PRIORITY</p>
            <p class="text-[13px] font-bold" :class="pos.priority === 1 ? 'text-red-500' : 'text-gray-900'">
              {{ pos.priority === 1 ? 'High' : 'Standard' }}
            </p>
          </div>
          <div class="flex gap-2 mt-1">
            <ActionButton label="Edit" @click="openEditPositionModal(pos)" />
            <ActionButton variant="danger" label="Hapus" @click="confirmDeletePosition(pos)" />
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full min-w-[800px] border-collapse">
          <thead class="bg-gray-100 border-b border-gray-200">
            <tr class="text-center text-xs font-bold tracking-[0.1em] text-gray-600">
              <th class="px-6 py-4 w-[60px] border-r border-gray-200">NO</th>
              <th class="px-6 py-4 border-r border-gray-200">POSITION NAME</th>
              <th class="px-6 py-4 border-r border-gray-200">POSITION PRIORITY</th>
              <th class="px-3 py-4 w-[80px]">AKSI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="paginatedPositions.length === 0">
              <td colspan="4">
                <EmptyState message="Belum ada data position." />
              </td>
            </tr>
            <tr
              v-for="(pos, index) in paginatedPositions"
              :key="pos.id"
              class="hover:bg-gray-50/70 transition-colors"
            >
              <td class="px-6 py-3 text-center text-[12px] text-gray-500 font-mono border-r border-gray-200">
                {{ (posPage - 1) * perPage + index + 1 }}
              </td>
              <td class="px-6 py-3 border-r border-gray-200">
                <span class="text-[13.5px] text-gray-900 font-medium">{{ pos.name }}</span>
              </td>
              <td class="px-6 py-3 text-center border-r border-gray-200">
                <span
                  class="text-[13px] font-semibold"
                  :class="pos.priority === 1 ? 'text-red-500' : 'text-gray-500'"
                >
                  {{ pos.priority === 1 ? 'High' : 'Standard' }}
                </span>
              </td>
              <td class="px-3 py-3 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <IconButton title="Edit" @click="openEditPositionModal(pos)" />
                  <IconButton variant="danger" title="Hapus" @click="confirmDeletePosition(pos)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination v-model="posPage" :total-pages="posTotalPages" />
    </div>
  </div>

  <!-- ADD/EDIT DEPARTMENT MODAL -->
  <Modal :show="showDepartmentModal" max-width="460px" @close="closeDepartmentModal">
    <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
      {{ editingDepartment ? 'Edit Department' : 'Tambah Department' }}
    </h2>

    <div class="flex flex-col gap-4">
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">NAMA DEPARTMENT</label>
        <input
          v-model="departmentForm.name"
          type="text"
          placeholder="Contoh: Marketing"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">APPROVERS</label>

        <!-- Search -->
        <div class="relative">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="approverSearch"
            @input="onApproverSearch"
            @keydown.escape="approverSearch = ''; approverResults = []"
            type="text"
            placeholder="Cari (min. 2 karakter)"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <!-- Results (max 5) -->
        <div v-if="approverResults.length > 0" class="mt-2 flex flex-wrap gap-1.5">
          <button
            v-for="u in approverResults"
            :key="u.id"
            type="button"
            @click="toggleApprover(u.id)"
            class="text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors"
            :class="departmentForm.approvers.includes(u.id)
              ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]'"
          >
            {{ u.name }}
          </button>
        </div>

        <!-- Selected chips -->
        <div v-if="departmentForm.approvers.length > 0" class="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
          <span
            v-for="id in departmentForm.approvers"
            :key="id"
            class="inline-flex items-center gap-1 bg-[#1e3a5f]/10 text-[#1e3a5f] text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
          >
            {{ users.find(u => u.id === id)?.name }}
            <button
              @click="departmentForm.approvers = departmentForm.approvers.filter(a => a !== id)"
              class="hover:text-red-400 transition-colors leading-none"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </span>
          <button
            @click="departmentForm.approvers = []"
            class="text-[11px] text-red-400 hover:text-red-500 font-semibold transition-colors px-1"
          >
            Hapus semua
          </button>
        </div>

        <p class="text-[11px] text-red-400 mt-1.5 italic">Person in Charge for Approvals in this Department.</p>
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
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors"
      >
        {{ editingDepartment ? 'Simpan Perubahan' : 'Simpan' }}
      </button>
    </div>
  </Modal>

  <!-- ADD/EDIT POSITION MODAL -->
  <Modal :show="showPositionModal" max-width="460px" @close="closePositionModal">
    <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
      {{ editingPosition ? 'Edit Position' : 'Tambah Position' }}
    </h2>

    <div class="flex flex-col gap-4">
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">NAMA POSITION</label>
        <input
          v-model="positionForm.name"
          type="text"
          placeholder="Contoh: Staff IT"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">POSITION PRIORITY</label>
        <select
          v-model="positionForm.priority"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option :value="1">High</option>
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
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors"
      >
        Simpan
      </button>
    </div>
  </Modal>

  <!-- DELETE CONFIRMATION MODAL -->
  <ConfirmDeleteModal
    :show="showDeleteModal"
    :title="`Hapus ${deleteType === 'department' ? 'Department' : 'Position'}`"
    @cancel="showDeleteModal = false"
    @confirm="deleteItem"
  >
    <template #message>
      Apakah Anda yakin ingin menghapus
      {{ deleteType === 'department' ? 'department' : 'position' }}
      <span class="font-semibold text-[#1a1a2e]">{{ itemToDelete?.name }}</span>?
    </template>
  </ConfirmDeleteModal>
</template>

<script setup>
import { useManageDept } from '@/composables/users/useManageDept.js'
import Pagination from '@/components/ui/Pagination.vue'
import Modal from '@/components/ui/Modal.vue'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import IconButton from '@/components/ui/IconButton.vue'
import ActionButton from '@/components/ui/ActionButton.vue'

const { user } = defineProps({
  user: Object
})

const {
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
} = useManageDept()
</script>