<script setup lang="ts">
import { useNavigationStore } from "@/core/lib/store";
import EditCategoryForm from "../components/EditCategoryForm.vue";

const navigationStore = useNavigationStore();
const currentEntry = navigationStore.stack[navigationStore.stack.length - 1];
const categoryId = currentEntry?.params?.categoryId as string;
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
          Edit Kategori
        </h1>
        <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
          Perbarui informasi kategori produk
        </p>
      </div>
    </div>

    <!-- Form Component -->
    <EditCategoryForm v-if="categoryId" :category-id="categoryId" />
    <div v-else class="p-10 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
      Data kategori tidak ditemukan.
    </div>
  </div>
</template>
