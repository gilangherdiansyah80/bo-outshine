<script setup lang="ts">
import { useUserStore } from "@/core/lib/auth-adapter/userStore";
const userStore = useUserStore();
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-[100] shadow-sm"
  >
    <!-- Logo Section -->
    <div class="flex items-center gap-2">
      <div
        class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200"
      >
        <span class="text-white font-black text-xl italic">O</span>
      </div>
      <span class="font-black text-xl tracking-tight text-[#0F172A]"
        >OUTSHINE</span
      >
    </div>

    <!-- Actions Section -->
    <div class="flex items-center gap-3">
      <!-- Notification Icon -->
      <button
        class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all active:scale-90"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
      </button>

      <!-- User Avatar -->
      <div
        class="w-10 h-10 rounded-2xl bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold text-sm"
      >
        {{ userStore.dataUser?.name?.charAt(0).toUpperCase() || "U" }}
      </div>
    </div>
  </header>
</template>
