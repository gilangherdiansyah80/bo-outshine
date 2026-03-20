<script setup lang="ts">
import { ref, computed } from "vue";
import { useGetHero } from "@/services/Hero/useGetHero";

const { data: heroes, isLoading, isError, refetch } = useGetHero();
const searchQuery = ref("");

const filteredHeroes = computed(() => {
  if (!heroes.value) return [];
  if (!searchQuery.value) return heroes.value;
  return heroes.value.filter((h) =>
    h.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
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
          placeholder="Search hero banners..."
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
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Banners...</span>
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

    <!-- Hero List Grid -->
    <div v-else class="px-6 pb-24 grid grid-cols-1 gap-6">
       <!-- Add New Hero Card -->
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
          <h3 class="text-[15px] font-black text-slate-800 tracking-tight">Tambah Banner Baru</h3>
          <p class="text-[11px] font-bold text-slate-400">Atur konten utama halaman depan</p>
        </div>
      </button>

      <div
        v-for="hero in filteredHeroes"
        :key="hero.id"
        class="bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm active:scale-[0.98] transition-all group flex flex-col"
      >
        <!-- Hero Image (Banner) -->
        <div class="h-40 w-full relative">
          <img
            :src="hero.backgroundImage"
            :alt="hero.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div class="absolute top-4 left-4">
             <span class="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
               {{ hero.badgeText }}
             </span>
          </div>
          
          <div class="absolute bottom-4 left-4 right-4">
             <h3 class="text-white font-black text-lg leading-tight tracking-tight drop-shadow-md">
               {{ hero.title }}
             </h3>
          </div>
        </div>

        <!-- Hero Actions & Info -->
        <div class="p-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
             <div 
               :class="[
                 'w-2 h-2 rounded-full animate-pulse',
                 hero.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'
               ]"
             ></div>
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">
               {{ hero.isActive ? 'Active on Storefront' : 'Draft / Hidden' }}
             </span>
          </div>
          
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
