<template>
  <!-- Page Header -->
  <div class="flex items-start justify-between mb-7">
    <div>
      <h1 class="text-[26px] font-bold text-[#1a1a2e] mb-1">Manajemen Shift Kerja</h1>
      <p class="text-[13.5px] text-gray-400">Kelola jadwal shift kerja karyawan, seperti shift pagi dan shift siang.</p>
    </div>
    <button
      @click="openAddModal"
      class="flex items-center gap-2 bg-[#1e3a5f] text-white rounded-xl px-5 py-3 text-[14px] font-semibold hover:bg-[#16304f] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Tambah Shift
    </button>
  </div>

  <!-- Table Card -->
  <div class="w-full overflow-hidden rounded-lg shadow-xs">
    <div class="w-full overflow-x-auto">
      <table class="w-full whitespace-nowrap border border-gray-200 rounded-lg">
        <thead>
          <tr class="text-xs font-semibold tracking-wide text-gray-600 uppercase bg-gray-100">
            <th class="px-4 py-3 text-center w-16">No</th>
            <th class="px-4 py-3 text-center">Nama Shift</th>
            <th class="px-4 py-3 text-center w-36">Jam Masuk</th>
            <th class="px-4 py-3 text-center w-36">Jam Keluar</th>
            <th class="px-4 py-3 text-center w-32">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="(shift, index) in shifts"
            :key="shift.id"
            class="border-b border-gray-200 hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
              {{ index + 1 }}
            </td>
            <td class="px-4 py-3 text-left border-r border-gray-200 text-sm text-gray-700 font-medium">
              <div class="flex items-center gap-2">
                <span
                  class="w-2.5 h-2.5 rounded-full"
                  :class="shift.type === 'pagi' ? 'bg-amber-400' : 'bg-blue-400'"
                ></span>
                {{ shift.name }}
              </div>
            </td>
            <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
              {{ shift.startTime }}
            </td>
            <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
              {{ shift.endTime }}
            </td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center space-x-2">
                <button
                  @click="openEditModal(shift)"
                  class="text-yellow-500 hover:text-yellow-600 transition p-1 rounded hover:bg-yellow-50"
                  title="Edit"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  @click="confirmDelete(shift)"
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

          <tr v-if="shifts.length === 0">
            <td colspan="5" class="py-16 text-center">
              <div class="flex flex-col items-center justify-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum ada data shift</h3>
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
    <div class="bg-white rounded-2xl p-6 w-[460px] max-h-[90vh] overflow-y-auto">
      <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
        {{ editingShift ? 'Edit Shift' : 'Tambah Shift' }}
      </h2>

      <div class="flex flex-col gap-4">
        <div>
          <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">NAMA SHIFT</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Contoh: Shift Pagi"
            class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </div>

        <div>
          <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">JENIS SHIFT</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.type = 'pagi'"
              class="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold border transition-colors"
              :class="form.type === 'pagi'
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
              Shift Pagi
            </button>
            <button
              type="button"
              @click="form.type = 'siang'"
              class="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold border transition-colors"
              :class="form.type === 'siang'
                ? 'bg-blue-50 border-blue-300 text-blue-600'
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 18a5 5 0 0 0-10 0"/>
                <line x1="12" y1="2" x2="12" y2="9"/>
                <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
                <line x1="1" y1="18" x2="3" y2="18"/>
                <line x1="21" y1="18" x2="23" y2="18"/>
                <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
                <line x1="23" y1="22" x2="1" y2="22"/>
                <polyline points="8 6 12 2 16 6"/>
              </svg>
              Shift Siang
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">JAM MASUK</label>
            <input
              v-model="form.startTime"
              type="time"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            />
          </div>
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">JAM KELUAR</label>
            <input
              v-model="form.endTime"
              type="time"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            />
          </div>
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
          @click="saveShift"
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
      <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-2">Hapus Shift</h2>
      <p class="text-[13.5px] text-gray-400 mb-6">
        Apakah Anda yakin ingin menghapus
        <span class="font-semibold text-[#1a1a2e]">{{ shiftToDelete?.name }}</span>?
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
          @click="deleteShift"
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

const shifts = ref([
  {
    id: 1,
    name: 'Shift Pagi',
    type: 'pagi',
    startTime: '07:00',
    endTime: '15:00'
  },
  {
    id: 2,
    name: 'Shift Siang',
    type: 'siang',
    startTime: '15:00',
    endTime: '23:00'
  },
])

const showModal = ref(false)
const showDeleteModal = ref(false)
const editingShift = ref(null)
const shiftToDelete = ref(null)

const form = reactive({
  name: '',
  type: 'pagi',
  startTime: '',
  endTime: ''
})

function resetForm() {
  form.name = ''
  form.type = 'pagi'
  form.startTime = ''
  form.endTime = ''
}

function openAddModal() {
  editingShift.value = null
  resetForm()
  showModal.value = true
}

function openEditModal(shift) {
  editingShift.value = shift
  form.name = shift.name
  form.type = shift.type
  form.startTime = shift.startTime
  form.endTime = shift.endTime
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingShift.value = null
}

function saveShift() {
  if (!form.name.trim() || !form.startTime || !form.endTime) return

  if (editingShift.value) {
    editingShift.value.name = form.name
    editingShift.value.type = form.type
    editingShift.value.startTime = form.startTime
    editingShift.value.endTime = form.endTime
  } else {
    const newId = shifts.value.length
      ? Math.max(...shifts.value.map(s => s.id)) + 1
      : 1
    shifts.value.push({
      id: newId,
      name: form.name,
      type: form.type,
      startTime: form.startTime,
      endTime: form.endTime
    })
  }

  closeModal()
}

function confirmDelete(shift) {
  shiftToDelete.value = shift
  showDeleteModal.value = true
}

function deleteShift() {
  shifts.value = shifts.value.filter(s => s.id !== shiftToDelete.value.id)
  showDeleteModal.value = false
  shiftToDelete.value = null
}
</script>