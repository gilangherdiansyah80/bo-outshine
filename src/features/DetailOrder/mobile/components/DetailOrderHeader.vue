<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <header class="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b border-gray-100">
    <div class="flex items-center gap-3">
      <button 
        @click="router.back()" 
        class="w-10 h-10 flex items-center justify-center -ml-2 active:bg-slate-50 rounded-full transition-colors"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-800">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 class="text-[17px] font-black text-slate-900 tracking-tight">Rincian Pesanan</h1>
    </div>
  </header>
</template>
