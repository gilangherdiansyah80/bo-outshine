<script setup lang="ts">
import { useRoute } from "vue-router";
/**
 * DesktopLayout - Base layout for desktop viewports
 */
const route = useRoute();
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Desktop Navigation Placeholder (Hidden if meta.hideNav is true) -->
    <header
      v-if="!route.meta.hideNav"
      class="h-16 bg-white border-b border-slate-200 px-8 flex items-center sticky top-0 z-50"
    >
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
        >
          <span class="text-white font-black italic">O</span>
        </div>
        <span
          class="font-black text-xl tracking-tight text-slate-900 border-r border-slate-200 pr-4 mr-4"
          >OUTSHINE</span
        >
        <nav class="flex gap-6">
          <span class="text-sm font-bold text-blue-600">DASHBOARD</span>
          <span
            class="text-sm font-bold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            >ITEMS</span
          >
          <span
            class="text-sm font-bold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            >SALES</span
          >
        </nav>
      </div>
    </header>

    <main class="flex-1 transition-all duration-300" :class="[!route.meta.hideNav ? 'p-8' : 'p-0']">
      <div :class="[!route.meta.hideNav ? 'max-w-7xl mx-auto' : 'w-full']">
        <slot />
      </div>
    </main>
  </div>
</template>
