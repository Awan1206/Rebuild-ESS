<template>
  <PageHeader
    title="User Shift"
    description="Atur penempatan shift kerja untuk setiap karyawan."
    action-label="Tambah User Shift"
    action-label-short="Tambah"
    @action="openAddModal"
  />

  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200 flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <h2 class="text-[15px] lg:text-[17px] font-bold text-gray-900">Data User Shift</h2>
        <span class="text-[12px] lg:text-[12.5px] text-gray-400">{{ filteredUserShifts.length }} karyawan</span>
      </div>
    </div>

    <!-- Filter Row -->
    <div class="flex flex-col gap-3 px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200 bg-gray-50/60">
      <!-- Search -->
      <div class="relative">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          v-model="userSearch"
          placeholder="Ketik nama user..."
          class="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <!-- Dropdowns -->
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-2">
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">BRANCH</label>
          <select v-model="branchFilter" class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option value="all">Semua branch</option>
            <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">SHIFT</label>
          <select v-model="shiftTypeFilter" class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option value="all">Semua shift</option>
            <option v-for="n in shiftTypeOptions" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden flex flex-col divide-y divide-gray-100">
      <EmptyState
        v-if="paginatedData.length === 0"
        message="Tidak ada data yang sesuai filter."
        icon="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8"
      />
      <div v-for="(item, index) in paginatedData" :key="item.id" class="px-5 py-5 flex flex-col gap-3">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] text-gray-400 font-mono mb-0.5">#{{ (currentPage - 1) * perPage + index + 1 }}</p>
            <p class="text-[14px] font-semibold text-gray-900">{{ userName(item.userId) }}</p>
            <p class="text-[12px] text-gray-400 mt-0.5">{{ branchName(shiftBranchId(item.shiftId)) }}</p>
          </div>
          <span class="text-[12.5px] font-semibold text-gray-700">{{ shiftName(item.shiftId) }}</span>
        </div>
        <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">JAM KERJA</p>
          <p class="text-[13px] font-bold text-gray-900 tabular-nums">{{ shiftTime(item.shiftId) }}</p>
        </div>
        <div class="flex gap-2 mt-1">
          <ActionButton label="Edit" @click="openEditModal(item)" />
          <ActionButton variant="danger" label="Hapus" @click="confirmDelete(item)" />
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full min-w-[800px] border-collapse">
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr class="text-center text-xs font-bold tracking-[0.1em] text-gray-600">
            <th class="px-6 py-4 w-[60px] border-r border-gray-200">ID</th>
            <th class="px-6 py-4 border-r border-gray-200">USER</th>
            <th class="px-6 py-4 border-r border-gray-200">BRANCH</th>
            <th class="px-6 py-4 border-r border-gray-200">SHIFT</th>
            <th class="px-6 py-4 w-[140px] border-r border-gray-200">JAM KERJA</th>
            <th class="px-3 py-4 w-[80px]">AKSI</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="paginatedData.length === 0">
            <td colspan="6">
              <EmptyState
                message="Tidak ada data yang sesuai filter."
                icon="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 100-8"
              />
            </td>
          </tr>
          <tr
            v-for="(item, index) in paginatedData"
            :key="item.id"
            class="hover:bg-gray-50/70 transition-colors"
          >
            <td class="px-6 py-3 text-center text-[12px] text-gray-500 font-mono border-r border-gray-200">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td class="px-6 py-3 border-r border-gray-200">
              <span class="text-[13.5px] text-gray-900 font-medium">{{ userName(item.userId) }}</span>
            </td>
            <td class="px-6 py-3 text-[13px] text-gray-500 border-r border-gray-200 text-center">
              {{ branchName(shiftBranchId(item.shiftId)) }}
            </td>
            <td class="px-6 py-3 border-r border-gray-200 text-center">
              <span class="text-[13px] text-gray-700">{{ shiftName(item.shiftId) }}</span>
            </td>
            <td class="px-6 py-3 text-center border-r border-gray-200">
              <span class="text-[13px] font-semibold text-gray-900 tabular-nums">{{ shiftTime(item.shiftId) }}</span>
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <IconButton title="Edit" @click="openEditModal(item)" />
                <IconButton variant="danger" title="Hapus" @click="confirmDelete(item)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination v-model="currentPage" :total-pages="totalPages" />
  </div>

  <!-- MODAL — ADD / EDIT USER SHIFT -->
  <Modal :show="showModal" max-width="460px" @close="closeModal">
    <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
      {{ editingItem ? 'Edit User Shift' : 'Tambah User Shift' }}
    </h2>

    <div class="flex flex-col gap-4">
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">USER</label>
        <select
          v-model="form.userId"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="" disabled>Pilih user</option>
          <option v-for="u in usersNoShift" :key="u.id" :value="u.id">{{ u.name }} — {{ u.role }}</option>
        </select>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">BRANCH</label>
        <select
          v-model="formBranchId"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="" disabled>Pilih branch</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
        <p class="text-[11px] text-gray-400 mt-1.5">Pilih branch untuk menampilkan shift yang tersedia.</p>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">SHIFT</label>
        <select
          v-model="form.shiftId"
          :disabled="!formBranchId"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="" disabled>{{ formBranchId ? 'Pilih shift' : 'Pilih branch terlebih dahulu' }}</option>
          <option v-for="s in shiftsForSelectedBranch" :key="s.id" :value="s.id">
            {{ s.name }} ({{ s.startTime }} - {{ s.endTime }})
          </option>
        </select>
        <p v-if="formBranchId && shiftsForSelectedBranch.length === 0" class="text-[11px] text-red-500 mt-1.5">
          Branch ini belum memiliki shift. Tambahkan shift terlebih dahulu di halaman Shift.
        </p>
      </div>

      <div v-if="form.shiftId" class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 text-[12.5px] text-gray-600">
        <p><span class="font-semibold text-[#1a1a2e]">{{ shiftName(form.shiftId) }}</span> · {{ shiftTime(form.shiftId) }}</p>
        <p class="text-gray-400">{{ branchName(formBranchId) }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <button @click="closeModal" class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors">Batal</button>
      <button @click="saveUserShift" class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors">Simpan</button>
    </div>
  </Modal>

  <!-- MODAL — DELETE USER SHIFT -->
  <ConfirmDeleteModal
    :show="showDeleteModal"
    title="Hapus User Shift"
    @cancel="showDeleteModal = false"
    @confirm="deleteUserShift"
  >
    <template #message>
      Apakah Anda yakin ingin menghapus penempatan shift untuk
      <span class="font-semibold text-[#1a1a2e]">{{ userName(itemToDelete?.userId) }}</span>?
    </template>
  </ConfirmDeleteModal>
</template>

<script setup>
import { useUserShift } from '@/composables/branch/useUsershift.js'
import PageHeader from '@/components/ui/PageHeader.vue'
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
  branches,
  usersNoShift,
  perPage,

  // Filter
  userSearch,
  branchFilter,
  shiftTypeFilter,
  shiftTypeOptions,
  filteredUserShifts,

  // Pagination
  currentPage,
  totalPages,
  paginatedData,

  // Helpers
  userName,
  branchName,
  shiftName,
  shiftTime,
  shiftBranchId,

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
} = useUserShift()
</script>