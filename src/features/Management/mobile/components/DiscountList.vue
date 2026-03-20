<script setup lang="ts">
import { ref, computed } from "vue";
import { useGetDiscounts } from "@/services/Discounts/useGetDiscounts";

const { data: discounts, isLoading, isError, refetch } = useGetDiscounts();
const searchQuery = ref("");

const filteredDiscounts = computed(() => {
  if (!discounts.value) return [];
  if (!searchQuery.value) return discounts.value;
  return discounts.value.filter((d) =>
    d.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Search Bar -->
    <div class="px-6 py-4">
      <div class="relative group">
        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            class="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search promos..."
          class="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 shadow-sm transition-all shadow-black/5"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Promos...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="px-6 py-10 text-center">
      <div class="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100/50 flex flex-col items-center">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" class="mb-3 opacity-50">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span class="font-bold text-sm mb-4">Something went wrong</span>
        <button 
          @click="refetch" 
          class="px-8 py-3 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Discount List Grid -->
    <div v-else class="px-6 pb-24 grid grid-cols-1 gap-4">
      <!-- Add New Promo Card -->
      <button
        class="w-full h-44 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group hover:border-blue-300 hover:bg-blue-50/20"
      >
        <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-blue-100 transition-all">
          <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
        </div>
        <div class="text-center">
          <h3 class="text-[15px] font-black text-slate-800 tracking-tight">Buat Promo Baru</h3>
          <p class="text-[11px] font-bold text-slate-400">Berikan diskon menarik untuk pelanggan</p>
        </div>
      </button>

      <div
        v-for="discount in filteredDiscounts"
        :key="discount.id"
        class="bg-white rounded-[2.5rem] p-4 border border-slate-50 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group relative overflow-hidden"
      >
        <!-- Type Badge (Ribbon like) -->
        <div class="absolute top-0 right-8 px-3 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase rounded-b-xl shadow-sm">
           Promo
        </div>

        <!-- Discount Display -->
        <div class="w-16 h-16 rounded-[1.8rem] bg-amber-50 flex flex-col items-center justify-center text-amber-600 flex-shrink-0 relative shadow-inner border border-amber-100/50">
          <span class="text-[18px] font-black leading-none tracking-tighter">{{ discount.value }}{{ discount.type === 'percent' ? '%' : '' }}</span>
          <span class="text-[8px] font-black uppercase mt-0.5 opacity-60">OFF</span>
        </div>

        <!-- Promo Details -->
        <div class="flex-1 min-w-0 pr-2">
          <div class="flex items-center gap-2 mb-1">
            <span 
              :class="[
                'text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md',
                discount.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
              ]"
            >
              {{ discount.isActive ? 'RUNNING' : 'PAUSED' }}
            </span>
          </div>
          
          <h3 class="text-[14px] font-black text-[#0F172A] truncate tracking-tight group-hover:text-amber-600 transition-colors">
            {{ discount.productName }}
          </h3>
          
          <div class="flex items-center gap-1.5 mt-2 font-bold text-slate-400 text-[9px] uppercase tracking-wider">
             <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
             </svg>
             <span>Ends {{ formatDate(discount.endDate) }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="flex gap-2">
           <button class="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-400 hover:bg-[#0F172A] hover:text-white transition-all shadow-sm">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
