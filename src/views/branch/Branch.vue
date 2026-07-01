<template>
  <PageHeader
    title="Cabang"
    description="Kelola cabang perusahaan beserta lokasinya."
    action-label="Tambah Cabang"
    action-label-short="Tambah"
    @action="openAddBranchModal"
  />

  <!-- Main Card -->
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <h2 class="text-[15px] lg:text-[17px] font-bold text-gray-900">Data Cabang</h2>
        <span class="text-[12px] lg:text-[12.5px] text-gray-400">{{ branches.length }} Cabang</span>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div v-if="!isDesktop" class="flex flex-col divide-y divide-gray-100">
      <EmptyState v-if="branches.length === 0" message="Belum ada data cabang." />
      <div v-for="branch in branches" :key="branch.id" class="px-5 py-5 flex flex-col gap-3">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[14px] font-semibold text-gray-900">{{ branch.name }}</p>
          </div>
          <span class="text-[12px] font-semibold text-[#1e3a5f] bg-blue-50 rounded-lg px-3 py-1.5">
            {{ shiftCountForBranch(branch.id) }} shift
          </span>
        </div>
        <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">ALAMAT</p>
          <p class="text-[12.5px] text-gray-700">{{ branch.address }}</p>
        </div>
        <div class="flex gap-2 mt-1">
          <ActionButton label="Edit" @click="openEditBranchModal(branch)" />
          <ActionButton variant="danger" label="Hapus" @click="confirmDeleteBranch(branch)" />
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[800px] border-collapse">
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr class="text-center text-xs font-bold tracking-[0.1em] text-gray-600">
            <th class="px-6 py-4 w-[60px] border-r border-gray-200">NO</th>
            <th class="px-6 py-4 w-[200px] border-r border-gray-200">NAMA CABANG</th>
            <th class="px-6 py-4 border-r border-gray-200">ALAMAT</th>
            <th class="px-6 py-4 w-[110px] border-r border-gray-200">JML SHIFT</th>
            <th class="px-3 py-4 w-[80px]">AKSI</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="branches.length === 0">
            <td colspan="5">
              <EmptyState message="Belum ada data cabang." />
            </td>
          </tr>
          <tr
            v-for="(branch, index) in branches"
            :key="branch.id"
            class="hover:bg-gray-50/70 transition-colors"
          >
            <td class="px-6 py-3 text-center text-[12px] text-gray-500 font-mono border-r border-gray-200">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-3 border-r border-gray-200">
              <span class="text-[13.5px] text-gray-900 font-medium">{{ branch.name }}</span>
            </td>
            <td class="px-6 py-3 text-[13px] text-gray-500 border-r border-gray-200">
              {{ branch.address }}
            </td>
            <td class="px-6 py-3 text-center border-r border-gray-200">
              <span class="text-[12.5px] font-semibold text-[#1e3a5f]">
                {{ shiftCountForBranch(branch.id) }} shift
              </span>
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <IconButton title="Edit" @click="openEditBranchModal(branch)" />
                <IconButton variant="danger" title="Hapus" @click="confirmDeleteBranch(branch)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination v-model="currentPage" :total-pages="totalPages" />
  </div>

  <!-- BRANCH MODAL -->
  <Modal :show="showBranchModal" max-width="520px" @close="closeBranchModal">
    <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
      {{ editingBranch ? 'Edit Cabang' : 'Tambah Cabang' }}
    </h2>

    <div class="flex flex-col gap-4">
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">NAMA CABANG</label>
        <input
          v-model="branchForm.name"
          type="text"
          placeholder="Contoh: Cabang Jakarta Pusat"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">CARI LOKASI</label>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ketik nama tempat atau alamat, lalu Enter"
            @keyup.enter="searchLocation"
            class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-24 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            type="button"
            @click="searchLocation"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {{ searching ? '...' : 'Cari' }}
          </button>
        </div>
        <p v-if="searchError" class="text-[11px] text-red-500 mt-1.5">{{ searchError }}</p>
        <p v-else class="text-[11px] text-gray-400 mt-1.5">
          Hasil pencarian akan mengisi alamat, koordinat, dan timezone otomatis. Anda juga bisa klik / geser pin pada peta.
        </p>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">PETA LOKASI</label>
        <div ref="mapContainer" class="w-full h-[220px] rounded-xl overflow-hidden border border-gray-200 z-0"></div>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">ALAMAT</label>
        <textarea
          v-model="branchForm.address"
          rows="2"
          placeholder="Alamat akan terisi otomatis dari peta, atau isi manual"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">LATITUDE</label>
          <input
            v-model="branchForm.latitude"
            type="text"
            readonly
            placeholder="-"
            class="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">LONGITUDE</label>
          <input
            v-model="branchForm.longitude"
            type="text"
            readonly
            placeholder="-"
            class="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">TIMEZONE</label>
        <input
          v-model="branchForm.timezone"
          type="text"
          readonly
          placeholder="Akan terisi otomatis dari lokasi pada peta"
          class="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-500 focus:outline-none"
        />
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <button
        @click="closeBranchModal"
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        Batal
      </button>
      <button
        @click="saveBranch"
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors"
      >
        Simpan
      </button>
    </div>
  </Modal>

  <!-- DELETE BRANCH MODAL -->
  <ConfirmDeleteModal
    :show="showDeleteBranchModal"
    title="Hapus Cabang"
    :item-name="branchToDelete?.name"
    :warning="shiftCountForBranch(branchToDelete?.id) > 0
      ? `Cabang ini memiliki ${shiftCountForBranch(branchToDelete?.id)} shift terkait. Shift tersebut juga akan ikut terhapus.`
      : ''"
    @cancel="showDeleteBranchModal = false"
    @confirm="deleteBranch"
  />
</template>

<script setup>
import { useBranch } from '@/composables/branch/useBranch.js'
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
  currentPage,
  totalPages,
  showBranchModal,
  showDeleteBranchModal,
  editingBranch,
  branchToDelete,
  searching,
  searchError,
  branchForm,
  searchQuery,
  mapContainer,
  shiftCountForBranch,
  searchLocation,
  openAddBranchModal,
  openEditBranchModal,
  closeBranchModal,
  saveBranch,
  confirmDeleteBranch,
  deleteBranch,
} = useBranch()
</script>