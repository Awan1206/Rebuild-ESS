<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[200] p-0 sm:p-4"
  >
    <div
      class="modal-box bg-white w-full rounded-t-3xl sm:rounded-2xl shadow-2xl"
      :class="scrollable ? 'max-h-[95vh] overflow-y-auto' : ''"
      :style="{ '--modal-max-width': maxWidth }"
    >
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  maxWidth: { type: String, default: '460px' }, // e.g. '520px', '400px'
  scrollable: { type: Boolean, default: true },
})
defineEmits(['close'])
</script>

<style scoped>
/* Tailwind JIT can't generate arbitrary sm:max-w-[prop] from a dynamic value,
   so the desktop width cap is applied via a CSS var + plain media query instead.
   Mobile keeps the original full-width bottom-sheet behavior. */
@media (min-width: 640px) {
  .modal-box {
    max-width: var(--modal-max-width, 460px);
  }
}
</style>