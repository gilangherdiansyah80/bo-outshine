<script setup lang="ts">
import type { DetailOrderBackend } from "@/services/DetailOrder/useGetDetailOrder";

defineProps<{
  order: DetailOrderBackend;
}>();
</script>

<template>
  <div class="px-4 py-2 mt-4 space-y-4">
    <!-- Info Pengiriman -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h3 class="text-[14px] font-bold text-slate-800">Info Pengiriman</h3>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
      <p class="text-[13px] font-bold text-slate-500 tracking-tight">SiCepat Halu: 004548100927</p>
      
      <div class="flex items-start gap-3 mt-1">
         <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-700 flex-shrink-0 mt-0.5">
           <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
         </svg>
         <div>
           <p class="text-[13px] font-bold text-slate-800 tracking-tight">Pesanan tiba di alamat tujuan. diterima oleh Yang b... </p>
           <p class="text-[11px] font-bold text-slate-400 mt-1">05-01-2026 18:22</p>
         </div>
      </div>
    </div>

    <!-- Alamat Pengiriman -->
    <div v-if="order.address" class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col gap-3">
      <h3 class="text-[14px] font-bold text-slate-800">Alamat Pengiriman</h3>
      
      <div class="flex items-start gap-3">
         <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-100">
           <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-700">
             <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
             <circle cx="12" cy="10" r="3" />
           </svg>
         </div>
         <div>
           <p class="text-[14px] font-black text-slate-800 tracking-tight mb-1">{{ order.address.recipientName }} ({{ order.address.phoneNumber }})</p>
           <p class="text-[13px] font-bold text-slate-500 leading-snug tracking-tight">{{ order.address.street }}, {{ order.address.city }}, {{ order.address.province }}, {{ order.address.postalCode }}. <span class="text-blue-600 cursor-pointer">Lihat</span></p>
         </div>
      </div>
    </div>
  </div>
</template>
