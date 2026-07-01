<template>
  <PageHeader
    title="Shift"
    description="Atur jadwal jam kerja shift per branch."
    action-label="Tambah Shift"
    action-label-short="Tambah"
    @action="openAddShiftModal"
  />

  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <h2 class="text-[15px] lg:text-[17px] font-bold text-gray-900">Data Shift</h2>
        <span class="text-[12px] lg:text-[12.5px] text-gray-400">{{ filteredShifts.length }} shift</span>
      </div>
    </div>

    <!-- Filter Row -->
    <div class="flex flex-col gap-3 px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200 bg-gray-50/60">
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-2">
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">BRANCH</label>
          <select v-model="branchShiftFilter" class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option value="all">Semua branch</option>
            <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">SHIFT</label>
          <select v-model="shiftNameFilter" class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option value="all">Semua shift</option>
            <option v-for="n in shiftNameOptions" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>
      <button
        v-if="branchShiftFilter !== 'all' || shiftNameFilter !== 'all'"
        @click="resetShiftFilters"
        class="self-start text-[12px] font-semibold text-[#1e3a5f] hover:underline"
      >
        Reset filter
      </button>
    </div>

    <!-- Mobile Cards -->
    <div v-if="!isDesktop" class="flex flex-col divide-y divide-gray-100">
      <EmptyState
        v-if="paginatedShifts.length === 0"
        message="Belum ada data shift."
        icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <div v-for="shift in paginatedShifts" :key="shift.id" class="px-5 py-5 flex flex-col gap-3">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[14px] font-semibold text-gray-900">{{ shift.name }}</p>
            <p class="text-[12px] text-gray-400 mt-0.5">{{ branchName(shift.branchId) }}</p>
          </div>
        </div>
        <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex flex-col gap-2">
          <div>
            <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">JAM KERJA</p>
            <p class="text-[13px] font-bold text-gray-900 tabular-nums">
              {{ shift.startTime }} - {{ shift.endTime }}
              <span v-if="shift.crossesMidnight" class="text-[11px] font-semibold text-indigo-500">(+1 hari)</span>
            </p>
          </div>
          <div>
            <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">TOLERANSI</p>
            <p class="text-[12.5px] font-semibold text-gray-700">{{ shift.lateTolerance }} menit</p>
          </div>
        </div>
        <div class="flex gap-2 mt-1">
          <ActionButton label="Edit" @click="openEditShiftModal(shift)" />
          <ActionButton variant="danger" label="Hapus" @click="confirmDeleteShift(shift)" />
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[900px] border-collapse">
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr class="text-center text-xs font-bold tracking-[0.1em] text-gray-600">
            <th class="px-6 py-4 w-[60px] border-r border-gray-200">NO</th>
            <th class="px-6 py-4 border-r border-gray-200">NAMA SHIFT</th>
            <th class="px-6 py-4 border-r border-gray-200">BRANCH</th>
            <th class="px-6 py-4 w-[120px] border-r border-gray-200">JAM MASUK</th>
            <th class="px-6 py-4 w-[120px] border-r border-gray-200">JAM KELUAR</th>
            <th class="px-6 py-4 w-[110px] border-r border-gray-200">TOLERANSI</th>
            <th class="px-3 py-4 w-[80px]">AKSI</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="paginatedShifts.length === 0">
            <td colspan="7">
              <EmptyState
                message="Tidak ada shift yang sesuai filter."
                icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </td>
          </tr>
          <tr
            v-for="(shift, index) in paginatedShifts"
            :key="shift.id"
            class="hover:bg-gray-50/70 transition-colors"
          >
            <td class="px-6 py-3 text-center text-[12px] text-gray-500 font-mono border-r border-gray-200">{{ index + 1 }}</td>
            <td class="px-6 py-3 border-r border-gray-200">
              <span class="text-[13.5px] text-gray-900 font-medium">{{ shift.name }}</span>
              <span v-if="shift.crossesMidnight" class="ml-2 text-[11px] font-semibold text-indigo-500">(+1 hari)</span>
            </td>
            <td class="px-6 py-3 text-[13px] text-gray-500 text-center border-r border-gray-200">{{ branchName(shift.branchId) }}</td>
            <td class="px-6 py-3 text-center border-r border-gray-200">
              <span class="text-[13px] font-semibold text-gray-900 tabular-nums">{{ shift.startTime }}</span>
            </td>
            <td class="px-6 py-3 text-center border-r border-gray-200">
              <span class="text-[13px] font-semibold text-gray-900 tabular-nums">{{ shift.endTime }}</span>
            </td>
            <td class="px-6 py-3 text-center border-r border-gray-200">
              <span class="text-[13px] font-semibold text-gray-900 tabular-nums">{{ shift.lateTolerance }} mnt</span>
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <IconButton title="Edit" @click="openEditShiftModal(shift)" />
                <IconButton variant="danger" title="Hapus" @click="confirmDeleteShift(shift)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination v-model="currentPage" :total-pages="totalPages" />
  </div>

  <!-- MODAL — ADD / EDIT SHIFT -->
  <Modal :show="showShiftModal" max-width="460px" @close="closeShiftModal">
    <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
      {{ editingShift ? 'Edit Shift' : 'Tambah Shift' }}
    </h2>

    <div class="flex flex-col gap-4">
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">BRANCH</label>
        <select
          v-model="shiftForm.branchId"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="" disabled>Pilih branch</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
        <p v-if="branches.length === 0" class="text-[11px] text-red-500 mt-1.5">
          Belum ada branch. Tambahkan branch terlebih dahulu di halaman Branch.
        </p>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">NAMA SHIFT</label>
        <input
          v-model="shiftForm.name"
          type="text"
          placeholder="Contoh: Pagi, Siang, Malam"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">JAM MASUK</label>
          <input
            v-model="shiftForm.startTime"
            type="time"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div>
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">JAM KELUAR</label>
          <input
            v-model="shiftForm.endTime"
            type="time"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      <div class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <div>
          <p class="text-[13px] font-semibold text-gray-900">Melewati Hari</p>
          <p class="text-[11.5px] text-gray-400">Aktifkan jika jam keluar berada di hari berikutnya</p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="shiftForm.crossesMidnight"
          @click="shiftForm.crossesMidnight = !shiftForm.crossesMidnight"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0"
          :class="shiftForm.crossesMidnight ? 'bg-[#1e3a5f]' : 'bg-gray-300'"
        >
          <span
            class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
            :class="shiftForm.crossesMidnight ? 'translate-x-5' : 'translate-x-0.5'"
          ></span>
        </button>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">TOLERANSI KETERLAMBATAN (MENIT)</label>
        <input
          v-model.number="shiftForm.lateTolerance"
          type="number"
          min="0"
          placeholder="Contoh: 15"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <button @click="closeShiftModal" class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors">Batal</button>
      <button @click="saveShift" class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors">Simpan</button>
    </div>
  </Modal>

  <!-- MODAL — DELETE SHIFT -->
  <ConfirmDeleteModal
    :show="showDeleteShiftModal"
    title="Hapus Shift"
    :item-name="shiftToDelete?.name"
    @cancel="showDeleteShiftModal = false"
    @confirm="deleteShift"
  />
</template>

<script setup>
import { useShift } from '@/composables/branch/useShift.js'
import { useIsDesktop } from '@/composables/useMediaQuery.js'
import PageHeader from '@/components/ui/PageHeader.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Modal from '@/components/ui/Modal.vue'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import IconButton from '@/components/ui/IconButton.vue'
import ActionButton from '@/components/ui/ActionButton.vue'

const isDesktop = useIsDesktop()

const { user } = defineProps({
  user: Object
})

const {
  branches,

  // Filter
  branchShiftFilter,
  shiftNameFilter,
  shiftNameOptions,
  filteredShifts,
  resetShiftFilters,

  // Pagination
  currentPage,
  totalPages,
  paginatedShifts,

  // Helpers
  branchName,

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
} = useShift()
</script>