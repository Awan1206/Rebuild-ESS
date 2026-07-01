<template>
  <!-- Page Header -->
  <div class="flex items-start justify-between mb-4 lg:mb-7">
    <div>
      <h1 class="text-[20px] lg:text-[26px] font-bold text-[#1a1a2e] mb-0.5 lg:mb-1">Monitor Kehadiran</h1>
      <p class="text-[12px] lg:text-[13.5px] text-gray-400">Pantau status clock-in seluruh karyawan secara real-time.</p>
    </div>
    <div class="text-right">
      <div class="flex items-center justify-end gap-1 lg:gap-1.5 text-[15px] lg:text-xl font-bold text-[#1a1a2e]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lg:w-4 lg:h-4">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span class="tabular-nums">{{ currentTime }}</span>
      </div>
      <div class="flex items-center justify-end gap-1 text-[10px] lg:text-xs text-gray-400 mt-0.5 lg:mt-1">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lg:w-3 lg:h-3 flex-shrink-0">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <span class="whitespace-nowrap">Jakarta, Indonesia</span>
      </div>
    </div>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
    <div class="text-center bg-white rounded-2xl p-4 lg:p-5 border border-gray-200">
      <p class="text-[9px] lg:text-[10.5px] font-bold tracking-widest text-gray-400 mb-2 lg:mb-3">HADIR</p>
      <p class="text-[24px] lg:text-[32px] font-bold text-gray-900 leading-none mb-1.5 lg:mb-2">{{ stats.present }}</p>
      <p class="text-[10px] lg:text-[12px] text-gray-400">{{ presentPct }}% dari total karyawan</p>
    </div>
    <div class="text-center bg-white rounded-2xl p-4 lg:p-5 border border-gray-200">
      <p class="text-[9px] lg:text-[10.5px] font-bold tracking-widest text-gray-400 mb-2 lg:mb-3">TIDAK HADIR</p>
      <p class="text-[24px] lg:text-[32px] font-bold text-red-500 leading-none mb-1.5 lg:mb-2">{{ stats.absent }}</p>
      <p class="text-[10px] lg:text-[12px] text-gray-400">Total karyawan yang tidak hadir</p>
    </div>
  </div>

  <!-- Main Card -->
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">

    <!-- Top Bar -->
    <div class="flex items-center justify-between px-7 py-5 border-b border-gray-200 flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <h2 class="text-[17px] font-bold text-gray-900">Data Kehadiran</h2>
        <span class="text-[12.5px] text-gray-400">{{ filteredData.length }} karyawan</span>
      </div>
      <div class="flex items-center gap-3">
        <span
          v-if="!isCurrentMonthSelected"
          class="text-[11.5px] font-semibold text-gray-600 bg-gray-100 rounded-lg px-3 py-1.5"
        >
          {{ selectedMonthLabel }}
        </span>
        <button @click="resetFilter" class="hidden md:flex text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-lg px-3.5 py-2 hover:bg-gray-50 transition-colors whitespace-nowrap">
          Reset filter
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         DESKTOP Filter Row (md and above)
         ═══════════════════════════════════════════════ -->
    <div class="hidden md:flex flex-col gap-3 px-7 py-5 border-b border-gray-200 bg-gray-50/60">
      <!-- Search -->
      <div class="relative">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          v-model="filters.search"
          placeholder="Ketik nama karyawan..."
          class="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <!-- Dropdowns -->
      <div class="grid grid-cols-4 gap-3">
        <div class="flex flex-col gap-2">
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">BRANCH</label>
          <select v-model="filters.branch" class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option value="">Semua branch</option>
            <option v-for="b in branchList" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">DIVISI</label>
          <select v-model="filters.division" class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option value="">Semua divisi</option>
            <option v-for="d in divisionList" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">BULAN</label>
          <input
            type="month"
            v-model="filters.month"
            class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">STATUS</label>
          <select v-model="filters.status" class="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <option value="">Semua status</option>
            <option value="present">Hadir</option>
            <option value="late">Terlambat</option>
            <option value="absent">Tidak hadir</option>
            <option value="leave">Izin / Cuti</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         MOBILE Search + Filter Button (below md)
         ═══════════════════════════════════════════════ -->
    <div class="flex md:hidden items-center gap-2 px-4 py-4 border-b border-gray-200 bg-gray-50/60">
      <!-- Search -->
      <div class="relative flex-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          v-model="filters.search"
          placeholder="Cari karyawan..."
          class="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <!-- Filter Button -->
      <button
        @click="openFilterDrawer"
        class="relative flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex-shrink-0"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
        </svg>
        Filter
        <!-- Active filter badge -->
        <span
          v-if="activeFilterCount > 0"
          class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-900 text-white text-[9px] font-bold flex items-center justify-center"
        >{{ activeFilterCount }}</span>
      </button>
    </div>

    <!-- Mobile Table Cards -->
    <div v-if="!isDesktop" class="flex flex-col divide-y divide-gray-100">
      <div v-if="paginatedData.length === 0" class="text-center text-[13px] text-gray-400 py-14">
        Tidak ada data yang sesuai filter.
      </div>
      <div v-for="row in paginatedData" :key="row.id" class="px-6 py-5 flex flex-col gap-3">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] text-gray-400 font-mono mb-0.5">{{ row.employeeId }}</p>
            <p class="text-[14px] font-semibold text-gray-900">{{ row.name }}</p>
            <p class="text-[12px] text-gray-400 mt-0.5">{{ row.division }} · {{ row.displayLocation }}</p>
          </div>
          <span class="text-[12.5px] font-semibold" :class="statusTextClass(row.displayStatus)">
            {{ statusLabel(row.displayStatus) }}
          </span>
        </div>
        <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p class="text-[9.5px] font-bold tracking-[0.12em] text-gray-400 mb-1">JAM MASUK</p>
          <p class="text-[13px] font-bold text-gray-900 tabular-nums">{{ row.displayClockIn || '—' }}</p>
          <p v-if="row.displayLateMinutes" class="text-[11px] text-amber-500 mt-0.5">+{{ row.displayLateMinutes }} mnt</p>
        </div>
        <button
          @click="goToDetail(row)"
          class="mt-1 w-full inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-gray-600 border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/></svg>
          Lihat detail
        </button>
      </div>
    </div>

    <!-- Desktop Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[1200px] border-collapse">
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr class="text-center text-xs font-bold tracking-[0.1em] text-gray-600">
            <th class="px-6 py-4 w-[80px] border-r border-gray-200">ID</th>
            <th class="px-8 py-4 w-[180px] border-r border-gray-200">NAMA</th>
            <th class="px-6 py-4 w-[140px] border-r border-gray-200">DIVISI</th>
            <th class="px-6 py-4 w-[150px] border-r border-gray-200">CABANG</th>
            <th class="px-6 py-4 w-[120px] border-r border-gray-200">JAM MASUK</th>
            <th class="px-6 py-4 w-[140px] border-r border-gray-200">STATUS</th>
            <th class="px-3 py-4 w-[60px]">AKSI</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="paginatedData.length === 0">
            <td colspan="7" class="text-center text-[13px] text-gray-400 py-14">Tidak ada data yang sesuai filter.</td>
          </tr>
          <tr
            v-for="row in paginatedData"
            :key="row.id"
            class="hover:bg-gray-50/70 transition-colors"
          >
            <td class="px-6 py-2 text-center text-[12px] text-gray-500 font-mono border-r border-gray-200">{{ row.employeeId }}</td>
            <td class="px-4 py-2 border-r border-gray-200">
              <span class="text-[13.5px] text-gray-900">{{ row.name }}</span>
            </td>
            <td class="px-6 py-2 text-[13px] text-gray-500 border-r border-gray-200">{{ row.division }}</td>
            <td class="px-6 py-2 text-[13px] text-gray-500 border-r border-gray-200">{{ row.displayLocation || '—' }}</td>
            <td class="px-6 py-2 border-r border-gray-200">
              <span v-if="row.displayClockIn" class="text-[13px] font-semibold text-gray-900 tabular-nums">{{ row.displayClockIn }}</span>
              <span v-else class="text-gray-300 text-[13px]">—</span>
              <span v-if="row.displayLateMinutes" class="ml-2 text-[11px] text-amber-500 font-semibold">+{{ row.displayLateMinutes }}m</span>
            </td>
            <td class="px-6 py-2 border-r border-gray-200">
              <span class="text-[13px] font-semibold" :class="statusTextClass(row.displayStatus)">
                {{ statusLabel(row.displayStatus) }}
              </span>
            </td>
            <td class="px-3 py-2 w-[60px] text-center">
              <button
                @click="goToDetail(row)"
                class="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white border bg-blue-500 rounded-lg px-3 py-2 hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/></svg>
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-7 py-5 border-t border-gray-200">
      <p class="text-[12.5px] text-gray-400">Halaman {{ currentPage }} dari {{ totalPages }}</p>
      <div class="flex gap-1.5">
        <button
          @click="currentPage--"
          :disabled="currentPage <= 1"
          class="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 text-[13px] font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >‹</button>
        <button
          v-for="p in totalPages"
          :key="p"
          @click="currentPage = p"
          class="w-9 h-9 rounded-lg text-[13px] font-semibold transition-colors"
          :class="p === currentPage ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'"
        >{{ p }}</button>
        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 text-[13px] font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >›</button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════
       MOBILE FILTER DRAWER (bottom sheet)
       ═══════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="filterDrawerOpen"
        class="fixed inset-0 z-40 bg-black/40 md:hidden"
        @click="closeFilterDrawer"
      />
    </Transition>

    <!-- Bottom Sheet -->
    <Transition name="slide-up">
      <div
        v-if="filterDrawerOpen"
        class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl"
      >
        <!-- Drag Handle -->
        <div class="flex justify-center pt-3 pb-1">
          <div class="w-10 h-1 rounded-full bg-gray-200"></div>
        </div>

        <!-- Drawer Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 class="text-[15px] font-bold text-gray-900">Filter</h3>
          <button @click="closeFilterDrawer" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Drawer Body -->
        <div class="px-5 py-5 flex flex-col gap-5 overflow-y-auto max-h-[60vh]">

          <!-- Branch -->
          <div class="flex flex-col gap-2">
            <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">BRANCH</label>
            <select v-model="drawerFilters.branch" class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option value="">Semua branch</option>
              <option v-for="b in branchList" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>

          <!-- Divisi -->
          <div class="flex flex-col gap-2">
            <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">DIVISI</label>
            <select v-model="drawerFilters.division" class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option value="">Semua divisi</option>
              <option v-for="d in divisionList" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <!-- Bulan -->
          <div class="flex flex-col gap-2">
            <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">BULAN</label>
            <input
              type="month"
              v-model="drawerFilters.month"
              class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <!-- Status -->
          <div class="flex flex-col gap-2">
            <label class="text-[10.5px] font-bold tracking-[0.12em] text-gray-400">STATUS</label>
            <select v-model="drawerFilters.status" class="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300">
              <option value="">Semua status</option>
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div class="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button
            @click="resetDrawerFilters"
            class="flex-1 py-3 rounded-xl border border-gray-200 text-[13.5px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            @click="applyDrawerFilters"
            class="flex-[2] py-3 rounded-xl bg-gray-900 text-white text-[13.5px] font-semibold hover:bg-gray-700 transition-colors"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useMonitor } from '@/composables/attendance/useMonitor.js'
import { useIsDesktop } from '@/composables/useMediaQuery.js'

const isDesktop = useIsDesktop()

const { user } = defineProps({
  user: Object
})

const {
  currentTime,
  branchList,
  divisionList,
  statusOptions,
  filters,
  filterDrawerOpen,
  drawerFilters,
  activeFilterCount,
  openFilterDrawer,
  closeFilterDrawer,
  applyDrawerFilters,
  resetDrawerFilters,
  resetFilter,
  isCurrentMonthSelected,
  selectedMonthLabel,
  filteredData,
  stats,
  presentPct,
  currentPage,
  totalPages,
  paginatedData,
  goToDetail,
  statusLabel,
  statusTextClass,
} = useMonitor()
</script>

<style scoped>
/* Filter drawer slide-up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Backdrop fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>