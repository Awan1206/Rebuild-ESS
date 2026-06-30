<template>
  <div class="flex items-center justify-between px-5 lg:px-7 py-4 lg:py-5 border-t border-gray-200">
    <p class="text-[12.5px] text-gray-400">Halaman {{ modelValue }} dari {{ totalPages }}</p>
    <div class="flex gap-1.5">
      <button
        @click="$emit('update:modelValue', modelValue - 1)"
        :disabled="modelValue <= 1"
        class="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 text-[13px] font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors"
      >‹</button>
      <button
        v-for="p in totalPages"
        :key="p"
        @click="$emit('update:modelValue', p)"
        class="w-9 h-9 rounded-lg text-[13px] font-semibold transition-colors"
        :class="p === modelValue ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'"
      >{{ p }}</button>
      <button
        @click="$emit('update:modelValue', modelValue + 1)"
        :disabled="modelValue >= totalPages"
        class="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 text-[13px] font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors"
      >›</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})
defineEmits(['update:modelValue'])
</script>