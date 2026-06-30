import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const now = new Date()
const todayKey = now.toISOString().slice(0, 10)
const currentMonthKey = now.toISOString().slice(0, 7)

// ── Sample Data ────────────────────────────────────────────────────
// Dummy data kehadiran harian. Nantinya diganti hasil fetch dari API.
const initialRawData = [
  { id: 1, name: 'Budi Santoso',       employeeId: 'EMP001', division: 'Operasional', branch: 'Kantor Pusat',    today: { clockIn: '07:52', clockOut: '17:10', duration: '9j 18m', status: 'present', lateMinutes: null } },
  { id: 2, name: 'Dewi Rahayu',        employeeId: 'EMP002', division: 'Keuangan',    branch: 'Kantor Pusat',    today: { clockIn: '08:24', clockOut: '17:05', duration: '8j 41m', status: 'late',    lateMinutes: 24 } },
  { id: 3, name: 'Farhan Maulana',     employeeId: 'EMP003', division: 'IT',          branch: 'Kantor Pusat',    today: { clockIn: null,    clockOut: null,    duration: null,      status: 'absent',  lateMinutes: null } },
  { id: 4, name: 'Hana Pertiwi',       employeeId: 'EMP004', division: 'Marketing',   branch: 'Cabang Bandung',  today: { clockIn: '07:45', clockOut: '16:58', duration: '9j 13m', status: 'present', lateMinutes: null } },
  { id: 5, name: 'Irfan Hakim',        employeeId: 'EMP005', division: 'IT',          branch: 'Kantor Pusat',    today: { clockIn: '08:41', clockOut: '17:30', duration: '8j 49m', status: 'late',    lateMinutes: 41 } },
  { id: 6, name: 'Lestari Wulandari',  employeeId: 'EMP006', division: 'HRD',         branch: 'Cabang Surabaya', today: { clockIn: null,    clockOut: null,    duration: null,      status: 'leave',   lateMinutes: null } },
  { id: 7, name: 'Muhammad Rizky',     employeeId: 'EMP007', division: 'Operasional', branch: 'Cabang Bandung',  today: { clockIn: '07:59', clockOut: '17:02', duration: '9j 03m', status: 'present', lateMinutes: null } },
  { id: 8, name: 'Nadia Putri',        employeeId: 'EMP008', division: 'Marketing',   branch: 'Kantor Pusat',    today: { clockIn: '07:50', clockOut: null,    duration: null,      status: 'present', lateMinutes: null } },
  { id: 9, name: 'Oka Prasetya',       employeeId: 'EMP009', division: 'Keuangan',    branch: 'Cabang Surabaya', today: { clockIn: '08:03', clockOut: '17:15', duration: '9j 12m', status: 'present', lateMinutes: null } },
  { id: 10, name: 'Putri Anggraini',   employeeId: 'EMP010', division: 'HRD',         branch: 'Kantor Pusat',    today: { clockIn: null,    clockOut: null,    duration: null,      status: 'absent',  lateMinutes: null } },
  { id: 11, name: 'Abhista',           employeeId: 'EMP011', division: 'IT',          branch: 'Kantor Pusat',    today: { clockIn: '07:34', clockOut: '17.00', duration: '9j 26m',  status: 'present', lateMinutes: null } },
]

export const statusOptions = [
  { value: 'present', label: 'Hadir',       dot: 'bg-emerald-500' },
  { value: 'late',    label: 'Terlambat',   dot: 'bg-amber-400' },
  { value: 'absent',  label: 'Tidak hadir', dot: 'bg-red-400' },
  { value: 'leave',   label: 'Izin/Cuti',   dot: 'bg-blue-400' },
]

// ── Monthly history generator ───────────────────────────────────────
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function buildMonthHistory(employee, monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = []

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month - 1, d)
    const dayOfWeek = dateObj.getDay()
    const dateKey = `${monthKey}-${String(d).padStart(2, '0')}`
    const isToday = dateKey === todayKey
    const isFuture = dateObj > now && !isToday

    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    if (isFuture) continue

    if (isToday && monthKey === currentMonthKey) {
      days.push({ date: dateKey, dateLabel: dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }), isToday: true, ...employee.today })
      continue
    }

    const seed = employee.id * 1000 + d + month * 31
    const roll = seededRandom(seed)

    if (roll < 0.06) {
      days.push({ date: dateKey, dateLabel: dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }), isToday: false, clockIn: null, clockOut: null, duration: null, status: 'leave', lateMinutes: null })
    } else if (roll < 0.12) {
      days.push({ date: dateKey, dateLabel: dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }), isToday: false, clockIn: null, clockOut: null, duration: null, status: 'absent', lateMinutes: null })
    } else if (roll < 0.30) {
      const lateMin = Math.round(5 + seededRandom(seed + 1) * 50)
      const inMin = Math.min(59, lateMin)
      const clockIn = `08:${String(inMin).padStart(2, '0')}`
      days.push({ date: dateKey, dateLabel: dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }), isToday: false, clockIn, clockOut: '17:0' + String(Math.round(seededRandom(seed + 2) * 9)), duration: `8j ${30 + Math.round(seededRandom(seed + 3) * 20)}m`, status: 'late', lateMinutes: lateMin })
    } else {
      const inMin = Math.round(seededRandom(seed + 4) * 14)
      const clockIn = `07:${String(45 + inMin).padStart(2, '0')}`
      const outMin = Math.round(seededRandom(seed + 5) * 30)
      const clockOut = `17:${String(outMin).padStart(2, '0')}`
      days.push({ date: dateKey, dateLabel: dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }), isToday: false, clockIn, clockOut, duration: `9j ${10 + Math.round(seededRandom(seed + 6) * 15)}m`, status: 'present', lateMinutes: null })
    }
  }

  return days.reverse()
}

export function useMonitor() {
  const router = useRouter()

  // ── Live Clock ────────────────────────────────────────────────────
  const currentTime = ref('')
  let timer
  function updateTime() {
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  }
  onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
  onUnmounted(() => clearInterval(timer))

  const rawData = ref(initialRawData)

  const branchList = computed(() => [...new Set(rawData.value.map(r => r.branch))])
  const divisionList = computed(() => [...new Set(rawData.value.map(r => r.division))])

  // ── Filter State ────────────────────────────────────────────────────
  const filters = ref({ search: '', branch: '', division: '', month: currentMonthKey, status: '' })

  // Drawer has its own temp state — only applied when user taps "Terapkan"
  const filterDrawerOpen = ref(false)
  const drawerFilters = ref({ branch: '', division: '', month: currentMonthKey, status: '' })

  const activeFilterCount = computed(() => {
    let count = 0
    if (filters.value.branch) count++
    if (filters.value.division) count++
    if (filters.value.month !== currentMonthKey) count++
    if (filters.value.status) count++
    return count
  })

  function openFilterDrawer() {
    // Sync drawer with current applied filters
    drawerFilters.value = {
      branch:   filters.value.branch,
      division: filters.value.division,
      month:    filters.value.month,
      status:   filters.value.status,
    }
    filterDrawerOpen.value = true
  }

  function closeFilterDrawer() {
    filterDrawerOpen.value = false
  }

  function applyDrawerFilters() {
    filters.value.branch   = drawerFilters.value.branch
    filters.value.division = drawerFilters.value.division
    filters.value.month    = drawerFilters.value.month
    filters.value.status   = drawerFilters.value.status
    currentPage.value = 1
    closeFilterDrawer()
  }

  function resetDrawerFilters() {
    drawerFilters.value = { branch: '', division: '', month: currentMonthKey, status: '' }
  }

  function resetFilter() {
    filters.value = { search: '', branch: '', division: '', month: currentMonthKey, status: '' }
    currentPage.value = 1
  }

  const isCurrentMonthSelected = computed(() => filters.value.month === currentMonthKey)

  const selectedMonthLabel = computed(() => {
    const [year, month] = filters.value.month.split('-').map(Number)
    return new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  })

  function getDisplayAttendance(employee) {
    if (isCurrentMonthSelected.value) {
      return {
        displayClockIn: employee.today.clockIn,
        displayClockOut: employee.today.clockOut,
        displayDuration: employee.today.duration,
        displayStatus: employee.today.status,
        displayLateMinutes: employee.today.lateMinutes,
        displayLocation: employee.branch,
      }
    }

    const history = buildMonthHistory(employee, filters.value.month)
    const lastEntry = history[0]

    if (!lastEntry) {
      return { displayClockIn: null, displayClockOut: null, displayDuration: null, displayStatus: 'absent', displayLateMinutes: null, displayLocation: employee.branch }
    }

    return {
      displayClockIn: lastEntry.clockIn,
      displayClockOut: lastEntry.clockOut,
      displayDuration: lastEntry.duration,
      displayStatus: lastEntry.status,
      displayLateMinutes: lastEntry.lateMinutes,
      displayLocation: employee.branch,
    }
  }

  // ── Computed ────────────────────────────────────────────────────────
  const filteredData = computed(() => {
    const f = filters.value
    const searchTerm = f.search.trim().toLowerCase()

    return rawData.value
      .filter(r => {
        if (searchTerm && !r.name.toLowerCase().includes(searchTerm)) return false
        if (f.branch && r.branch !== f.branch) return false
        if (f.division && r.division !== f.division) return false
        return true
      })
      .map(r => ({ ...r, ...getDisplayAttendance(r) }))
      .filter(r => {
        if (f.status && r.displayStatus !== f.status) return false
        return true
      })
  })

  // Dataset terfilter khusus untuk summary cards — hanya ikut filter branch & division
  const statsScopedData = computed(() => {
    const f = filters.value
    return rawData.value.filter(r => {
      if (f.branch && r.branch !== f.branch) return false
      if (f.division && r.division !== f.division) return false
      return true
    })
  })

  const stats = computed(() => ({
    total:   statsScopedData.value.length,
    present: statsScopedData.value.filter(r => r.today.status === 'present' || r.today.status === 'late').length,
    absent:  statsScopedData.value.filter(r => r.today.status === 'absent' || r.today.status === 'leave').length,
  }))

  const presentPct = computed(() =>
    stats.value.total ? Math.round((stats.value.present / stats.value.total) * 100) : 0
  )

  const perPage = 10
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / perPage)))
  const paginatedData = computed(() =>
    filteredData.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
  )

  // ── Navigasi ke halaman detail ──────────────────────────────────────
  // Sementara diarahkan ke halaman Review dengan query employeeId & bulan.
  // Sesuaikan jika nanti dibuat halaman detail kehadiran per-karyawan.
  function goToDetail(row) {
    router.push({ name: 'Review', query: { employeeId: row.employeeId, bulan: filters.value.month } })
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  function statusLabel(s) {
    return { present: 'Hadir', late: 'Terlambat', absent: 'Tidak hadir', leave: 'Izin/Cuti' }[s] || s
  }

  function statusTextClass(s) {
    if (s === 'present') return 'text-gray-700'
    if (s === 'absent') return 'text-red-600'
    return 'text-red-400'
  }

  return {
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
  }
}