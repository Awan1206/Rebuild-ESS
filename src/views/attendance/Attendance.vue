<template>
  <!-- Page Header -->
  <div class="flex items-start justify-between mb-4 lg:mb-7">
    <div>
      <h1 class="text-[20px] lg:text-[26px] font-bold text-[#1a1a2e] mb-0.5 lg:mb-1">Riwayat Kehadiran</h1>
      <p class="text-[12px] lg:text-[13.5px] text-gray-400">Pantau dan kelola riwayat kehadiran Anda.</p>
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
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
    <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200">
      <p class="text-[9px] lg:text-[10.5px] font-bold tracking-widest text-gray-400 mb-2 lg:mb-3">PERSENTASE TEPAT WAKTU</p>
      <p class="text-[24px] lg:text-[32px] font-bold text-gray-900 leading-none mb-1.5 lg:mb-2">{{ summary.onTimeRate }}%</p>
      <p class="text-[10px] lg:text-[12px] text-gray-400">Dari hari hadir bulan ini</p>
    </div>
    <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200">
      <p class="text-[9px] lg:text-[10.5px] font-bold tracking-widest text-gray-400 mb-2 lg:mb-3">TOTAL HARI HADIR</p>
      <p class="text-[24px] lg:text-[32px] font-bold text-gray-900 leading-none mb-1.5 lg:mb-2">{{ summary.totalHariHadir }}</p>
      <p class="text-[10px] lg:text-[12px] text-gray-400">Termasuk hari terlambat</p>
    </div>
    <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200">
      <p class="text-[9px] lg:text-[10.5px] font-bold tracking-widest text-gray-400 mb-2 lg:mb-3">TOTAL KETERLAMBATAN</p>
      <p class="text-[24px] lg:text-[32px] font-bold text-gray-900 leading-none mb-1.5 lg:mb-2">{{ summary.totalKeterlambatanHari }} <span class="text-[14px] lg:text-[16px]">hari</span></p>
      <p class="text-[10px] lg:text-[12px] text-gray-400">Total durasi: {{ summary.totalKeterlambatanDurasi }}</p>
    </div>
    <div class="bg-white rounded-2xl p-4 lg:p-5 border border-gray-200">
      <p class="text-[9px] lg:text-[10.5px] font-bold tracking-widest text-gray-400 mb-2 lg:mb-3">TOTAL HARI TIDAK HADIR</p>
      <p class="text-[24px] lg:text-[32px] font-bold text-red-500 leading-none mb-1.5 lg:mb-2">{{ summary.totalHariTidakHadir }}</p>
      <p class="text-[10px] lg:text-[12px] text-gray-400">Sakit, izin, & tanpa keterangan</p>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════
       DESKTOP LAYOUT (≥ lg)
  ══════════════════════════════════════════════════ -->
  <div v-if="isDesktop">

    <!-- Calendar Card -->
    <div class="bg-white rounded-2xl border border-gray-200 ring-1 ring-gray-100 overflow-hidden">
      <!-- Calendar Top Bar -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <button @click="prevMonth" class="w-8 h-8 flex items-center justify-center hover:text-gray-800 transition-colors text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h2 class="text-[17px] font-bold text-[#1a1a2e] select-none">{{ monthYearLabel }}</h2>
          <button @click="nextMonth" class="w-8 h-8 flex items-center justify-center hover:text-gray-800 transition-colors text-gray-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <button @click="goToday" class="text-[12.5px] font-semibold text-[#1e3a5f] border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors">
          Today
        </button>
      </div>

      <!-- Day Headers -->
      <div class="grid grid-cols-7 border-b border-gray-200">
        <div
          v-for="(d, i) in dayHeaders"
          :key="d"
          class="text-center text-[12px] font-bold py-3 border-r border-gray-100 last:border-r-0"
          :class="i === 0 || i === 6 ? 'text-gray-400' : 'text-gray-500'"
        >{{ d }}</div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7">
        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          @click="cell.currentMonth && cell.events.length && openDetail(cell.events[0], cell)"
          class="min-h-[100px] lg:min-h-[120px] border-b border-r border-gray-200 last:border-r-0 p-3 relative transition-colors"
          :class="{
            'cursor-pointer hover:bg-gray-50': cell.currentMonth && cell.events.length,
            'ring-1 ring-inset ring-[#1e3a5f] ring-opacity-40': cell.isToday,
            'bg-white': cell.currentMonth,
            'bg-gray-100': !cell.currentMonth,
          }"
        >
          <span class="text-[13px] font-semibold block mb-auto" :class="dateTextColor(cell)">
            {{ cell.day }}
          </span>

          <div v-if="cell.events.length" class="mt-auto pt-4 text-center">
            <div
              v-for="event in cell.events"
              :key="event.id"
            >
              <span class="text-[12.5px] font-semibold" :class="statusTextColor(event.type)">{{ event.label }}</span>
            </div>
            <p v-if="cell.events[0]?.clockIn" class="text-[11px] text-gray-400 mt-0.5">
              {{ cell.events[0].clockIn }} - {{ cell.events[0].clockOut }}
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- ══════════════════════════════════════════════════
       MOBILE LAYOUT (< lg)
  ══════════════════════════════════════════════════ -->
  <div v-else class="flex flex-col gap-4">

    <!-- Calendar Card Mobile -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <!-- Calendar Top Bar -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <button @click="prevMonth" class="w-7 h-7 flex items-center justify-center hover:text-gray-800 transition-colors text-gray-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h2 class="text-[14px] font-bold text-[#1a1a2e]">{{ monthYearLabel }}</h2>
          <button @click="nextMonth" class="w-7 h-7 flex items-center justify-center hover:text-gray-800 transition-colors text-gray-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <button @click="goToday" class="text-[11px] font-semibold text-[#1e3a5f] border border-gray-300 rounded-lg px-2.5 py-1 hover:bg-blue-50 transition-colors">
          Today
        </button>
      </div>

      <!-- Day Headers Mobile -->
      <div class="grid grid-cols-7 border-b border-gray-200">
        <div
          v-for="(d, i) in dayHeaders"
          :key="'mhdr-' + d"
          class="text-center text-[9px] font-bold py-2 border-r border-gray-100 last:border-r-0"
          :class="i === 0 || i === 6 ? 'text-gray-300' : 'text-gray-400'"
        >{{ d }}</div>
      </div>

      <!-- Calendar Grid Mobile -->
      <div class="grid grid-cols-7">
        <div
          v-for="(cell, idx) in calendarCells"
          :key="'mcell-' + idx"
          @click="cell.currentMonth && cell.events.length && openDetail(cell.events[0], cell)"
          class="min-h-[64px] border-b border-r border-gray-200 last:border-r-0 p-1.5 relative transition-colors"
          :class="{
            'cursor-pointer active:bg-gray-50': cell.currentMonth && cell.events.length,
            'ring-1 ring-inset ring-[#1e3a5f] ring-opacity-40': cell.isToday,
            'bg-white': cell.currentMonth,
            'bg-gray-100': !cell.currentMonth,
          }"
        >
          <!-- Date Number -->
          <span class="text-[13px] font-semibold block mb-auto" :class="dateTextColor(cell)">
            {{ cell.day }}
          </span>

          <!-- Label -->
          <div v-if="cell.events.length" class="mt-1 text-center">
            <div
              v-for="event in cell.events"
              :key="event.id + '-m'"
            >
              <span class="text-[9px] font-semibold leading-tight" :class="statusTextColor(event.type)">{{ event.label }}</span>
            </div>
            <p v-if="cell.events[0]?.clockIn" class="text-[8px] text-gray-400 mt-0.5 leading-tight">
              {{ cell.events[0].clockIn }}<br/>{{ cell.events[0].clockOut }}
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Detail Modal (shared desktop & mobile) -->
  <Transition name="fade">
    <div
      v-if="detailModal.show"
      class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
    >
      <div class="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">
        <div class="px-6 py-6">
          <!-- Modal Header -->
          <div class="flex items-start justify-between mb-5">
            <div>
              <p class="text-[12px] text-gray-400 mb-1">{{ detailModal.dateLabel }}</p>
              <div class="flex items-center gap-2">
                <h3 class="text-[20px] font-bold" :class="statusTextColor(detailModal.event?.type)">{{ typeLabelMap[detailModal.event?.type] }}</h3>
              </div>
            </div>
          </div>

          <!-- Clock In/Out -->
          <div v-if="detailModal.event?.clockIn" class="flex gap-3 mb-4">
            <div class="bg-gray-50 rounded-xl px-4 py-3 flex-1 border border-gray-100">
              <p class="text-[10px] font-bold tracking-widest text-gray-400 mb-1">MASUK</p>
              <p class="text-[18px] font-bold text-[#1a1a2e]">{{ detailModal.event.clockIn }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl px-4 py-3 flex-1 border border-gray-100">
              <p class="text-[10px] font-bold tracking-widest text-gray-400 mb-1">PULANG</p>
              <p class="text-[18px] font-bold text-[#1a1a2e]">{{ detailModal.event.clockOut }}</p>
            </div>
          </div>

          <!-- Duration -->
          <div v-if="detailModal.event?.duration" class="bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-100">
            <p class="text-[10px] font-bold tracking-widest text-gray-400 mb-1">DURASI KERJA</p>
            <p class="text-[22px] font-bold text-[#1a1a2e] tabular-nums">{{ detailModal.event.duration }}</p>
          </div>

          <!-- Note -->
          <div v-if="detailModal.event?.note" class="bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-100">
            <p class="text-[10px] font-bold tracking-widest text-gray-400 mb-1">KETERANGAN</p>
            <p class="text-[13px] text-gray-600">{{ detailModal.event.note }}</p>
          </div>

          <!-- Late Badge -->
          <div v-if="detailModal.event?.lateMin" class="flex items-center gap-2 bg-orange-50 rounded-xl px-4 py-3 mb-4 border border-orange-100">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p class="text-[13px] font-semibold text-orange-500">Terlambat {{ detailModal.event.lateMin }} menit</p>
          </div>

          <button
            @click="detailModal.show = false"
            class="w-full bg-gradient-to-br from-[#315e90] to-[#4b77aa] text-white rounded-xl py-3 text-[14px] font-semibold hover:brightness-90"
          >Tutup</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useAttendance } from '@/composables/attendance/useAttendance.js'
import { useIsDesktop } from '@/composables/useMediaQuery.js'

const isDesktop = useIsDesktop()

const { user } = defineProps({
  user: Object
})

const {
  currentTime,
  currentYear,
  currentMonth,
  dayHeaders,
  monthYearLabel,
  prevMonth,
  nextMonth,
  goToday,
  dateTextColor,
  summary,
  calendarCells,
  statusTextColor,
  detailModal,
  openDetail,
  typeLabelMap,
} = useAttendance()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>