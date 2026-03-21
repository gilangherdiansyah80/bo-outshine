<script setup lang="ts">
import type { DetailOrderBackend } from "@/services/DetailOrder/useGetDetailOrder";

defineProps<{
  order: DetailOrderBackend;
}>();

const emit = defineEmits(["return", "contact", "help"]);

const copyToClipboard = (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
  }
};
</script>

<template>
  <div class="px-4 py-2 mb-28">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-50 flex flex-col divide-y divide-gray-50">
      
      <div class="p-5">
        <h3 class="text-[14px] font-bold text-slate-800">Butuh Bantuan?</h3>
      </div>

      <button @click="emit('return')" class="w-full flex items-center justify-between p-5 active:bg-slate-50 transition-colors">
        <div class="flex items-center gap-3 text-slate-700">
           <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
             <path d="M3 3v5h5" />
           </svg>
           <span class="text-[13px] font-bold">Ajukan Pengembalian</span>
        </div>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-slate-400">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <button @click="emit('contact')" class="w-full flex items-center justify-between p-5 active:bg-slate-50 transition-colors">
        <div class="flex items-center gap-3 text-slate-700">
           <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
           </svg>
           <span class="text-[13px] font-bold">Hubungi Penjual</span>
        </div>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-slate-400">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <button @click="emit('help')" class="w-full flex items-center justify-between p-5 active:bg-slate-50 transition-colors">
        <div class="flex items-center gap-3 text-slate-700">
           <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="10" />
             <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
             <line x1="12" y1="17" x2="12.01" y2="17" />
           </svg>
           <span class="text-[13px] font-bold">Pusat Bantuan</span>
        </div>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-slate-400">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div class="p-5 flex flex-col gap-4 bg-slate-50/50 rounded-b-2xl">
        <div class="flex items-start justify-between">
           <span class="text-[13px] font-bold text-slate-500 w-24 flex-shrink-0">No. Pesanan</span>
           <div class="flex items-start gap-3 flex-1 overflow-hidden">
             <span class="text-[12px] font-bold text-slate-700 break-all uppercase tracking-wider pl-4">{{ order.id }}</span>
             <button @click="copyToClipboard(String(order.id))" class="bg-white border border-slate-200 text-slate-600 text-[11px] font-bold px-2 py-1 rounded shadow-sm hover:bg-slate-50 shrink-0">
                Salin
             </button>
           </div>
        </div>

        <div class="flex justify-between items-center" v-if="order.latestPayment">
           <span class="text-[13px] font-bold text-slate-500">Metode Pembayaran</span>
           <span class="text-[13px] font-bold text-slate-700 text-right">{{ order.latestPayment.paymentMethodName || order.latestPayment.bank || 'Transfer Bank' }}</span>
        </div>

        <div class="flex justify-between items-center">
           <span class="text-[13px] font-bold text-slate-500">Nota Pesanan / Faktur</span>
           <button class="flex items-center text-[13px] font-bold text-slate-600">
             Lihat 
             <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="ml-1">
               <path d="M9 18l6-6-6-6" />
             </svg>
           </button>
        </div>

        <button class="w-full flex items-center justify-center mt-3 pt-3 text-[13px] font-bold text-slate-500 border-t border-slate-200/60">
           Lihat Semua
           <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ml-1 mt-0.5">
             <path d="M6 9l6 6 6-6" />
           </svg>
        </button>
      </div>

    </div>
  </div>
</template>
