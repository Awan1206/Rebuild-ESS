<template>
  <!-- Page Header -->
  <div class="flex items-start justify-between mb-7">
    <div>
      <h1 class="text-[26px] font-bold text-[#1a1a2e] mb-1">Riwayat Kehadiran</h1>
      <p class="text-[13.5px] text-gray-400">Pantau dan kelola riwayat kehadiran Anda.</p>
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
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        Jakarta, Indonesia
      </div>
    </div>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-white rounded-2xl p-5 border border-gray-200">
      <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-3">ON-TIME RATE</p>
      <p class="text-[32px] font-bold text-[#1a1a2e] leading-none mb-2">{{ summary.onTimeRate }}%</p>
      <p class="text-[12px] text-green-500 font-semibold flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        2.4% from last month
      </p>
    </div>
    <div class="bg-white rounded-2xl p-5 border border-gray-200">
      <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-3">TOTAL HOURS</p>
      <p class="text-[32px] font-bold text-[#1a1a2e] leading-none mb-2">{{ summary.totalHours }}</p>
      <p class="text-[12px] text-gray-400">Standard expected: 160h</p>
    </div>
    <div class="bg-white rounded-2xl p-5 border border-gray-200">
      <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-3">OVERTIME</p>
      <p class="text-[32px] font-bold text-red-500 leading-none mb-2">{{ summary.overtime }}h</p>
      <p class="text-[12px] text-gray-400">Approved by HR</p>
    </div>
    <div class="bg-white rounded-2xl p-5 border border-gray-200">
      <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-3">DAYS ABSENT</p>
      <p class="text-[32px] font-bold text-[#1a1a2e] leading-none mb-2">{{ summary.daysAbsent }}</p>
      <p class="text-[12px] text-gray-400">Casual Leave applied</p>
    </div>
  </div>

  <!-- Calendar Card -->
  <div class="bg-white rounded-2xl border border-gray-200 ring-1 ring-gray-100 overflow-hidden">
    <!-- Calendar Top Bar -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <button @click="prevMonth" class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h2 class="text-[17px] font-bold text-[#1a1a2e]">{{ monthYearLabel }}</h2>
        <button @click="nextMonth" class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500">
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
          'bg-gray-50/50': !cell.currentMonth,
        }"
      >
        <!-- Date Number -->
        <span
          class="text-[13px] font-semibold block mb-auto"
          :class="{
            'text-gray-300': !cell.currentMonth,
            'text-[#1a1a2e] font-bold': cell.currentMonth && !cell.isWeekend,
            'text-blue-500 font-bold': cell.isToday,
            'text-gray-400': cell.currentMonth && cell.isWeekend && !cell.isToday,
          }"
        >{{ cell.day }}</span>

        <!-- Status Badge -->
        <div v-if="cell.events.length" class="mt-auto pt-4">
          <div
            v-for="event in cell.events"
            :key="event.id"
            class="flex items-center gap-1.5"
          >
            <span class="w-2 h-2 rounded-full flex-shrink-0" :class="dotColor(event.type)"></span>
            <span class="text-[12.5px] font-semibold" :class="statusTextColor(event.type)">{{ event.label }}</span>
          </div>
          <p v-if="cell.events[0]?.clockIn" class="text-[11px] text-gray-400 mt-0.5 ml-3.5">
            {{ cell.events[0].clockIn }} - {{ cell.events[0].clockOut }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Legend -->
  <div class="flex flex-wrap gap-x-6 gap-y-2 mt-4">
    <div v-for="l in legend" :key="l.label" class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full" :class="l.dot"></span>
      <span class="text-[12px] text-gray-500">{{ l.label }}</span>
    </div>
  </div>

  <!-- Detail Modal -->
  <Transition name="fade">
    <div
      v-if="detailModal.show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.35)"
      @click.self="detailModal.show = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm p-6 border border-gray-100">
        <!-- Modal Header -->
        <div class="flex items-start justify-between mb-5">
          <div>
            <p class="text-[12px] text-gray-400 mb-1">{{ detailModal.dateLabel }}</p>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" :class="dotColor(detailModal.event?.type)"></span>
              <h3 class="text-[20px] font-bold" :class="statusTextColor(detailModal.event?.type)">{{ typeLabelMap[detailModal.event?.type] }}</h3>
            </div>
          </div>
          <button @click="detailModal.show = false" class="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
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
          class="w-full bg-[#1e3a5f] text-white rounded-xl py-3 text-[14px] font-semibold hover:bg-[#315e90] transition-colors"
        >Tutup</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { user } = defineProps({
  user: Object
})

// ── Clock ────────────────────────────────────────────
const currentTime = ref('')
let timer
function updateTime() {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}
onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))

// ── Calendar State ────────────────────────────────────
const today = new Date()
const currentYear  = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const dayHeaders = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']

const monthYearLabel = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1)
    .toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
)

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}
function goToday() {
  currentYear.value  = today.getFullYear()
  currentMonth.value = today.getMonth()
}

// ── Attendance Data ───────────────────────────────────
const attendanceData = {
  [`2026-5-1`]:  { type: 'present', clockIn: '08:02', clockOut: '17:05', duration: '09:03', note: null },
  [`2026-5-2`]:  { type: 'present', clockIn: '07:58', clockOut: '17:00', duration: '09:02', note: null },
  [`2026-5-3`]:  { type: 'late',    clockIn: '09:15', clockOut: '17:10', duration: '07:55', note: null, lateMin: 75 },
  [`2026-5-4`]:  { type: 'present', clockIn: '08:00', clockOut: '17:00', duration: '09:00', note: null },
  [`2026-5-5`]:  { type: 'sick',    clockIn: null,    clockOut: null,    duration: null,    note: 'Sakit demam, sudah kirim surat dokter' },
  [`2026-5-8`]:  { type: 'present', clockIn: '08:05', clockOut: '17:05', duration: '09:00', note: null },
  [`2026-5-9`]:  { type: 'present', clockIn: '07:55', clockOut: '17:00', duration: '09:05', note: null },
  [`2026-5-10`]: { type: 'permit',  clockIn: null,    clockOut: null,    duration: null,    note: 'Izin keperluan keluarga' },
  [`2026-5-11`]: { type: 'present', clockIn: '08:01', clockOut: '17:02', duration: '09:01', note: null },
  [`2026-5-12`]: { type: 'late',    clockIn: '08:45', clockOut: '17:00', duration: '08:15', note: null, lateMin: 45 },
  [`2026-5-13`]: { type: 'absent',  clockIn: null,    clockOut: null,    duration: null,    note: 'Tidak masuk tanpa keterangan' },
  [`2026-5-14`]: { type: 'present', clockIn: '08:00', clockOut: '17:00', duration: '09:00', note: null },
  [`2026-5-15`]: { type: 'present', clockIn: '08:03', clockOut: '17:05', duration: '09:02', note: null },
  [`2026-5-18`]: { type: 'present', clockIn: '07:59', clockOut: '17:00', duration: '09:01', note: null },
  [`2026-5-19`]: { type: 'present', clockIn: '08:01', clockOut: '17:03', duration: '09:02', note: null },
  [`2026-5-20`]: { type: 'late',    clockIn: '10:00', clockOut: '17:00', duration: '07:00', note: null, lateMin: 120 },
  [`2026-5-21`]: { type: 'present', clockIn: '07:58', clockOut: '17:00', duration: '09:02', note: null },
  [`2026-5-22`]: { type: 'present', clockIn: '08:00', clockOut: '17:00', duration: '09:00', note: null },
}

// ── Summary ───────────────────────────────────────────
const summary = computed(() => {
  const y = currentYear.value
  const m = currentMonth.value
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  let totalMins = 0, presentDays = 0, lateDays = 0, absentDays = 0, overtimeMins = 0
  const WORK_DAY_MINS = 480 // 8h standard

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${y}-${m}-${d}`
    const att = attendanceData[key]
    if (!att) continue
    if (att.type === 'present') presentDays++
    if (att.type === 'late') lateDays++
    if (att.type === 'absent') absentDays++
    if (att.duration) {
      const [h, min] = att.duration.split(':').map(Number)
      const mins = h * 60 + min
      totalMins += mins
      if (mins > WORK_DAY_MINS) overtimeMins += mins - WORK_DAY_MINS
    }
  }

  const totalHours = (totalMins / 60).toFixed(1)
  const onTimeRate = presentDays + lateDays > 0
    ? ((presentDays / (presentDays + lateDays)) * 100).toFixed(1)
    : '0.0'
  const overtime = (overtimeMins / 60).toFixed(1)

  return { onTimeRate, totalHours, overtime, daysAbsent: absentDays.toFixed(1) }
})

// ── Calendar Cells ────────────────────────────────────
const eventTypeLabel = {
  present: 'Hadir',
  late:    'Terlambat',
  sick:    'Sakit',
  permit:  'Izin',
  absent:  'Tidak Hadir',
}

const calendarCells = computed(() => {
  const y = currentYear.value
  const m = currentMonth.value
  const firstDay   = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const prevDays   = new Date(y, m, 0).getDate()
  const cells = []

  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, currentMonth: false, isToday: false, isWeekend: false, events: [] })

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(y, m, d)
    const dow     = date.getDay()
    const isToday = (y === today.getFullYear() && m === today.getMonth() && d === today.getDate())
    const key     = `${y}-${m}-${d}`
    const att     = attendanceData[key]
    const events  = []
    if (att) events.push({
      id: key, type: att.type,
      label: eventTypeLabel[att.type],
      clockIn: att.clockIn, clockOut: att.clockOut,
      duration: att.duration, note: att.note, lateMin: att.lateMin ?? null,
    })
    cells.push({ day: d, currentMonth: true, isToday, isWeekend: dow === 0 || dow === 6, events, date })
  }

  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++)
    cells.push({ day: d, currentMonth: false, isToday: false, isWeekend: false, events: [] })

  return cells
})

// ── Styling helpers ───────────────────────────────────
function dotColor(type) {
  return {
    present: 'bg-teal-500',
    late:    'bg-orange-400',
    sick:    'bg-blue-500',
    permit:  'bg-blue-400',
    absent:  'bg-red-500',
  }[type] ?? 'bg-gray-300'
}
function statusTextColor(type) {
  return {
    present: 'text-teal-600',
    late:    'text-orange-500',
    sick:    'text-blue-500',
    permit:  'text-blue-500',
    absent:  'text-red-500',
  }[type] ?? 'text-gray-400'
}

// ── Detail Modal ──────────────────────────────────────
const typeLabelMap = {
  present: 'Hadir',
  late:    'Terlambat',
  sick:    'Sakit',
  permit:  'Izin',
  absent:  'Tidak Hadir',
}

const detailModal = ref({ show: false, event: null, dateLabel: '' })

function openDetail(event, cell) {
  if (!cell.currentMonth) return

  const d = new Date(
    currentYear.value,
    currentMonth.value,
    cell.day
  )

  detailModal.value = {
    show: true,
    event,
    dateLabel: d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
  }
}

// ── Legend ────────────────────────────────────────────
const legend = [
  { label: 'Hadir',  dot: 'bg-teal-500' },
  { label: 'Terlambat',     dot: 'bg-orange-400' },
  { label: 'Izin / Sakit',    dot: 'bg-blue-500' },
  { label: 'Tidak Hadir',   dot: 'bg-red-500' },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>