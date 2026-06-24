<template>
  <div class="flex flex-col gap-6">

    <!-- Page Header -->
    <div class="flex items-start justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-[26px] font-bold text-[#1a1a2e] mb-1">Monitoring Kehadiran</h1>
        <p class="text-[13.5px] text-gray-400">Pantau status clock in / clock out seluruh karyawan secara real-time.</p>
      </div>
      <div class="text-right hidden sm:block">
        <div class="flex items-center justify-end gap-1.5 text-xl font-bold text-[#1a1a2e]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="tabular-nums">{{ currentTime }}</span>
        </div>
        <div class="flex items-center justify-end gap-1 text-xs text-gray-400 mt-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ todayLabel }}
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-gray-200">
        <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-3">TOTAL KARYAWAN</p>
        <p class="text-[32px] font-bold text-[#1a1a2e] leading-none mb-2">{{ stats.total }}</p>
        <p class="text-[12px] text-gray-400">Karyawan aktif terdaftar</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-200">
        <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-3">HADIR</p>
        <p class="text-[32px] font-bold text-green-600 leading-none mb-2">{{ stats.present }}</p>
        <p class="text-[12px] text-green-500 font-semibold flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
          {{ presentPct }}% dari total karyawan
        </p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-200">
        <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-3">TERLAMBAT</p>
        <p class="text-[32px] font-bold text-yellow-500 leading-none mb-2">{{ stats.late }}</p>
        <p class="text-[12px] text-gray-400">Clock in setelah jam 08:00</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-200">
        <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-3">TIDAK HADIR</p>
        <p class="text-[32px] font-bold text-red-500 leading-none mb-2">{{ stats.absent }}</p>
        <p class="text-[12px] text-gray-400">Tidak termasuk izin / cuti</p>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-2xl border border-gray-200 ring-1 ring-gray-100 overflow-hidden">

      <!-- Top Bar -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <h2 class="text-[17px] font-bold text-[#1a1a2e]">Data Kehadiran</h2>
          <span class="text-[12px] text-gray-400">{{ filteredData.length }} karyawan ditemukan</span>
        </div>
        <button @click="resetFilter" class="text-[12.5px] font-semibold text-[#1e3a5f] border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors">
          Reset filter
        </button>
      </div>

      <!-- Filter Row -->
      <div class="flex flex-wrap gap-4 items-end px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div class="flex flex-col gap-1.5 flex-1 min-w-[160px]">
          <label class="text-[10.5px] font-bold tracking-widest text-gray-400">KARYAWAN</label>
          <select v-model="filters.employee" class="bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#315e90]/30">
            <option value="">Semua karyawan</option>
            <option v-for="emp in employeeList" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1.5 flex-1 min-w-[130px]">
          <label class="text-[10.5px] font-bold tracking-widest text-gray-400">TANGGAL</label>
          <input type="date" v-model="filters.date" class="bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#315e90]/30" />
        </div>
        <div class="flex flex-col gap-1.5 flex-1 min-w-[130px]">
          <label class="text-[10.5px] font-bold tracking-widest text-gray-400">BULAN</label>
          <select v-model="filters.month" class="bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#315e90]/30">
            <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-1.5 flex-1 min-w-[130px]">
          <label class="text-[10.5px] font-bold tracking-widest text-gray-400">STATUS</label>
          <select v-model="filters.status" class="bg-white border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#315e90]/30">
            <option value="">Semua status</option>
            <option value="present">Hadir</option>
            <option value="late">Terlambat</option>
            <option value="absent">Tidak hadir</option>
            <option value="leave">Izin / Cuti</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button @click="applyFilter" class="bg-gradient-to-br from-[#315e90] to-[#4b77aa] text-white rounded-xl px-5 py-2 text-[13px] font-semibold active:scale-95 transition-transform">
            Tampilkan
          </button>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left text-[10px] font-bold tracking-widest text-gray-400 px-6 py-3">NAMA</th>
              <th class="text-left text-[10px] font-bold tracking-widest text-gray-400 px-4 py-3">ID</th>
              <th class="text-left text-[10px] font-bold tracking-widest text-gray-400 px-4 py-3">CLOCK IN</th>
              <th class="text-left text-[10px] font-bold tracking-widest text-gray-400 px-4 py-3">CLOCK OUT</th>
              <th class="text-left text-[10px] font-bold tracking-widest text-gray-400 px-4 py-3">DURASI</th>
              <th class="text-left text-[10px] font-bold tracking-widest text-gray-400 px-4 py-3">STATUS</th>
              <th class="text-left text-[10px] font-bold tracking-widest text-gray-400 px-4 py-3">LOKASI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedData.length === 0">
              <td colspan="7" class="text-center text-[13px] text-gray-400 py-10">Tidak ada data yang sesuai filter.</td>
            </tr>
            <tr
              v-for="row in paginatedData"
              :key="row.id"
              class="border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-[#e8f0f9] text-[#1e3a5f] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    {{ initials(row.name) }}
                  </div>
                  <span class="text-[13px] font-semibold text-[#1a1a2e]">{{ row.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-[12px] text-gray-400 font-mono">{{ row.employeeId }}</td>
              <td class="px-4 py-3">
                <span v-if="row.clockIn" class="text-[13px] font-semibold text-[#1a1a2e] tabular-nums">{{ row.clockIn }}</span>
                <span v-else class="text-gray-300 text-[13px]">—</span>
                <span v-if="row.lateMinutes" class="ml-1.5 text-[11px] bg-yellow-50 text-yellow-600 font-semibold rounded-md px-1.5 py-0.5">+{{ row.lateMinutes }}m</span>
              </td>
              <td class="px-4 py-3">
                <span v-if="row.clockOut" class="text-[13px] font-semibold text-[#1a1a2e] tabular-nums">{{ row.clockOut }}</span>
                <span v-else class="text-gray-300 text-[13px]">—</span>
              </td>
              <td class="px-4 py-3 text-[12.5px] text-gray-500 tabular-nums">{{ row.duration || '—' }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 text-[11.5px] font-semibold rounded-full px-2.5 py-1" :class="statusClass(row.status)">
                  <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(row.status)"></span>
                  {{ statusLabel(row.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-[12.5px] text-gray-500">{{ row.location || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden flex flex-col divide-y divide-gray-100">
        <div v-if="paginatedData.length === 0" class="text-center text-[13px] text-gray-400 py-10">
          Tidak ada data yang sesuai filter.
        </div>
        <div v-for="row in paginatedData" :key="row.id" class="px-6 py-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-[#e8f0f9] text-[#1e3a5f] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                {{ initials(row.name) }}
              </div>
              <div>
                <p class="text-[13px] font-semibold text-[#1a1a2e]">{{ row.name }}</p>
                <p class="text-[11px] text-gray-400 font-mono">{{ row.employeeId }}</p>
              </div>
            </div>
            <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1" :class="statusClass(row.status)">
              <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(row.status)"></span>
              {{ statusLabel(row.status) }}
            </span>
          </div>
          <div class="flex gap-3 mt-1">
            <div class="bg-gray-50 rounded-xl px-3 py-2 flex-1">
              <p class="text-[9.5px] font-bold tracking-widest text-gray-400 mb-0.5">CLOCK IN</p>
              <p class="text-[13px] font-bold text-[#1a1a2e] tabular-nums">{{ row.clockIn || '—' }}</p>
              <p v-if="row.lateMinutes" class="text-[11px] text-yellow-600">+{{ row.lateMinutes }} menit</p>
            </div>
            <div class="bg-gray-50 rounded-xl px-3 py-2 flex-1">
              <p class="text-[9.5px] font-bold tracking-widest text-gray-400 mb-0.5">CLOCK OUT</p>
              <p class="text-[13px] font-bold text-[#1a1a2e] tabular-nums">{{ row.clockOut || '—' }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl px-3 py-2 flex-1">
              <p class="text-[9.5px] font-bold tracking-widest text-gray-400 mb-0.5">DURASI</p>
              <p class="text-[13px] font-bold text-[#1a1a2e] tabular-nums">{{ row.duration || '—' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <p class="text-[12px] text-gray-400">Halaman {{ currentPage }} dari {{ totalPages }}</p>
        <div class="flex gap-1.5">
          <button
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 text-[12px] font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >‹</button>
          <button
            v-for="p in totalPages"
            :key="p"
            @click="currentPage = p"
            class="w-8 h-8 rounded-lg text-[12px] font-semibold transition-colors"
            :class="p === currentPage ? 'bg-[#1e3a5f] text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'"
          >{{ p }}</button>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 text-[12px] font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >›</button>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <div v-for="l in legend" :key="l.label" class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full" :class="l.dot"></span>
        <span class="text-[12px] text-gray-500">{{ l.label }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ── Live Clock & Date ─────────────────────────────────────────────
const currentTime = ref('')
let timer
function updateTime() {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}
onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))

const todayLabel = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

// ── Sample Data (ganti dengan API call) ───────────────────────────
const rawData = ref([
  { id: 1, name: 'Budi Santoso',       employeeId: 'EMP001', clockIn: '07:52', clockOut: '17:10', duration: '9j 18m', status: 'present', location: 'Kantor Pusat', lateMinutes: null },
  { id: 2, name: 'Dewi Rahayu',        employeeId: 'EMP002', clockIn: '08:24', clockOut: '17:05', duration: '8j 41m', status: 'late',    location: 'Kantor Pusat', lateMinutes: 24 },
  { id: 3, name: 'Farhan Maulana',     employeeId: 'EMP003', clockIn: null,    clockOut: null,    duration: null,     status: 'absent',  location: null,           lateMinutes: null },
  { id: 4, name: 'Hana Pertiwi',       employeeId: 'EMP004', clockIn: '07:45', clockOut: '16:58', duration: '9j 13m', status: 'present', location: 'WFH',          lateMinutes: null },
  { id: 5, name: 'Irfan Hakim',        employeeId: 'EMP005', clockIn: '08:41', clockOut: '17:30', duration: '8j 49m', status: 'late',    location: 'Kantor Pusat', lateMinutes: 41 },
  { id: 6, name: 'Lestari Wulandari',  employeeId: 'EMP006', clockIn: null,    clockOut: null,    duration: null,     status: 'leave',   location: null,           lateMinutes: null },
  { id: 7, name: 'Muhammad Rizky',     employeeId: 'EMP007', clockIn: '07:59', clockOut: '17:02', duration: '9j 03m', status: 'present', location: 'WFH',          lateMinutes: null },
  { id: 8, name: 'Nadia Putri',        employeeId: 'EMP008', clockIn: '07:50', clockOut: null,    duration: null,     status: 'present', location: 'Kantor Pusat', lateMinutes: null },
  { id: 9, name: 'Oka Prasetya',       employeeId: 'EMP009', clockIn: '08:03', clockOut: '17:15', duration: '9j 12m', status: 'present', location: 'Kantor Pusat', lateMinutes: null },
  { id: 10, name: 'Putri Anggraini',   employeeId: 'EMP010', clockIn: null,    clockOut: null,    duration: null,     status: 'absent',  location: null,           lateMinutes: null },
])

const employeeList = computed(() => rawData.value.map(r => ({ id: r.id, name: r.name })))

const months = [
  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },   { value: 5, label: 'Mei' },      { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },    { value: 8, label: 'Agustus' },  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },{ value: 11, label: 'November' },{ value: 12, label: 'Desember' },
]

// ── Filter State ───────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10)
const filters = ref({ employee: '', date: today, month: new Date().getMonth() + 1, status: '' })
const activeFilters = ref({ ...filters.value })

function applyFilter() { activeFilters.value = { ...filters.value }; currentPage.value = 1 }
function resetFilter() {
  filters.value = { employee: '', date: today, month: new Date().getMonth() + 1, status: '' }
  applyFilter()
}

// ── Computed ────────────────────────────────────────────────────────
const filteredData = computed(() =>
  rawData.value.filter(r => {
    const f = activeFilters.value
    if (f.employee && r.id !== f.employee) return false
    if (f.status && r.status !== f.status) return false
    return true
  })
)

const stats = computed(() => ({
  total:   rawData.value.length,
  present: rawData.value.filter(r => r.status === 'present').length,
  late:    rawData.value.filter(r => r.status === 'late').length,
  absent:  rawData.value.filter(r => r.status === 'absent').length,
}))

const presentPct = computed(() => stats.value.total ? Math.round((stats.value.present / stats.value.total) * 100) : 0)

const perPage = 8
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / perPage)))
const paginatedData = computed(() =>
  filteredData.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
)

// ── Helpers ──────────────────────────────────────────────────────────
function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function statusLabel(s) {
  return { present: 'Hadir', late: 'Terlambat', absent: 'Tidak hadir', leave: 'Izin/Cuti' }[s] || s
}

function statusClass(s) {
  return {
    present: 'bg-green-50 text-green-700',
    late:    'bg-yellow-50 text-yellow-700',
    absent:  'bg-red-50 text-red-600',
    leave:   'bg-purple-50 text-purple-700',
  }[s] || ''
}

function dotClass(s) {
  return {
    present: 'bg-green-500',
    late:    'bg-yellow-400',
    absent:  'bg-red-400',
    leave:   'bg-purple-400',
  }[s] || 'bg-gray-300'
}

// ── Legend ─────────────────────────────────────────────────────────
const legend = [
  { label: 'Hadir',        dot: 'bg-green-500' },
  { label: 'Terlambat',    dot: 'bg-yellow-400' },
  { label: 'Tidak Hadir',  dot: 'bg-red-400' },
  { label: 'Izin / Cuti',  dot: 'bg-purple-400' },
]
</script>