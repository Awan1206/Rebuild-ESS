import { ref, computed, onMounted, onUnmounted } from 'vue'

export const ATTENDANCE_TYPES = {
  present: { label: 'Hadir',       text: 'text-teal-600' },
  late:    { label: 'Terlambat',   text: 'text-amber-500' },
  sick:    { label: 'Sakit',       text: 'text-red-500' },
  permit:  { label: 'Izin',        text: 'text-red-500' },
  absent:  { label: 'Tidak Hadir', text: 'text-red-500' },
}
export const DEFAULT_TYPE = { label: '', text: 'text-gray-400' }

// Dummy data kehadiran. Nantinya diganti dengan hasil fetch dari API.
const attendanceData = {
  '2026-6-1':  { type: 'present', clockIn: '08:02', clockOut: '17:05', duration: '09:03', note: null },
  '2026-6-2':  { type: 'present', clockIn: '07:58', clockOut: '17:00', duration: '09:02', note: null },
  '2026-6-3':  { type: 'late',    clockIn: '09:15', clockOut: '17:10', duration: '07:55', note: null, lateMin: 75 },
  '2026-6-4':  { type: 'present', clockIn: '08:00', clockOut: '17:00', duration: '09:00', note: null },
  '2026-6-5':  { type: 'sick',    clockIn: null,    clockOut: null,    duration: null,    note: 'Sakit demam, sudah kirim surat dokter' },
  '2026-6-8':  { type: 'present', clockIn: '08:05', clockOut: '17:05', duration: '09:00', note: null },
  '2026-6-9':  { type: 'present', clockIn: '07:55', clockOut: '17:00', duration: '09:05', note: null },
  '2026-6-10': { type: 'permit',  clockIn: null,    clockOut: null,    duration: null,    note: 'Izin keperluan keluarga' },
  '2026-6-11': { type: 'present', clockIn: '08:01', clockOut: '17:02', duration: '09:01', note: null },
  '2026-6-12': { type: 'late',    clockIn: '08:45', clockOut: '17:00', duration: '08:15', note: null, lateMin: 45 },
  '2026-6-15': { type: 'absent',  clockIn: null,    clockOut: null,    duration: null,    note: 'Tidak masuk tanpa keterangan' },
  '2026-6-16': { type: 'present', clockIn: '08:00', clockOut: '17:00', duration: '09:00', note: null },
  '2026-6-17': { type: 'present', clockIn: '08:03', clockOut: '17:05', duration: '09:02', note: null },
  '2026-6-24': { type: 'present', clockIn: '07:59', clockOut: '17:00', duration: '09:01', note: null },
  '2026-6-25': { type: 'present', clockIn: '08:01', clockOut: '17:03', duration: '09:02', note: null },
  '2026-6-26': { type: 'late',    clockIn: '10:00', clockOut: '17:00', duration: '07:00', note: null, lateMin: 120 },
  '2026-6-29': { type: 'present', clockIn: '07:58', clockOut: '17:00', duration: '09:02', note: null },
  '2026-6-30': { type: 'present', clockIn: '08:00', clockOut: '17:00', duration: '09:00', note: null },
}

function dateKey(year, monthZeroIndexed, day) {
  return `${year}-${monthZeroIndexed + 1}-${day}`
}

export function useAttendance() {
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

  function dateTextColor(cell) {
    if (!cell.currentMonth) return 'text-gray-300'
    if (cell.isToday) return 'text-blue-500 font-bold'
    if (cell.isWeekend) return 'text-red-500 font-bold'
    return 'text-[#1a1a2e] font-bold'
  }

  // ── Summary ───────────────────────────────────────────
  const summary = computed(() => {
    const y = currentYear.value
    const m = currentMonth.value
    const daysInMonth = new Date(y, m + 1, 0).getDate()

    let presentDays = 0, lateDays = 0, notPresentDays = 0, lateTotalMins = 0

    for (let d = 1; d <= daysInMonth; d++) {
      const att = attendanceData[dateKey(y, m, d)]
      if (!att) continue

      if (att.type === 'present') {
        presentDays++
      } else if (att.type === 'late') {
        lateDays++
        presentDays++ // terlambat tetap dihitung hadir
        if (att.lateMin) lateTotalMins += att.lateMin
      } else if (att.type === 'absent' || att.type === 'sick' || att.type === 'permit') {
        notPresentDays++
      }
    }

    const onTimeRate = presentDays > 0
      ? (((presentDays - lateDays) / presentDays) * 100).toFixed(1)
      : '0.0'

    const lateHours = Math.floor(lateTotalMins / 60)
    const lateMinsRem = lateTotalMins % 60

    return {
      onTimeRate,
      totalHariHadir: presentDays,
      totalKeterlambatanHari: lateDays,
      totalKeterlambatanDurasi: `${lateHours}j ${lateMinsRem}m`,
      totalHariTidakHadir: notPresentDays,
    }
  })

  // ── Calendar Cells ────────────────────────────────────
  const calendarCells = computed(() => {
    const y = currentYear.value
    const m = currentMonth.value
    const firstDay    = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const prevDays    = new Date(y, m, 0).getDate()
    const cells = []

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: prevDays - i, currentMonth: false, isToday: false, isWeekend: false, events: [] })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dow     = new Date(y, m, d).getDay()
      const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate()
      const att     = attendanceData[dateKey(y, m, d)]

      const events = att ? [{
        id: dateKey(y, m, d),
        type: att.type,
        label: ATTENDANCE_TYPES[att.type]?.label ?? '',
        clockIn: att.clockIn,
        clockOut: att.clockOut,
        duration: att.duration,
        note: att.note,
        lateMin: att.lateMin ?? null,
      }] : []

      cells.push({ day: d, currentMonth: true, isToday, isWeekend: dow === 0 || dow === 6, events })
    }

    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, currentMonth: false, isToday: false, isWeekend: false, events: [] })
    }

    return cells
  })

  // ── Styling Helpers ──
  function statusTextColor(type) {
    return ATTENDANCE_TYPES[type]?.text ?? DEFAULT_TYPE.text
  }

  // ── Detail Modal ──────────────────────────────────────
  const detailModal = ref({ show: false, event: null, dateLabel: '' })

  function openDetail(event, cell) {
    if (!cell.currentMonth) return
    const d = new Date(currentYear.value, currentMonth.value, cell.day)
    detailModal.value = {
      show: true,
      event,
      dateLabel: d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }
  }

  const typeLabelMap = Object.fromEntries(
    Object.entries(ATTENDANCE_TYPES).map(([key, val]) => [key, val.label])
  )

  return {
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
  }
}