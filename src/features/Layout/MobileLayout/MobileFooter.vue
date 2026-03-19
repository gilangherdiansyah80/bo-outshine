<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * MobileFooter - Animated navigation tab bar for mobile viewports
 */

const route = useRoute();
const router = useRouter();

const navItems = [
  {
    name: "HOME",
    path: "/dashboard",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    `,
  },
  {
    name: "ITEMS",
    path: "/items",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2c0 .991-.701 1.832-1.667 1.967A10.147 10.147 0 0 1 21 11.5v.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-.5a10.147 10.147 0 0 1 8.667-5.533C10.701 5.832 10 4.991 10 4a2 2 0 0 1 2-2z"/>
      </svg>
    `,
  },
  {
    name: "SALES",
    path: "/sales",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
        <path d="M14 8H8"/>
        <path d="M16 12H8"/>
        <path d="M13 16H8"/>
      </svg>
    `,
  },
  {
    name: "STATS",
    path: "/stats",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    `,
  },
];

const activePath = computed(() => route.path);

const isActive = (path: string) => {
  // Exact match or if the current path starts with the nav item path (for nested routes)
  if (path === "/" && activePath.value !== "/") return false;
  return activePath.value === path;
};

const handleNavigate = (path: string) => {
  router.push(path);
};
</script>

<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center px-4 py-3 pb-safe z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
  >
    <button
      v-for="item in navItems"
      :key="item.name"
      @click="handleNavigate(item.path)"
      class="flex flex-col items-center justify-center min-w-[70px] transition-all duration-300 relative group"
    >
      <!-- Active Background / Icon Container -->
      <div
        class="relative w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 mb-1"
        :class="isActive(item.path) ? 'bg-blue-50' : 'group-hover:bg-gray-50'"
      >
        <div
          class="w-6 h-6 transition-colors duration-300"
          :class="isActive(item.path) ? 'text-blue-600' : 'text-gray-400'"
          v-html="item.icon"
        ></div>
      </div>

      <!-- Label -->
      <span
        class="text-[10px] font-extrabold tracking-[1px] transition-colors duration-300"
        :class="isActive(item.path) ? 'text-blue-600' : 'text-gray-400'"
      >
        {{ item.name }}
      </span>
      
      <!-- Subtle Active Indicator (optional, but adds premium feel) -->
      <div 
        v-if="isActive(item.path)"
        class="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full blur-[1px] opacity-0"
      ></div>
    </button>
  </footer>
</template>

<style scoped>
/* Ensure the SVGs take the color of the parent */
:deep(svg) {
  width: 100%;
  height: 100%;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 12px);
}
</style>
