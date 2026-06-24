<template>
  <!-- Page Header -->
  <div class="flex items-start justify-between mb-7">
    <div>
      <h1 class="text-[26px] font-bold text-[#1a1a2e] mb-1">Selamat Pagi, {{ user.name }}</h1>
      <p class="text-[13.5px] text-gray-400">Semoga harimu produktif dan penuh inspirasi.</p>
    </div>
    <div class="text-right">
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

  <!-- ══════════════════════════════════════════════════
       DESKTOP LAYOUT (≥ lg)
  ══════════════════════════════════════════════════ -->
  <div class="hidden lg:grid grid-cols-[1fr_280px] gap-4">

    <!-- LEFT: Clock In + Countdown side by side -->
    <div class="flex gap-4">
      <!-- Clock In Card -->
      <div class="bg-white rounded-2xl p-6 flex flex-col gap-3 flex-1">
        <div class="flex items-stretch gap-4">
          <!-- Main Content -->
          <div class="flex flex-col gap-3 flex-1">
            <span class="inline-block text-[10.5px] font-bold tracking-widest text-[#1e3a5f] bg-blue-50 rounded-md px-2.5 py-1 w-fit">
              SHIFT PAGI
            </span>
            <h2 class="text-[22px] font-bold text-[#1a1a2e] leading-snug">
              Waktunya melakukan<br />Clock In
            </h2>
            <p class="text-[13px] text-gray-400">
              Jadwal kerja Anda dimulai pada pukul 08:00 hingga 17.00
            </p>
            <div class="flex gap-3 mt-1">
              <div class="bg-gray-50 rounded-xl px-4 py-2.5 w-40">
                <p class="text-[10px] font-semibold text-gray-400 tracking-widest mb-1">MASUK</p>
                <p class="text-lg font-bold text-[#1a1a2e]">{{ clockInTime || '-' }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl px-4 py-2.5 w-40">
                <p class="text-[10px] font-semibold text-gray-400 tracking-widest mb-1">PULANG</p>
                <p class="text-lg font-bold text-[#1a1a2e]">{{ clockOutTime || '-' }}</p>
              </div>
            </div>
            <p v-if="isLate" class="text-[12px] text-red-500 font-semibold mt-1">
              Terlambat {{ lateMinutes }} menit
            </p>
            <button
              v-if="!isClockedIn && !clockOutTime"
              @click="showClockInModal = true"
              class="mt-2 w-full bg-gradient-to-br from-[#315e90] to-[#4b77aa] text-white rounded-xl py-3.5 text-[14.5px] font-semibold active:scale-95 transition-transform"
            >
              Clock In Sekarang
            </button>
            <button
              v-else-if="isClockedIn"
              @click="showClockInModal = true"
              class="mt-2 w-full bg-red-500 text-white rounded-xl py-3.5 text-[14.5px] font-semibold active:scale-95 transition-transform"
            >
              Clock Out Sekarang
            </button>
            <button
              v-else
              disabled
              class="mt-2 w-full bg-gray-100 text-gray-400 rounded-xl py-3.5 text-[14.5px] font-semibold cursor-not-allowed"
            >
              Sudah Selesai Hari Ini 
            </button>
          </div>

          <!-- Countdown Card -->
          <div class="bg-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center w-[250px] h-[250px] flex-shrink-0 gap-1">
            <p class="text-[12.5px] text-gray-400">Durasi Kerja</p>
            <p class="text-[32px] font-bold text-[#1a1a2e] tabular-nums leading-none">{{ workDuration }}</p>
            <p class="text-[11px] text-gray-400 tracking-wider mt-1">
              {{ isClockedIn ? 'SEDANG BERJALAN' : (clockOutTime ? 'SELESAI HARI INI' : 'BELUM MULAI') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT: Weekly Summary + Productivity stacked -->
    <div class="flex flex-col gap-4">
      <!-- Weekly Summary Card -->
      <div class="bg-white rounded-2xl p-6">
        <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-4">RINGKASAN MINGGUAN</p>
        <div class="flex gap-2 mb-5">
          <div
            v-for="day in weekDays"
            :key="day.label"
            class="flex flex-col items-center gap-1.5 flex-1"
          >
            <span class="text-[10.5px] font-semibold text-gray-400 tracking-wider">{{ day.label }}</span>
            <span
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all"
              :class="[statusClass(day.status), day.today ? 'outline outline-2 outline-offset-2 outline-[#1e3a5f]' : '']"
            >
              <svg v-if="day.status === 'present'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else-if="day.status === 'absent'" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
              <svg v-else-if="day.status === 'late'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span v-else class="text-gray-300 text-lg leading-none">·</span>
            </span>
          </div>
        </div>
        <a href="#" class="text-[12.5px] font-semibold text-[#1e3a5f] hover:underline">
          Lihat Detail Kehadiran
        </a>
      </div>

      <!-- Productivity Card -->
      <div class="bg-gradient-to-br from-[#315e90] to-[#4b77aa] rounded-2xl p-6 flex flex-col gap-2 flex-1">
        <p class="text-[10.5px] font-bold tracking-widest text-white/50">PRODUKTIVITAS</p>
        <p class="text-[42px] font-extrabold text-white leading-none">92%</p>
        <p class="text-[12.5px] text-white/70 leading-relaxed">
          Kehadiran Anda 5% lebih tinggi dibandingkan rata-rata tim bulan ini.
        </p>
        <a href="#" class="text-[13px] font-semibold text-white/80 hover:text-white transition-colors mt-auto">
          Lihat Statistik →
        </a>
      </div>
    </div>

  </div>

  <!-- ══════════════════════════════════════════════════
       MOBILE LAYOUT (< lg)
  ══════════════════════════════════════════════════ -->
  <div class="lg:hidden flex flex-col gap-4">

    <!-- Clock In Card -->
    <div class="bg-white rounded-2xl p-5 flex flex-col gap-3">
      <span class="inline-block text-[10px] font-bold tracking-widest text-[#1e3a5f] bg-blue-50 rounded-md px-2.5 py-1 w-fit">
        SHIFT PAGI
      </span>
      <h2 class="text-[19px] font-bold text-[#1a1a2e] leading-snug">
        Waktunya melakukan Clock In
      </h2>
      <p class="text-[12.5px] text-gray-400">
        Jadwal kerja Anda dimulai pada pukul 08:00 hingga 17.00
      </p>
      <div class="flex gap-3 mt-1">
        <div class="bg-gray-50 rounded-xl px-4 py-2.5 flex-1">
          <p class="text-[10px] font-semibold text-gray-400 tracking-widest mb-1">MASUK</p>
          <p class="text-lg font-bold text-[#1a1a2e]">{{ clockInTime || '-' }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl px-4 py-2.5 flex-1">
          <p class="text-[10px] font-semibold text-gray-400 tracking-widest mb-1">PULANG</p>
          <p class="text-lg font-bold text-[#1a1a2e]">{{ clockOutTime || '-' }}</p>
        </div>
      </div>
      <p v-if="isLate" class="text-[12px] text-red-500 font-semibold mt-1">
        Terlambat {{ lateMinutes }} menit
      </p>
      <button
        v-if="!isClockedIn && !clockOutTime"
        @click="showClockInModal = true"
        class="mt-2 w-full bg-gradient-to-br from-[#315e90] to-[#4b77aa] text-white rounded-xl py-3.5 text-[14.5px] font-semibold active:scale-95 transition-transform"
      >
        Clock In Sekarang
      </button>
      <button
        v-else-if="isClockedIn"
        @click="showClockInModal = true"
        class="mt-2 w-full bg-red-500 text-white rounded-xl py-3.5 text-[14.5px] font-semibold active:scale-95 transition-transform"
      >
        Clock Out Sekarang
      </button>
      <button
        v-else
        disabled
        class="mt-2 w-full bg-gray-100 text-gray-400 rounded-xl py-3.5 text-[14.5px] font-semibold cursor-not-allowed"
      >
        Sudah Selesai Hari Ini 
      </button>
    </div>

    <!-- Countdown Card -->
    <div class="bg-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-1">
      <p class="text-[12.5px] text-gray-400">Durasi Kerja</p>
      <p class="text-[32px] font-bold text-[#1a1a2e] tabular-nums leading-none">{{ workDuration }}</p>
      <p class="text-[11px] text-gray-400 tracking-wider mt-1">
        {{ isClockedIn ? 'SEDANG BERJALAN' : (clockOutTime ? 'SELESAI HARI INI' : 'BELUM MULAI') }}
      </p>
    </div>

    <!-- Weekly Summary Card -->
    <div class="bg-white rounded-2xl p-5">
      <p class="text-[10.5px] font-bold tracking-widest text-gray-400 mb-4">RINGKASAN MINGGUAN</p>
      <div class="flex gap-2 mb-5">
        <div
          v-for="day in weekDays"
          :key="day.label"
          class="flex flex-col items-center gap-1.5 flex-1"
        >
          <span class="text-[10px] font-semibold text-gray-400 tracking-wider">{{ day.label }}</span>
          <span
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all"
            :class="[statusClass(day.status), day.today ? 'outline outline-2 outline-offset-2 outline-[#1e3a5f]' : '']"
          >
            <svg v-if="day.status === 'present'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else-if="day.status === 'absent'" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>
            <svg v-else-if="day.status === 'late'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span v-else class="text-gray-300 text-lg leading-none">·</span>
          </span>
        </div>
      </div>
      <a href="#" class="text-[12.5px] font-semibold text-[#1e3a5f] hover:underline">
        Lihat Detail Kehadiran
      </a>
    </div>

    <!-- Productivity Card -->
    <div class="bg-gradient-to-br from-[#315e90] to-[#4b77aa] rounded-2xl p-5 flex flex-col gap-2">
      <p class="text-[10.5px] font-bold tracking-widest text-white/50">PRODUKTIVITAS</p>
      <p class="text-[38px] font-extrabold text-white leading-none">92%</p>
      <p class="text-[12.5px] text-white/70 leading-relaxed">
        Kehadiran Anda 5% lebih tinggi dibandingkan rata-rata tim bulan ini.
      </p>
      <a href="#" class="text-[13px] font-semibold text-white/80 hover:text-white transition-colors mt-1">
        Lihat Statistik →
      </a>
    </div>

  </div>

  <!-- Modal - tambah props mode dan clock-in-time -->
  <ClockInModal
    v-model="showClockInModal"
    :mode="isClockedIn ? 'clockout' : 'clockin'"
    :clock-in-time="clockInTime"
    @confirmed="onClockInConfirmed"
    @clock-out="handleClockOut"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ClockInModal from '../views/components/ClockInModal.vue'

const currentTime = ref('')
const countdown = ref('00:00:00')

const isClockedIn = ref(false)
const clockInTime = ref(null)
const clockOutTime = ref(null)
const lateMinutes = ref(0)
const isLate = ref(false)
const workDuration = ref('00:00:00')
const clockInRaw = ref(null)
const showClockInModal = ref(false)

const { user } = defineProps({
  user: Object
})

const weekDays = ref([
  { label: 'SEN', status: 'present', today: false },
  { label: 'SEL', status: 'present', today: false },
  { label: 'RAB', status: 'absent',  today: false },
  { label: 'KAM', status: 'late',    today: true  },
  { label: 'JUM', status: 'empty',   today: false },
])

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 11) return 'Selamat Pagi'
  if (h >= 11 && h < 15) return 'Selamat Siang'
  if (h >= 15 && h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

function formatTime(date) {
  const pad = n => String(n).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function statusClass(status) {
  return {
    present: 'bg-green-50 text-green-500 border-green-400',
    absent:  'bg-red-50 text-red-400 border-red-400',
    late:    'bg-yellow-50 text-yellow-500 border-yellow-400',
    empty:   'bg-gray-50 text-gray-300 border-gray-200',
  }[status]
}

function updateTime() {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  // Hanya update workDuration saat sedang clock in
  if (isClockedIn.value && clockInRaw.value) {
    const diff = Math.floor((now - clockInRaw.value) / 1000)
    workDuration.value = `${pad(Math.floor(diff / 3600))}:${pad(Math.floor((diff % 3600) / 60))}:${pad(diff % 60)}`
  }
}

function handleClockOut() {
  const now = new Date()
  clockOutTime.value = formatTime(now)
  isClockedIn.value = false
  workDuration.value = (() => {
    if (!clockInRaw.value) return '00:00:00'
    const diff = Math.floor((now - clockInRaw.value) / 1000)
    const pad = n => String(n).padStart(2, '0')
    return `${pad(Math.floor(diff / 3600))}:${pad(Math.floor((diff % 3600) / 60))}:${pad(diff % 60)}`
  })()
}

function onClockInConfirmed(data) {
  clockInTime.value  = data.time
  clockInRaw.value   = new Date()
  isClockedIn.value  = true
  isLate.value       = data.isLate
  lateMinutes.value  = data.lateMin
}

let timer
onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))
</script>