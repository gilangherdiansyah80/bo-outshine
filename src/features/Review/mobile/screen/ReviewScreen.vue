<script setup lang="ts">
import ReviewList from "../components/ReviewList.vue";
</script>

<template>
  <div class="flex flex-col h-full bg-[#f6f6f6] min-h-screen">
    <!-- Header -->
    <header
      class="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100"
    >
      <h1 class="text-[18px] font-black text-slate-900 tracking-tight">
        Review
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
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 p-4">
      <ReviewList />
    </div>
  </div>
</template>
