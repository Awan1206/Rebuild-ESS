<template>
  <button
    @click="$emit('click')"
    class="flex-1 inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold border rounded-xl px-4 py-2.5 transition-colors"
    :class="variant === 'danger'
      ? 'text-red-500 border-red-300 hover:bg-red-50'
      : 'text-yellow-600 border-yellow-300 hover:bg-yellow-50'"
  >
    <svg v-if="variant === 'danger'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
    <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'edit' }, // 'edit' | 'danger'
  label: { type: String, default: 'Edit' },
})
defineEmits(['click'])
</script>