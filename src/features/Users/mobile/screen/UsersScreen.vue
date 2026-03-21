<script setup lang="ts">
import UserList from "../components/UserList.vue";
</script>

<template>
  <div class="flex flex-col h-full bg-[#f6f6f6] min-h-screen">
    <!-- Header -->
    <header
      class="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100"
    >
      <h1 class="text-[18px] font-black text-slate-900 tracking-tight">
        Users
      </h1>
      <div
        class="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-slate-600"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 p-4">
      <UserList />
    </div>
  </div>
</template>
