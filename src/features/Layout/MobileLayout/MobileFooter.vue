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
    name: "Dashboard",
    path: "/dashboard",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    `,
  },
  {
    name: "Management",
    path: "/management",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    `,
  },
  {
    name: "Orders",
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
    name: "Review",
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
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center px-4 py-2 h-18 pb-safe z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
  >
    <button
      v-for="item in navItems"
      :key="item.name"
      @click="handleNavigate(item.path)"
      class="flex flex-col items-center justify-center transition-all duration-300 px-1 py-1 rounded-xl"
      :class="isActive(item.path) ? 'bg-slate-800' : 'hover:bg-slate-800'"
    >
      <!-- Active Background / Icon Container -->
      <div
        class="relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300"
      >
        <div
          class="w-6 h-6 transition-colors duration-300"
          :class="isActive(item.path) ? 'text-blue-600' : 'text-gray-400'"
          v-html="item.icon"
        ></div>
      </div>

      <!-- Label -->
      <span
        class="text-[10px] font-extrabold tracking-[1px] transition-colors duration-300 -mt-3"
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
