<script setup lang="ts">
import Card from "@/shared/ui/Card.vue";
import { useGetStats } from "@/services/Dashboard/useGetStats";

const { stats, isLoading } = useGetStats();

/**
 * Defines styling (icons and color gradients) for different statistics cards.
 */
const getStatConfig = (label: string) => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("product")) {
    return {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
      color: "from-blue-600 to-indigo-500",
      badge: "bg-blue-50 text-blue-600"
    };
  }
  if (normalizedLabel.includes("order")) {
    return {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
      color: "from-orange-500 to-amber-500",
      badge: "bg-orange-50 text-orange-600"
    };
  }
  if (normalizedLabel.includes("users")) {
    if (normalizedLabel.includes("active")) {
      return {
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>`,
        color: "from-emerald-600 to-teal-500",
        badge: "bg-emerald-50 text-emerald-600"
      };
    }
    return {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      color: "from-purple-600 to-pink-500",
      badge: "bg-purple-50 text-purple-600"
    };
  }
  if (normalizedLabel.includes("categor")) {
    return {
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>`,
      color: "from-indigo-600 to-blue-500",
      badge: "bg-indigo-50 text-indigo-600"
    };
  }

  return {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    color: "from-gray-600 to-gray-500",
    badge: "bg-gray-50 text-gray-600"
  };
};
</script>

<template>
  <div class="px-6 mt-2">
    <!-- Welcome Section -->
    <div class="mb-6">
      <h1 class="text-3xl font-black text-[#0F172A] tracking-tight">
        Dashboard
      </h1>
      <p class="text-gray-500 font-medium">
        Welcome back to Outshine Management.
      </p>
    </div>

    <!-- Stats Cards Container (Horizontal Scroll) -->
    <div class="flex overflow-x-auto gap-4 -mx-6 px-6 pb-4 scrollbar-hide">
      <!-- Skeleton State -->
      <template v-if="isLoading">
        <Card
          v-for="i in 4"
          :key="'skeleton-' + i"
          class="p-5 border-none shadow-sm bg-white rounded-[2rem] flex flex-col justify-between min-h-[160px] min-w-[170px] animate-pulse"
        >
          <div class="w-10 h-10 bg-gray-100 rounded-2xl mb-4"></div>
          <div>
            <div class="h-8 w-16 bg-gray-100 rounded mb-2"></div>
            <div class="h-3 w-24 bg-gray-100 rounded"></div>
          </div>
        </Card>
      </template>

      <!-- Actual Data Cards -->
      <template v-else>
        <Card
          v-for="stat in stats"
          :key="stat.label"
          class="p-5 border-none shadow-[0_4px_25px_rgba(0,0,0,0.03)] bg-white rounded-[2.2rem] flex flex-col justify-between min-h-[160px] min-w-[170px] transform hover:scale-[1.02] transition-all group active:scale-95"
        >
          <div class="relative">
            <!-- Icon Container (Gradient background) -->
            <div 
              class="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br text-white mb-5 shadow-lg shadow-black/5" 
              :class="getStatConfig(stat.label).color" 
              v-html="getStatConfig(stat.label).icon"
            ></div>
            
            <!-- Value and Label -->
            <div class="text-3xl font-black text-slate-800 tracking-tighter mb-0.5">
              {{ stat.count.toLocaleString() }}
            </div>
            <div class="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              {{ stat.label }}
            </div>
          </div>

          <!-- Stability Indicator -->
          <div :class="['w-fit px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mt-auto', getStatConfig(stat.label).badge]">
            Stable
          </div>
        </Card>
      </template>
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
