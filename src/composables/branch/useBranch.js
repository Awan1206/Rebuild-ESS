import { ref, reactive, computed, nextTick, onUnmounted } from 'vue'

// Leaflet TIDAK di-import di top-level lagi.
// Library ini (JS + CSS) baru akan di-download saat modal peta
// benar-benar dibuka (initMap dipanggil), bukan saat halaman Branch
// pertama kali dirender.
let _LeafletCache = null
async function loadLeaflet() {
  if (_LeafletCache) return _LeafletCache
  const [leafletModule] = await Promise.all([
    import('leaflet'),
    import('leaflet/dist/leaflet.css'),
  ])
  _LeafletCache = leafletModule.default
  return _LeafletCache
}

export function useBranch() {
  /* ===================== BRANCH ===================== */

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

  // Shifts diimpor dari useShift agar shiftCountForBranch bisa bekerja.
  // Gunakan inject/provide atau shared store di produksi; untuk sekarang
  // cukup terima shifts sebagai parameter opsional.
  const _externalShifts = ref([])

  function setShifts(shiftsRef) {
    _externalShifts.value = shiftsRef
  }

  function shiftCountForBranch(branchId) {
    const list = Array.isArray(_externalShifts.value)
      ? _externalShifts.value
      : _externalShifts.value?.value ?? []
    return list.filter(s => s.branchId === branchId).length
  }

  const showBranchModal = ref(false)
  const showDeleteBranchModal = ref(false)
  const editingBranch = ref(null)
  const branchToDelete = ref(null)
  const searching = ref(false)
  const searchError = ref('')

  const branchForm = reactive({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    timezone: ''
  })

  const searchQuery = ref('')
  const mapContainer = ref(null)

  // Pagination
  const perPage = 8
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(branches.value.length / perPage)))
  const paginatedBranches = computed(() =>
    branches.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
  )

  let map = null
  let marker = null

  function branchName(branchId) {
    const b = branches.value.find(b => b.id === branchId)
    return b ? b.name : '-'
  }

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
      branchForm.address = result.display_name
      await setLocation(lat, lng)
    } catch (err) {
      console.error('Gagal mencari lokasi:', err)
      searchError.value = 'Gagal menghubungi layanan pencarian lokasi.'
    } finally {
      searching.value = false
    }
  }

  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'Accept-Language': 'id' } }
      )
      const data = await res.json()
      if (data.display_name) branchForm.address = data.display_name
    } catch (err) {
      console.error('Gagal mengambil alamat:', err)
    }
  }

  async function fetchTimezone(lat, lng) {
    try {
      const res = await fetch(`https://www.timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lng}`)
      const data = await res.json()
      if (data.timeZone) {
        const sign = data.currentUtcOffset?.seconds >= 0 ? '+' : '-'
        const offsetHours = Math.abs(data.currentUtcOffset?.seconds || 0) / 3600
        branchForm.timezone = `${data.timeZone} (UTC${sign}${offsetHours})`
      }
    } catch (err) {
      console.error('Gagal mengambil timezone:', err)
      branchForm.timezone = ''
    }
  }

  async function setLocation(lat, lng) {
    branchForm.latitude = lat.toFixed(6)
    branchForm.longitude = lng.toFixed(6)
    if (map && marker) {
      map.setView([lat, lng], 15)
      marker.setLatLng([lat, lng])
    }
    await fetchTimezone(lat, lng)
  }

  async function initMap() {
    await nextTick()
    if (!mapContainer.value) return
    const L = await loadLeaflet()
    const initialLat = branchForm.latitude ? parseFloat(branchForm.latitude) : -6.2088
    const initialLng = branchForm.longitude ? parseFloat(branchForm.longitude) : 106.8456
    map = L.map(mapContainer.value).setView([initialLat, initialLng], branchForm.latitude ? 15 : 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)
    marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map)
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      await setLocation(lat, lng)
      await reverseGeocode(lat, lng)
    })
    marker.on('dragend', async () => {
      const pos = marker.getLatLng()
      await setLocation(pos.lat, pos.lng)
      await reverseGeocode(pos.lat, pos.lng)
    })
    setTimeout(() => map && map.invalidateSize(), 200)
  }

  function destroyMap() {
    if (map) { map.remove(); map = null; marker = null }
  }

  function openAddBranchModal() {
    editingBranch.value = null
    branchForm.name = ''
    branchForm.address = ''
    branchForm.latitude = ''
    branchForm.longitude = ''
    branchForm.timezone = ''
    searchQuery.value = ''
    searchError.value = ''
    showBranchModal.value = true
    nextTick(() => initMap())
  }

  function openEditBranchModal(branch) {
    editingBranch.value = branch
    branchForm.name = branch.name
    branchForm.address = branch.address
    branchForm.latitude = branch.latitude
    branchForm.longitude = branch.longitude
    branchForm.timezone = branch.timezone
    searchQuery.value = ''
    searchError.value = ''
    showBranchModal.value = true
    nextTick(() => initMap())
  }

  function closeBranchModal() {
    showBranchModal.value = false
    editingBranch.value = null
    destroyMap()
  }

  function saveBranch() {
    if (!branchForm.name.trim() || !branchForm.address.trim()) return
    if (editingBranch.value) {
      editingBranch.value.name = branchForm.name
      editingBranch.value.address = branchForm.address
      editingBranch.value.latitude = branchForm.latitude
      editingBranch.value.longitude = branchForm.longitude
      editingBranch.value.timezone = branchForm.timezone
    } else {
      const newId = branches.value.length ? Math.max(...branches.value.map(b => b.id)) + 1 : 1
      branches.value.push({
        id: newId,
        name: branchForm.name,
        address: branchForm.address,
        latitude: branchForm.latitude,
        longitude: branchForm.longitude,
        timezone: branchForm.timezone
      })
    }
    closeBranchModal()
  }

  function confirmDeleteBranch(branch) {
    branchToDelete.value = branch
    showDeleteBranchModal.value = true
  }

  function deleteBranch() {
    branches.value = branches.value.filter(b => b.id !== branchToDelete.value.id)
    showDeleteBranchModal.value = false
    branchToDelete.value = null
  }

  onUnmounted(() => destroyMap())

  return {
    branches,
    currentPage,
    totalPages,
    paginatedBranches,
    showBranchModal,
    showDeleteBranchModal,
    editingBranch,
    branchToDelete,
    searching,
    searchError,
    branchForm,
    searchQuery,
    mapContainer,
    branchName,
    shiftCountForBranch,
    setShifts,
    searchLocation,
    openAddBranchModal,
    openEditBranchModal,
    closeBranchModal,
    saveBranch,
    confirmDeleteBranch,
    deleteBranch,
  }
}