<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  statusLabel: string;
}>();

const mappedStatus = computed(() => {
  const status = props.statusLabel?.toLowerCase();
  if (status === 'pending') return 'MENUNGGU PEMBAYARAN';
  if (status === 'success') return 'DIKEMAS';
  if (status === 'shipping') return 'DALAM PENGIRIMAN';
  if (status === 'completed') return 'PESANAN SELESAI';
  if (status === 'cancelled') return 'DIBATALKAN';
  return status?.toUpperCase() || 'PROSESS';
});
</script>

<template>
  <div class="px-4 mt-2">
    <div class="bg-[#0F172A] rounded-t-xl px-5 py-4 flex items-center">
      <h2 class="text-white text-[16px] font-extrabold tracking-tight">
        {{ mappedStatus }}
      </h2>
    </div>
  </div>
</template>
