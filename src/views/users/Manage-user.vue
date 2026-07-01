<template>
  <PageHeader
    title="Manajemen Users"
    description="Kelola data pengguna pada sistem."
    action-label="Tambah User"
    action-label-short="Tambah"
    @action="openAddModal"
  />

  <!-- Main Card -->
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-5 lg:px-7 py-4 lg:py-5 border-b border-gray-200 flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <h2 class="text-[15px] lg:text-[17px] font-bold text-gray-900">Data User</h2>
        <span class="text-[12px] lg:text-[12.5px] text-gray-400">{{ filteredUsers.length }} user</span>
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
    </div>

    <!-- Mobile Cards -->
    <div v-if="!isDesktop" class="flex flex-col divide-y divide-gray-100">
      <EmptyState v-if="paginatedData.length === 0" message="Tidak ada data yang sesuai filter." />
      <div v-for="(user, index) in paginatedData" :key="user.id" class="px-5 py-5 flex flex-col gap-3">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] text-gray-400 font-mono mb-0.5">#{{ employeeId(user) }}</p>
            <p class="text-[14px] font-semibold text-gray-900">{{ user.name }}</p>
            <p class="text-[12px] text-gray-400 mt-0.5">{{ user.position }} · {{ user.department }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-[11px] font-semibold',
              user.status === 'aktif'
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-200 text-gray-500'
            ]"
          >
            {{ user.status === 'aktif' ? 'Aktif' : 'Nonaktif' }}
          </span>
        </div>
        <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
          <div>
            <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">STATUS PEKERJAAN</p>
            <p class="text-[13px] font-bold text-gray-900">{{ user.employmentStatus }}</p>
          </div>
          <div class="text-right">
            <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">ROLE</p>
            <p class="text-[13px] font-bold text-gray-900">{{ user.role }}</p>
          </div>
        </div>
        <div class="flex gap-2 mt-1">
          <ActionButton label="Edit" @click="openEditModal(user)" />
          <ActionButton variant="danger" label="Hapus" @click="confirmDelete(user)" />
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[1200px] border-collapse">
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr class="text-center text-xs font-bold tracking-[0.1em] text-gray-600">
            <th class="px-6 py-4 border-r border-gray-200">ID</th>
            <th class="px-6 py-4 border-r border-gray-200">NAMA USER</th>
            <th class="px-6 py-4 border-r border-gray-200">POSISI</th>
            <th class="px-6 py-4 border-r border-gray-200">DEPARTMENT</th>
            <th class="px-6 py-4 border-r border-gray-200">STATUS PEKERJAAN</th>
            <th class="px-6 py-4 border-r border-gray-200">ROLE</th>
            <th class="px-6 py-4 border-r border-gray-200">STATUS</th>
            <th class="px-3 py-4 w-[80px]">AKSI</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="paginatedData.length === 0">
            <td colspan="8">
              <EmptyState message="Tidak ada data yang sesuai filter." />
            </td>
          </tr>
          <tr
            v-for="(user, index) in paginatedData"
            :key="user.id"
            class="hover:bg-gray-50/70 transition-colors"
          >
            <td class="px-6 py-3 text-center text-[12px] text-gray-500 font-mono border-r border-gray-200">
              {{ employeeId(user) }}
            </td>
            <td class="px-6 py-3 border-r border-gray-200 text-center">
              <span class="text-[13.5px] text-gray-900 font-medium">{{ user.name }}</span>
            </td>
            <td class="px-6 py-3 text-[13px] text-gray-500 border-r border-gray-200 text-center">
              {{ user.position }}
            </td>
            <td class="px-6 py-3 text-[13px] text-gray-500 border-r border-gray-200 text-center">
              {{ user.department }}
            </td>
            <td class="px-6 py-3 text-[13px] text-gray-500 border-r border-gray-200 text-center">
              {{ user.employmentStatus }}
            </td>
            <td class="px-6 py-3 text-[13px] text-gray-500 border-r border-gray-200 text-center">
              {{ user.role }}
            </td>
            <td class="px-6 py-3 border-r border-gray-200 text-center">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-[11px] font-semibold',
                  user.status === 'aktif'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-500'
                ]"
              >
                {{ user.status === 'aktif' ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td class="px-3 py-3 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <IconButton title="Edit" @click="openEditModal(user)" />
                <IconButton variant="danger" title="Hapus" @click="confirmDelete(user)" />
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
      {{ editingUser ? 'Edit User' : 'Tambah User' }}
    </h2>

    <div class="flex flex-col gap-4">
      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">NAMA USER</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Contoh: Awan Pratama"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">POSISI</label>
        <select
          v-model="form.position"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="" disabled>Pilih posisi</option>
          <option v-for="p in positionOptions" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">DEPARTMENT</label>
        <select
          v-model="form.department"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="" disabled>Pilih department</option>
          <option v-for="d in departmentOptions" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">STATUS PEKERJAAN</label>
        <select
          v-model="form.employmentStatus"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option v-for="e in employmentStatusOptions" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">ROLE</label>
        <select
          v-model="form.role"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="" disabled>Pilih role</option>
          <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <div>
        <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400 mb-1.5 block">STATUS</label>
        <select
          v-model="form.status"
          class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Nonaktif</option>
        </select>
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
        @click="saveUser"
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors"
      >
        Simpan
      </button>
    </div>
  </Modal>

  <!-- Delete Confirmation Modal -->
  <ConfirmDeleteModal
    :show="showDeleteModal"
    title="Hapus User"
    :item-name="userToDelete?.name"
    @cancel="showDeleteModal = false"
    @confirm="deleteUser"
  />
</template>

<script setup>
import { useManageUser } from '@/composables/users/useManageUser.js'
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
} = useManageUser()
</script>