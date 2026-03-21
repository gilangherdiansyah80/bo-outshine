<script setup lang="ts">
import type { DetailOrderBackend } from "@/services/DetailOrder/useGetDetailOrder";

defineProps<{
  order?: DetailOrderBackend;
}>();
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe z-30 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
    <div class="flex gap-3 max-w-lg mx-auto">
      <button class="flex-1 py-3.5 px-4 bg-white border border-gray-200 text-slate-800 rounded-xl text-[13px] font-black tracking-tight active:bg-slate-50 transition-colors">
        Batalkan Pesanan
      </button>
      <button class="flex-1 py-3.5 px-4 bg-[#F24E2B] border border-[#F24E2B] text-white rounded-xl text-[13px] font-black tracking-tight active:bg-[#d94424] transition-colors shadow-lg shadow-orange-600/20">
        Bayar Sekarang
      </button>
    </div>
  </div>
</template>
