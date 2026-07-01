<template>
  <PageHeader
    title="Manajemen Role"
    description="Kelola role dan hak akses pengguna pada sistem."
    action-label="Tambah Role"
    action-label-short="Tambah"
    @action="openAddModal"
  />

  <!-- Main Card -->
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200 flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <h2 class="text-[15px] lg:text-[17px] font-bold text-gray-900">Data Role</h2>
        <span class="text-[12px] lg:text-[12.5px] text-gray-400">{{ roles.length }} role</span>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div v-if="!isDesktop" class="flex flex-col divide-y divide-gray-100">
      <EmptyState v-if="paginatedData.length === 0" message="Belum ada data role." />
      <div v-for="(role, index) in paginatedData" :key="role.id" class="px-5 py-5 flex flex-col gap-3">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] text-gray-400 font-mono mb-0.5">#{{ String((currentPage - 1) * perPage + index + 1).padStart(2, '0') }}</p>
            <p class="text-[14px] font-semibold text-gray-900">{{ role.name }}</p>
          </div>
        </div>
        <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">DESKRIPSI</p>
          <p class="text-[13px] text-gray-700">{{ role.description }}</p>
        </div>
        <div class="flex gap-2 mt-1">
          <ActionButton label="Edit" @click="openEditModal(role)" />
          <ActionButton variant="danger" label="Hapus" @click="confirmDelete(role)" />
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[800px] border-collapse">
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr class="text-center text-xs font-bold tracking-[0.1em] text-gray-600">
            <th class="px-6 py-4 text-center w-16 border-r border-gray-200">NO</th>
            <th class="px-6 py-4 border-r border-gray-200">NAMA ROLE</th>
            <th class="px-6 py-4 border-r border-gray-200">DESKRIPSI</th>
            <th class="px-3 py-4 w-[80px]">AKSI</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="paginatedData.length === 0">
            <td colspan="4">
              <EmptyState message="Belum ada data role." />
            </td>
          </tr>
          <tr
            v-for="(role, index) in paginatedData"
            :key="role.id"
            class="hover:bg-gray-50/70 transition-colors"
          >
            <td class="px-6 py-3 text-center text-[12px] text-gray-500 font-mono border-r border-gray-200">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td class="px-6 py-3 border-r border-gray-200 text-center">
              <span class="text-[13.5px] text-gray-900 font-medium">{{ role.name }}</span>
            </td>
            <td class="px-6 py-3 text-[13px] text-gray-500 border-r border-gray-200 text-center">
              {{ role.description }}
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <IconButton title="Edit" @click="openEditModal(role)" />
                <IconButton variant="danger" title="Hapus" @click="confirmDelete(role)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination v-model="currentPage" :total-pages="totalPages" />
  </div>

  <!-- Add / Edit Modal -->
  <Modal :show="showModal" max-width="460px" @close="closeModal">
    <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
      {{ editingRole ? 'Edit Role' : 'Tambah Role' }}
    </h2>

    <div class="flex flex-col gap-4">
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">NAMA ROLE</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Contoh: Administrator"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">DESKRIPSI</label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Deskripsi singkat mengenai role ini"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
        ></textarea>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-6">
      <button
        @click="closeModal"
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        Batal
      </button>
      <button
        @click="saveRole"
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors"
      >
        Simpan
      </button>
    </div>
  </Modal>

  <!-- Delete Confirmation Modal -->
  <ConfirmDeleteModal
    :show="showDeleteModal"
    title="Hapus Role"
    :item-name="roleToDelete?.name"
    @cancel="showDeleteModal = false"
    @confirm="deleteRole"
  />
</template>

<script setup>
import { useManageRole } from '@/composables/users/useManageRole.js'
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
} = useManageRole()
</script>