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
  </div>
</template>
