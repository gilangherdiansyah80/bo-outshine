<script setup lang="ts">
import { computed } from "vue";
import { useNavigationStore } from "@/core/lib/store";
import EditProductForm from "../components/EditProductForm.vue";

const navigationStore = useNavigationStore();

// Get productId from navigation params
const productId = computed(() => {
  const stack = navigationStore.stack;
  const current = stack[stack.length - 1];
  return (current?.params?.productId as string) || "";
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-safe">
    <!-- Header -->
    <div class="bg-white px-6 pt-5 pb-4 flex items-center gap-4">
      <button
        @click="navigationStore.actions.pop()"
        class="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 active:scale-95 transition-all"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div>
        <h1 class="text-xl font-black text-[#0F172A] tracking-tight">
          Edit Produk
        </h1>
        <p class="text-[11px] text-slate-400 font-bold">
          Perbarui informasi produk
        </p>
      </div>
    </div>

    <!-- Form Component -->
    <EditProductForm v-if="productId" :product-id="productId" />
    
    <!-- No Product ID Error -->
    <div v-else class="px-6 py-20 text-center">
      <div class="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100/50 flex flex-col items-center">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" class="mb-3 opacity-50">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span class="font-bold text-sm mb-4">Produk tidak ditemukan</span>
        <button
          @click="navigationStore.actions.pop()"
          class="px-8 py-3 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all"
        >
          Kembali
        </button>
      </div>
    </div>
  </div>
</template>
