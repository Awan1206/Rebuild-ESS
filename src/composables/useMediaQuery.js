import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Reactive media query. Dipakai untuk menghindari render dua versi
 * layout (mobile card + desktop table) sekaligus — hanya versi yang
 * sesuai lebar layar yang benar-benar dibuat ke DOM.
 *
 * Contoh:
 *   const isDesktop = useMediaQuery('(min-width: 768px)')
 *   <div v-if="isDesktop">...tabel desktop...</div>
 *   <div v-else>...card mobile...</div>
 */
export function useMediaQuery(query) {
  const matches = ref(false)
  let mql = null

  function update(e) {
    matches.value = e.matches
  }

  onMounted(() => {
    mql = window.matchMedia(query)
    matches.value = mql.matches
    // addEventListener lebih baru & lebih ringan drpd addListener (deprecated)
    mql.addEventListener('change', update)
  })

  onUnmounted(() => {
    if (mql) mql.removeEventListener('change', update)
  })

  return matches
}

// Shortcut siap pakai untuk breakpoint Tailwind 'md' (768px)
// yang paling sering dipakai di project ini.
export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px)')
}