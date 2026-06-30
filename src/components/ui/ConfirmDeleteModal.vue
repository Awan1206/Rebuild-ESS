<template>
  <Modal :show="show" max-width="400px" :scrollable="false" @close="$emit('cancel')">
    <h2 class="text-[18px] font-bold text-[#1a1a2e] mb-2">{{ title }}</h2>
    <p class="text-[13.5px] text-gray-400 mb-2">
      <slot name="message">
        Apakah Anda yakin ingin menghapus
        <span class="font-semibold text-[#1a1a2e]">{{ itemName }}</span>?
      </slot>
    </p>
    <p v-if="warning" class="text-[12.5px] text-red-500 mb-6">{{ warning }}</p>
    <p v-else class="text-[13.5px] text-gray-400 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
    <div class="flex justify-end gap-2">
      <button
        @click="$emit('cancel')"
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        Batal
      </button>
      <button
        @click="$emit('confirm')"
        class="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
      >
        Hapus
      </button>
    </div>
  </Modal>
</template>

<script setup>
import Modal from './Modal.vue'

defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Hapus Data' },
  itemName: { type: String, default: '' },
  warning: { type: String, default: '' }, // optional extra-danger message (e.g. related records)
})
defineEmits(['confirm', 'cancel'])
</script>