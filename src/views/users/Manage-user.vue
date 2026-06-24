<template>
    <!-- Page Header -->
    <div class="flex items-start justify-between mb-7">
      <div>
        <h1 class="text-[26px] font-bold text-[#1a1a2e] mb-1">Manajemen Users</h1>
        <p class="text-[13.5px] text-gray-400">Kelola data pengguna pada sistem.</p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 bg-[#1e3a5f] text-white rounded-xl px-5 py-3 text-[14px] font-semibold hover:bg-[#16304f] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah User
      </button>
    </div>

    <!-- Table Card -->
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-nowrap border border-gray-200 rounded-lg">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-gray-600 uppercase bg-gray-100">
              <th class="px-4 py-3 text-center w-16">No</th>
              <th class="px-4 py-3 text-center">Nama User</th>
              <th class="px-4 py-3 text-center">Posisi</th>
              <th class="px-4 py-3 text-center">Department</th>
              <th class="px-4 py-3 text-center">Status Pekerjaan</th>
              <th class="px-4 py-3 text-center">Role</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(user, index) in users"
              :key="user.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700 font-medium">
                {{ user.name }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
                {{ user.position }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
                {{ user.department }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm">
                  {{ user.employmentStatus }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
                {{ user.role }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm">
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
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="openEditModal(user)"
                    class="text-yellow-500 hover:text-yellow-600 transition p-1 rounded hover:bg-yellow-50"
                    title="Edit"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(user)"
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

            <tr v-if="users.length === 0">
              <td colspan="8" class="py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum ada data user</h3>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl p-6 w-[460px]">
        <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
          {{ editingUser ? 'Edit User' : 'Tambah User' }}
        </h2>

        <div class="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">NAMA USER</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Awan Pratama"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            />
          </div>

          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">POSISI</label>
            <select
              v-model="form.position"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            >
              <option value="" disabled>Pilih posisi</option>
              <option v-for="p in positionOptions" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">DEPARTMENT</label>
            <select
              v-model="form.department"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            >
              <option value="" disabled>Pilih department</option>
              <option v-for="d in departmentOptions" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">STATUS PEKERJAAN</label>
            <select
              v-model="form.employmentStatus"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            >
              <option value="Permanen">Permanen</option>
              <option value="Kontrak">Kontrak</option>
              <option value="Magang">Magang</option>
            </select>
          </div>

          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">ROLE</label>
            <select
              v-model="form.role"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            >
              <option value="" disabled>Pilih role</option>
              <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>

          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">STATUS</label>
            <select
              v-model="form.status"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
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
        <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-2">Hapus User</h2>
        <p class="text-[13.5px] text-gray-400 mb-6">
          Apakah Anda yakin ingin menghapus user
          <span class="font-semibold text-[#1a1a2e]">{{ userToDelete?.name }}</span>?
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
            @click="deleteUser"
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

const positionOptions = ['Manager', 'Supervisor', 'Staff', 'Staff IT']
const departmentOptions = ['Human Resource', 'Finance', 'Marketing', 'Operations', 'Information Technology']
const roleOptions = ['Administrator', 'Manager', 'Staff', 'Human Resource', 'Employee', 'Finance']
const employmentStatus = ['Permanen', 'Kontrak', 'Magang']

const users = ref([
  {
    id: 1,
    name: 'Abhista',
    position: 'Pengembangan Web',
    department: 'Digital Marketing',
    employmentStatus: 'Magang',
    role: 'Karyawan',
    status: 'aktif'
  },
  {
    id: 2,
    name: 'Siti Aminah',
    position: 'Staff',
    department: 'Human Resource',
    employmentStatus: 'Permanen',
    role: 'Human Resource',
    status: 'aktif'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    position: 'Staff',
    department: 'Finance',
    employmentStatus: 'Kontrak',
    role: 'Finance',
    status: 'aktif'
  },
  {
    id: 4,
    name: 'Rina Wulandari',
    position: 'Staff IT',
    department: 'Information Technology',
    employmentStatus: 'Magang',
    role: 'Employee',
    status: 'nonaktif'
  },
])

const showModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref(null)
const userToDelete = ref(null)

const form = reactive({
  name: '',
  position: '',
  department: '',
  employmentStatus: 'permanen',
  role: '',
  status: 'aktif'
})

function openAddModal() {
  editingUser.value = null
  form.name = ''
  form.position = ''
  form.department = ''
  form.employmentStatus = 'Permanen'
  form.role = ''
  form.status = 'aktif'
  showModal.value = true
}

function openEditModal(user) {
  editingUser.value = user
  form.name = user.name
  form.position = user.position
  form.department = user.department
  form.employmentStatus = user.employmentStatus
  form.role = user.role
  form.status = user.status
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingUser.value = null
}

function saveUser() {
  if (!form.name.trim()) return

  if (editingUser.value) {
    editingUser.value.name = form.name
    editingUser.value.position = form.position
    editingUser.value.department = form.department
    editingUser.value.employmentStatus = form.employmentStatus
    editingUser.value.role = form.role
    editingUser.value.status = form.status
  } else {
    const newId = users.value.length
      ? Math.max(...users.value.map(u => u.id)) + 1
      : 1
    users.value.push({
      id: newId,
      name: form.name,
      position: form.position,
      department: form.department,
      employmentStatus: form.employmentStatus,
      role: form.role,
      status: form.status
    })
  }

  closeModal()
}

function confirmDelete(user) {
  userToDelete.value = user
  showDeleteModal.value = true
}

function deleteUser() {
  users.value = users.value.filter(u => u.id !== userToDelete.value.id)
  showDeleteModal.value = false
  userToDelete.value = null
}
</script>