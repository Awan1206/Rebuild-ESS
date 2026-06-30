<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      >
        <div class="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <div>
              <p class="text-[10px] font-bold tracking-widest text-[#1e3a5f] mb-0.5">
                {{ mode === 'clockin' ? 'CLOCK IN' : 'CLOCK OUT' }}
              </p>
              <h2 class="text-[18px] font-bold text-[#1a1a2e]">
                {{ mode === 'clockin' ? 'Konfirmasi Kehadiran' : 'Konfirmasi Pulang' }}
              </h2>
            </div>
            <button
              @click="$emit('update:modelValue', false)"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div v-if="mode === 'clockout'" class="bg-blue-50 rounded-2xl px-4 py-3 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#315e90" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div>
              <p class="text-[10px] font-bold tracking-widest text-[#1e3a5f]">JAM MASUK</p>
              <p class="text-[15px] font-bold text-[#1a1a2e]">{{ clockInTime }}</p>
            </div>
          </div>

          <div class="px-6 py-5 flex flex-col gap-5">

            <!-- FOTO KEHADIRAN -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold tracking-widest text-gray-400">FOTO KEHADIRAN</label>

              <div
                v-if="!capturedPhoto && !cameraActive"
                class="w-full h-[200px] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                @click="startCamera"
              >
                <div class="w-12 h-12 rounded-full bg-[#e8f0f9] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#315e90" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div class="text-center">
                  <p class="text-[13px] font-semibold text-[#1a1a2e]">Buka Kamera</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">Tap untuk mengambil foto selfie</p>
                </div>
              </div>

              <div v-if="cameraActive && !capturedPhoto" class="flex flex-col gap-2">
                <div class="relative w-full rounded-2xl overflow-hidden bg-black" style="aspect-ratio: 4/3;">
                  <video
                    ref="videoRef"
                    autoplay
                    playsinline
                    muted
                    class="w-full h-full object-cover"
                    :class="facingMode === 'user' ? 'scale-x-[-1]' : ''"
                  />
                  <div class="absolute top-3 left-3 bg-black/50 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
                    <span class="text-white text-[12px] font-bold tabular-nums">{{ currentTime }}</span>
                  </div>
                  <button
                    @click="flipCamera"
                    class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                      <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                    </svg>
                  </button>
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="w-36 h-44 rounded-full border-2 border-white/40 border-dashed"></div>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="stopCamera"
                    class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[13px] font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    @click="takePhoto"
                    class="flex-[2] py-3 rounded-xl bg-gradient-to-br from-[#315e90] to-[#4b77aa] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    Ambil Foto
                  </button>
                </div>
              </div>

              <div v-if="capturedPhoto" class="flex flex-col gap-2">
                <div class="relative w-full rounded-2xl overflow-hidden" style="aspect-ratio: 4/3;">
                  <img :src="capturedPhoto" alt="Foto kehadiran" class="w-full h-full object-cover" />
                  <div class="absolute bottom-3 left-3 bg-black/60 rounded-xl px-3 py-1.5">
                    <p class="text-white text-[11px] font-bold tabular-nums">{{ photoTimestamp }}</p>
                    <p class="text-white/70 text-[10px]">{{ currentDate }}</p>
                  </div>
                  <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
                <button
                  @click="retakePhoto"
                  class="w-full py-2.5 rounded-xl border-2 border-gray-200 text-[12.5px] font-bold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
                  </svg>
                  Foto Ulang
                </button>
              </div>

              <canvas ref="canvasRef" class="hidden" />
            </div>

            <!-- LOKASI -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label class="text-[11px] font-bold tracking-widest text-gray-400">LOKASI ANDA</label>
                <button
                  v-if="locationError"
                  @click="getLocation"
                  class="text-[11px] text-[#315e90] font-semibold hover:underline"
                >
                  Coba lagi
                </button>
              </div>

              <div class="relative w-full rounded-2xl overflow-hidden bg-gray-100" style="height: 240px;">
                <div v-if="locationLoading" class="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-gray-100">
                  <div class="w-5 h-5 border-2 border-[#315e90] border-t-transparent rounded-full animate-spin"></div>
                  <p class="text-[12px] text-gray-400">Mendeteksi lokasi...</p>
                </div>
                <div v-else-if="locationError" class="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-gray-100">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <p class="text-[12px] text-gray-400 text-center px-4">{{ locationError }}</p>
                </div>
                <iframe
                  v-if="userLat && userLng && !locationLoading"
                  :src="`https://www.openstreetmap.org/export/embed.html?bbox=${userLng - 0.005},${userLat - 0.005},${userLng + 0.005},${userLat + 0.005}&layer=mapnik&marker=${userLat},${userLng}`"
                  class="w-full h-full border-0"
                  loading="lazy"
                />
                <div v-if="userLat && userLng && !locationLoading" class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
                  <div class="w-2 h-2 rounded-full bg-[#315e90] flex-shrink-0 animate-pulse"></div>
                  <p class="text-[11.5px] font-semibold text-[#1a1a2e] truncate max-w-[200px]">{{ locationAddress || `${userLat.toFixed(5)}, ${userLng.toFixed(5)}` }}</p>
                </div>
              </div>

              <div v-if="userLat && userLng" class="flex gap-2">
                <div class="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                  <p class="text-[9.5px] font-bold tracking-widest text-gray-400 mb-0.5">LATITUDE</p>
                  <p class="text-[12.5px] font-semibold text-[#1a1a2e] tabular-nums">{{ userLat.toFixed(6) }}</p>
                </div>
                <div class="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                  <p class="text-[9.5px] font-bold tracking-widest text-gray-400 mb-0.5">LONGITUDE</p>
                  <p class="text-[12.5px] font-semibold text-[#1a1a2e] tabular-nums">{{ userLng.toFixed(6) }}</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <button
              @click="handleConfirm"
              :disabled="!userLat || locationLoading || !capturedPhoto"
              class="py-3 px-8 rounded-xl text-[13.5px] font-bold transition-all"
              :class="(!userLat || locationLoading || !capturedPhoto)
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : mode === 'clockout'
                  ? 'bg-red-500 text-white hover:opacity-90 active:scale-[0.98]'
                  : 'bg-gradient-to-br from-[#315e90] to-[#4b77aa] text-white hover:opacity-90 active:scale-[0.98]'"
            >
              {{ locationLoading ? 'Mendeteksi Lokasi...' : mode === 'clockin' ? 'Konfirmasi Clock In' : 'Konfirmasi Clock Out' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useClockInModal } from '@/composables/clockin-modal/useClockInModal.js'

const props = defineProps({
  modelValue: Boolean,
  mode: { type: String, default: 'clockin' }, // 'clockin' | 'clockout'
  clockInTime: { type: String, default: null }
})
const emit = defineEmits(['update:modelValue', 'confirmed', 'clock-out'])

const {
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
} = useClockInModal(props, emit)
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .bg-white, .modal-fade-leave-active .bg-white { transition: transform 0.25s ease; }
.modal-fade-enter-from .bg-white { transform: translateY(20px); }
</style>