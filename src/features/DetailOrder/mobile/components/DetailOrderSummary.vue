<script setup lang="ts">
import type { DetailOrderBackend } from "@/services/DetailOrder/useGetDetailOrder";

const props = defineProps<{
  order: DetailOrderBackend;
}>();

</script>

<template>
  <div class="px-4 py-2">
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col gap-3">
      
      <div class="flex justify-between items-center">
         <span class="text-[13px] font-bold text-slate-500">Total Harga</span>
         <span class="text-[13px] font-bold text-slate-700">{{ order.formattedTotalPrice }}</span>
      </div>

      <div class="flex justify-between items-center" v-if="order.latestPayment">
         <span class="text-[13px] font-bold text-slate-500">Metode Pembayaran</span>
         <span class="text-[13px] font-bold text-slate-700 uppercase">{{ order.latestPayment.paymentMethodName || order.latestPayment.bank }}</span>
      </div>

      <div class="flex justify-between items-center" v-if="order.paymentType">
         <span class="text-[13px] font-bold text-slate-500">Tipe Pembayaran</span>
         <span class="text-[13px] font-bold text-slate-700 uppercase">{{ order.paymentType }}</span>
      </div>

      <div class="flex justify-between items-center">
         <span class="text-[13px] font-bold text-slate-500">Sudah Dibayar</span>
         <span class="text-[13px] font-black text-slate-900 tracking-tight">{{ order.formattedPaidAmount || 'Rp 0' }}</span>
      </div>

      <div class="flex justify-between items-center pt-3 border-t border-gray-50 mt-1">
         <span class="text-[14px] font-black text-slate-900 tracking-tight">Sisa Tagihan</span>
         <span class="text-[14px] font-black text-[#F24E2B] tracking-tight">{{ order.formattedRemainingAmount || 'Rp 0' }}</span>
      </div>

    </div>

    <!-- Payment Proof Section -->
    <div v-if="order.paymentProof || order.latestPayment?.proofUrl" class="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col gap-3">
      <h3 class="text-[14px] font-bold text-slate-800">Bukti Pembayaran</h3>
      <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
        <img 
          :src="order.paymentProof || order.latestPayment?.proofUrl" 
          alt="Bukti Pembayaran" 
          class="w-full h-full object-contain"
        />
        <a 
          :href="order.paymentProof || order.latestPayment?.proofUrl" 
          target="_blank"
          class="absolute bottom-3 right-3 bg-white/90 backdrop-blur shadow-sm border border-slate-200 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-700 flex items-center gap-1.5 hover:bg-white transition-colors"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
          Perbesar
        </a>
      </div>
    </div>
  </div>
</template>
