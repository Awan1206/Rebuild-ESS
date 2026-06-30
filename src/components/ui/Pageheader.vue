<template>
  <div class="flex items-start justify-between mb-4 lg:mb-7">
    <div>
      <h1 class="text-[20px] lg:text-[26px] font-bold text-[#1a1a2e] mb-0.5 lg:mb-1">{{ title }}</h1>
      <p class="text-[12px] lg:text-[13.5px] text-gray-400">{{ description }}</p>
    </div>
    <button
      v-if="actionLabel"
      @click="$emit('action')"
      class="flex items-center gap-2 bg-[#1e3a5f] text-white rounded-xl px-4 lg:px-5 py-2.5 lg:py-3 text-[13px] lg:text-[14px] font-semibold hover:bg-[#16304f] transition-colors"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      <span class="hidden sm:inline">{{ actionLabel }}</span>
      <span class="sm:hidden">{{ actionLabelShort || 'Tambah' }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  actionLabelShort: { type: String, default: '' },
})
defineEmits(['action'])
</script>