import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useDashboard() {
  const currentTime = ref('')

  const isClockedIn = ref(false)
  const clockInTime = ref(null)
  const clockOutTime = ref(null)
  const lateMinutes = ref(0)
  const isLate = ref(false)
  const workDuration = ref('00:00:00')
  const clockInRaw = ref(null)
  const showClockInModal = ref(false)

  const weekDays = ref([
    { label: 'SEN', status: 'present', today: false },
    { label: 'SEL', status: 'present', today: false },
    { label: 'RAB', status: 'absent',  today: false },
    { label: 'KAM', status: 'late',    today: true  },
    { label: 'JUM', status: 'empty',   today: false },
  ])

  // Dummy data produktivitas pribadi — ganti dengan data asli nanti
  const monthlyAttendanceRate = ref(92)
  const previousMonthlyRate = ref(87)

  const productivityTrend = computed(() => {
    if (monthlyAttendanceRate.value > previousMonthlyRate.value) return 'naik'
    if (monthlyAttendanceRate.value < previousMonthlyRate.value) return 'turun'
    return 'stabil'
  })

  // Sapaan ikut berubah otomatis seiring jalannya currentTime (lihat updateTime)
  const greeting = computed(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 11) return 'Selamat Pagi'
    if (h >= 11 && h < 15) return 'Selamat Siang'
    if (h >= 15 && h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  })

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

  return {
    currentTime,
    isClockedIn,
    clockInTime,
    clockOutTime,
    lateMinutes,
    isLate,
    workDuration,
    showClockInModal,
    weekDays,
    greeting,
    statusClass,
    handleClockOut,
    onClockInConfirmed,
    monthlyAttendanceRate,
    previousMonthlyRate,
    productivityTrend,
  }
}