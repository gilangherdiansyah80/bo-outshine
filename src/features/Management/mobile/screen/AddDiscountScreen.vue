<script setup lang="ts">
import { useNavigationStore } from "@/core/lib/store";
import AddDiscountForm from "../components/AddDiscountForm.vue";

const navigationStore = useNavigationStore();
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-safe">
    <!-- Header -->
    <div class="bg-white px-6 pt-5 pb-4 flex items-center gap-4 sticky top-0 z-[70] shadow-sm shadow-black/5">
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
        <h1 class="text-xl font-black text-[#0F172A] tracking-tight uppercase">
          Buat Promo
        </h1>
        <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
          Tambahkan diskon untuk produk pilihan
        </p>
      </div>
    </div>

    <!-- Form Component -->
    <AddDiscountForm />
  </div>
</template>
