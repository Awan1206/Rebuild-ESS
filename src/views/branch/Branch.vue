<template>
    <!-- Page Header -->
    <div class="flex items-start justify-between mb-7">
      <div>
        <h1 class="text-[26px] font-bold text-[#1a1a2e] mb-1">Manajemen Branch</h1>
        <p class="text-[13.5px] text-gray-400">Kelola cabang perusahaan beserta lokasi dan zona waktunya.</p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 bg-[#1e3a5f] text-white rounded-xl px-5 py-3 text-[14px] font-semibold hover:bg-[#16304f] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah Branch
      </button>
    </div>

    <!-- Table Card -->
    <div class="w-full overflow-hidden rounded-lg shadow-xs">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-nowrap border border-gray-200 rounded-lg">
          <thead>
            <tr class="text-xs font-semibold tracking-wide text-gray-600 uppercase bg-gray-100">
              <th class="px-4 py-3 text-center w-16">No</th>
              <th class="px-4 py-3 text-center">Nama Branch</th>
              <th class="px-4 py-3 text-center">Alamat</th>
              <th class="px-4 py-3 text-center w-40">Timezone</th>
              <th class="px-4 py-3 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(branch, index) in branches"
              :key="branch.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700 font-medium">
                {{ branch.name }}
              </td>
              <td class="px-4 py-3 text-left border-r border-gray-200 text-sm text-gray-700">
                {{ branch.address }}
              </td>
              <td class="px-4 py-3 text-center border-r border-gray-200 text-sm text-gray-700">
                {{ branch.timezone }}
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="openEditModal(branch)"
                    class="text-yellow-500 hover:text-yellow-600 transition p-1 rounded hover:bg-yellow-50"
                    title="Edit"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(branch)"
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

            <tr v-if="branches.length === 0">
              <td colspan="5" class="py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum ada data branch</h3>
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
      <div class="bg-white rounded-2xl p-6 w-[520px] max-h-[90vh] overflow-y-auto">
        <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-5">
          {{ editingBranch ? 'Edit Branch' : 'Tambah Branch' }}
        </h2>

        <div class="flex flex-col gap-4">
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">NAMA BRANCH</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Branch Jakarta Pusat"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            />
          </div>

          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">CARI LOKASI</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Ketik nama tempat atau alamat, lalu Enter"
                @keyup.enter="searchLocation"
                class="w-full bg-gray-50 rounded-xl pl-4 pr-24 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
              />
              <button
                type="button"
                @click="searchLocation"
                class="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#1e3a5f] text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#16304f] transition-colors"
              >
                {{ searching ? '...' : 'Cari' }}
              </button>
            </div>
            <p v-if="searchError" class="text-[11px] text-red-500 mt-1.5">{{ searchError }}</p>
            <p v-else class="text-[11px] text-gray-400 mt-1.5">
              Hasil pencarian akan mengisi alamat, koordinat, dan timezone otomatis. Anda juga bisa klik / geser pin pada peta.
            </p>
          </div>

          <!-- Map Preview -->
          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">PETA LOKASI</label>
            <div ref="mapContainer" class="w-full h-[220px] rounded-xl overflow-hidden border border-gray-200 z-0"></div>
          </div>

          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">ALAMAT</label>
            <textarea
              v-model="form.address"
              rows="2"
              placeholder="Alamat akan terisi otomatis dari peta, atau isi manual"
              class="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">LATITUDE</label>
              <input
                v-model="form.latitude"
                type="text"
                readonly
                placeholder="-"
                class="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-[13.5px] text-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">LONGITUDE</label>
              <input
                v-model="form.longitude"
                type="text"
                readonly
                placeholder="-"
                class="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-[13.5px] text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-1.5 block">TIMEZONE</label>
            <input
              v-model="form.timezone"
              type="text"
              readonly
              placeholder="Akan terisi otomatis dari lokasi pada peta"
              class="w-full bg-gray-100 rounded-xl px-4 py-2.5 text-[13.5px] text-gray-500 focus:outline-none"
            />
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
            @click="saveBranch"
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
        <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-2">Hapus Branch</h2>
        <p class="text-[13.5px] text-gray-400 mb-6">
          Apakah Anda yakin ingin menghapus branch
          <span class="font-semibold text-[#1a1a2e]">{{ branchToDelete?.name }}</span>?
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
            @click="deleteBranch"
            class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, nextTick, onUnmounted } from 'vue'

// Library peta gratis: Leaflet (peta) + OpenStreetMap (tile)
// Geocoding & timezone: Nominatim (OSM) untuk alamat, TimeAPI.io untuk timezone — keduanya gratis tanpa API key
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const { user } = defineProps({
  user: Object
})

const branches = ref([
  {
    id: 1,
    name: 'Branch Jakarta Pusat',
    address: 'Jl. M.H. Thamrin No.1, Gondangdia, Menteng, Jakarta Pusat, DKI Jakarta',
    latitude: -6.1944,
    longitude: 106.8229,
    timezone: 'Asia/Jakarta (UTC+7)'
  },
  {
    id: 2,
    name: 'Branch Denpasar',
    address: 'Jl. Gatot Subroto, Denpasar, Bali',
    latitude: -8.6705,
    longitude: 115.2126,
    timezone: 'Asia/Bali (UTC+8)'
  },
])

const showModal = ref(false)
const showDeleteModal = ref(false)
const editingBranch = ref(null)
const branchToDelete = ref(null)
const searching = ref(false)
const searchError = ref('')

const form = reactive({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  timezone: ''
})

const searchQuery = ref('')
const mapContainer = ref(null)

let map = null
let marker = null

// Mencari lokasi berdasarkan teks menggunakan Nominatim (OpenStreetMap) - gratis, tanpa API key
async function searchLocation() {
  if (!searchQuery.value.trim()) return

  searching.value = true
  searchError.value = ''

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}&limit=1&addressdetails=1`,
      { headers: { 'Accept-Language': 'id' } }
    )
    const data = await res.json()

    if (data.length === 0) {
      searchError.value = 'Lokasi tidak ditemukan, coba kata kunci lain.'
      return
    }

    const result = data[0]
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)

    form.address = result.display_name
    await setLocation(lat, lng)
  } catch (err) {
    console.error('Gagal mencari lokasi:', err)
    searchError.value = 'Gagal menghubungi layanan pencarian lokasi.'
  } finally {
    searching.value = false
  }
}

// Reverse geocoding: koordinat -> alamat (Nominatim, gratis)
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { 'Accept-Language': 'id' } }
    )
    const data = await res.json()
    if (data.display_name) {
      form.address = data.display_name
    }
  } catch (err) {
    console.error('Gagal mengambil alamat:', err)
  }
}

// Mengambil timezone dari koordinat menggunakan TimeAPI.io (gratis, tanpa API key)
async function fetchTimezone(lat, lng) {
  try {
    const res = await fetch(
      `https://www.timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lng}`
    )
    const data = await res.json()

    if (data.timeZone) {
      const sign = data.currentUtcOffset?.seconds >= 0 ? '+' : '-'
      const offsetHours = Math.abs(data.currentUtcOffset?.seconds || 0) / 3600
      form.timezone = `${data.timeZone} (UTC${sign}${offsetHours})`
    }
  } catch (err) {
    console.error('Gagal mengambil timezone:', err)
    form.timezone = ''
  }
}

// Memperbarui koordinat, posisi peta & marker, lalu mengambil timezone
async function setLocation(lat, lng) {
  form.latitude = lat.toFixed(6)
  form.longitude = lng.toFixed(6)

  if (map && marker) {
    map.setView([lat, lng], 15)
    marker.setLatLng([lat, lng])
  }

  await fetchTimezone(lat, lng)
}

// Inisialisasi peta Leaflet + OpenStreetMap, klik & drag marker untuk pilih lokasi
async function initMap() {
  await nextTick()
  if (!mapContainer.value) return

  const initialLat = form.latitude ? parseFloat(form.latitude) : -6.2088
  const initialLng = form.longitude ? parseFloat(form.longitude) : 106.8456

  map = L.map(mapContainer.value).setView([initialLat, initialLng], form.latitude ? 15 : 11)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map)

  // Klik peta untuk memindahkan pin & ambil alamat + timezone
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng
    marker.setLatLng([lat, lng])
    await setLocation(lat, lng)
    await reverseGeocode(lat, lng)
  })

  // Geser pin untuk memindahkan lokasi
  marker.on('dragend', async () => {
    const pos = marker.getLatLng()
    await setLocation(pos.lat, pos.lng)
    await reverseGeocode(pos.lat, pos.lng)
  })

  // Pastikan peta tergambar dengan ukuran benar saat modal baru terbuka
  setTimeout(() => map && map.invalidateSize(), 200)
}

function destroyMap() {
  if (map) {
    map.remove()
    map = null
    marker = null
  }
}

function openAddModal() {
  editingBranch.value = null
  form.name = ''
  form.address = ''
  form.latitude = ''
  form.longitude = ''
  form.timezone = ''
  searchQuery.value = ''
  searchError.value = ''
  showModal.value = true

  nextTick(() => initMap())
}

function openEditModal(branch) {
  editingBranch.value = branch
  form.name = branch.name
  form.address = branch.address
  form.latitude = branch.latitude
  form.longitude = branch.longitude
  form.timezone = branch.timezone
  searchQuery.value = ''
  searchError.value = ''
  showModal.value = true

  nextTick(() => initMap())
}

function closeModal() {
  showModal.value = false
  editingBranch.value = null
  destroyMap()
}

function saveBranch() {
  if (!form.name.trim() || !form.address.trim()) return

  if (editingBranch.value) {
    editingBranch.value.name = form.name
    editingBranch.value.address = form.address
    editingBranch.value.latitude = form.latitude
    editingBranch.value.longitude = form.longitude
    editingBranch.value.timezone = form.timezone
  } else {
    const newId = branches.value.length
      ? Math.max(...branches.value.map(b => b.id)) + 1
      : 1
    branches.value.push({
      id: newId,
      name: form.name,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      timezone: form.timezone
    })
  }

  closeModal()
}

function confirmDelete(branch) {
  branchToDelete.value = branch
  showDeleteModal.value = true
}

function deleteBranch() {
  branches.value = branches.value.filter(b => b.id !== branchToDelete.value.id)
  showDeleteModal.value = false
  branchToDelete.value = null
}

onUnmounted(() => {
  destroyMap()
})
</script>