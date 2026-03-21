<script setup lang="ts">
import type { DetailOrderBackend } from "@/services/DetailOrder/useGetDetailOrder";

defineProps<{
  order: DetailOrderBackend;
}>();
</script>

<template>
  <div class="px-4 py-2">
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 flex flex-col gap-4">
      <!-- Store Info -->
      <div class="flex items-center gap-2 pb-2">
        <div class="bg-slate-900 rounded px-1.5 py-0.5 flex items-center justify-center border border-slate-700/50">
          <span class="text-[8px] font-black italic text-white leading-none">Star+</span>
        </div>
        <h4 class="text-[13px] font-black text-slate-800 tracking-tight flex items-center gap-1 uppercase">
          OUTSHINE STORE
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" class="text-slate-400">
             <path d="M9 18l6-6-6-6"/>
          </svg>
        </h4>
      </div>

      <!-- Products List -->
      <div class="flex flex-col gap-4">
        <div v-for="(item, idx) in order.items" :key="idx" class="flex gap-4">
          <div class="w-[72px] h-[72px] rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
            <img :src="item.productImage" :alt="item.productName" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 flex flex-col justify-between py-1">
            <div class="flex items-start justify-between">
               <h3 class="text-[14px] font-black text-slate-900 tracking-tight">{{ item.productName }}</h3>
               <span class="text-[13px] font-bold text-slate-400">x{{ item.quantity }}</span>
            </div>
            <p class="text-[12px] font-bold text-slate-400 uppercase mt-[-4px]">{{ item.sizeName }}</p>
            <div class="text-[14px] font-black text-slate-800 self-end mt-1">{{ item.formattedOriginalPrice }}</div>
          </div>
        </div>
      </div>

      <!-- Total Order -->
      <div class="flex items-center justify-end pt-3 border-t border-gray-50 mt-1">
         <span class="text-[13px] font-bold text-slate-600 mr-2">Total Pesanan:</span>
         <div class="flex items-center gap-1 cursor-pointer">
           <span class="text-[15px] font-black text-slate-900">{{ order.formattedTotalPrice }}</span>
           <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
             <path d="M6 9l6 6 6-6" />
           </svg>
         </div>
      </div>
    </div>
  </div>
</template>
