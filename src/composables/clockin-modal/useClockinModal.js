import { ref, watch, onUnmounted, nextTick } from 'vue'

export function useClockInModal(props, emit) {
  // ── Clock ─────────────────────────────────────────────────────────
  const currentTime = ref('')
  const currentDate = ref('')
  let clockTimer    = null

  function updateClock() {
    const now  = new Date()
    const pad  = n => String(n).padStart(2, '0')
    currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    currentDate.value = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
  }

  // ── Geolocation ───────────────────────────────────────────────────
  const userLat         = ref(null)
  const userLng         = ref(null)
  const locationAddress = ref('')
  const locationLoading = ref(false)
  const locationError   = ref('')

  function getLocation() {
    if (!navigator.geolocation) { locationError.value = 'Browser tidak mendukung geolocation'; return }
    locationLoading.value = true
    locationError.value   = ''
    userLat.value         = null
    userLng.value         = null
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        userLat.value = pos.coords.latitude
        userLng.value = pos.coords.longitude
        locationLoading.value = false
        await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => {
        locationLoading.value = false
        locationError.value = err.code === 1
          ? 'Izin lokasi ditolak. Aktifkan di pengaturan browser.'
          : 'Gagal mendapatkan lokasi. Coba lagi.'
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function reverseGeocode(lat, lng) {
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      const data = await res.json()
      const a    = data.address || {}
      locationAddress.value = [a.road, a.suburb, a.city || a.town || a.village].filter(Boolean).join(', ')
    } catch { locationAddress.value = '' }
  }

  // ── Camera ────────────────────────────────────────────────────────
  const videoRef       = ref(null)
  const canvasRef      = ref(null)
  const cameraActive   = ref(false)
  const capturedPhoto  = ref(null)
  const photoTimestamp = ref('')
  const facingMode     = ref('user')
  let   mediaStream    = null

  async function startCamera(mode = facingMode.value) {
    try {
      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop())
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      cameraActive.value = true
      facingMode.value   = mode
      await nextTick()
      if (videoRef.value) videoRef.value.srcObject = mediaStream
    } catch (err) {
      alert(err.name === 'NotAllowedError'
        ? 'Izin kamera ditolak. Aktifkan di pengaturan browser.'
        : 'Gagal membuka kamera. Pastikan perangkat memiliki kamera.')
    }
  }

  async function flipCamera() {
    await startCamera(facingMode.value === 'user' ? 'environment' : 'user')
  }

  function stopCamera() {
    if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null }
    cameraActive.value = false
  }

  function takePhoto() {
    if (!videoRef.value || !canvasRef.value) return
    const video  = videoRef.value
    const canvas = canvasRef.value
    canvas.width  = video.videoWidth  || 1280
    canvas.height = video.videoHeight || 960
    const ctx = canvas.getContext('2d')
    if (facingMode.value === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1) }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    photoTimestamp.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const fontSize = Math.round(canvas.width * 0.022)
    ctx.font      = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.fillRect(0, canvas.height - fontSize * 3.2, canvas.width * 0.55, fontSize * 3.2)
    ctx.fillStyle = 'white'
    ctx.fillText(photoTimestamp.value, fontSize * 0.5, canvas.height - fontSize * 1.8)
    ctx.font      = `${Math.round(fontSize * 0.85)}px sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.fillText(currentDate.value, fontSize * 0.5, canvas.height - fontSize * 0.5)
    capturedPhoto.value = canvas.toDataURL('image/jpeg', 0.88)
    stopCamera()
  }

  function retakePhoto() {
    capturedPhoto.value  = null
    photoTimestamp.value = ''
    startCamera()
  }

  // ── Lifecycle ─────────────────────────────────────────────────────
  watch(() => props.modelValue, (val) => {
    if (val) {
      updateClock()
      clockTimer = setInterval(updateClock, 1000)
      getLocation()
      capturedPhoto.value  = null
      cameraActive.value   = false
    } else {
      clearInterval(clockTimer)
      stopCamera()
      userLat.value         = null
      userLng.value         = null
      locationAddress.value = ''
      locationError.value   = ''
    }
  }, { immediate: true })

  onUnmounted(() => { clearInterval(clockTimer); stopCamera() })

  // ── Confirm ───────────────────────────────────────────────────────
  function handleConfirm() {
    if (props.mode === 'clockout') {
      emit('clock-out', {
        time:      currentTime.value,
        lat:       userLat.value,
        lng:       userLng.value,
        address:   locationAddress.value,
        photo:     capturedPhoto.value,
        photoTime: photoTimestamp.value,
      })
    } else {
      emit('confirmed', {
        time:      currentTime.value,
        date:      currentDate.value,
        lat:       userLat.value,
        lng:       userLng.value,
        address:   locationAddress.value,
        photo:     capturedPhoto.value,
        photoTime: photoTimestamp.value,
      })
    }
    emit('update:modelValue', false)
  }

  return {
    currentTime,
    currentDate,
    userLat,
    userLng,
    locationAddress,
    locationLoading,
    locationError,
    getLocation,
    videoRef,
    canvasRef,
    cameraActive,
    capturedPhoto,
    photoTimestamp,
    facingMode,
    startCamera,
    flipCamera,
    stopCamera,
    takePhoto,
    retakePhoto,
    handleConfirm,
  }
}