<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * MobileFooter - Animated navigation with notched active indicator
 */

const route = useRoute();
const router = useRouter();

const navItems = [
  {
    name: "Home",
    path: "/outshine/dashboard",
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
    name: "Manage",
    path: "/outshine/management",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    `,
  },
  {
    name: "Orders",
    path: "/outshine/sales",
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
    name: "Reviews",
    path: "/outshine/stats",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `,
  },
  {
    name: "Users",
    path: "/outshine/stats",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    `,
  },
];

const activeIndex = computed(() => {
  const index = navItems.findIndex((item) => item.path === route.path);
  return index === -1 ? 0 : index;
});

const handleNavigate = (path: string) => {
  router.push(path);
};
</script>

<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-[#0F172A] h-20 pb-safe z-[100] flex items-center justify-around px-2 overflow-visible shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
  >
    <!-- Indicator Background (Notch) -->
    <div
      class="absolute top-0 h-full transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] pointer-events-none flex justify-center"
      :style="{
        left: `${activeIndex * (100 / navItems.length)}%`,
        width: `${100 / navItems.length}%`,
      }"
    >
      <div
        class="absolute -top-[1.5px] w-[130px] h-[80px] flex justify-center overflow-visible"
      >
        <!-- The Notch Curve (Matches page background to create "cutout") -->
        <svg
          viewBox="0 0 100 60"
          class="w-full h-full text-[#F8FAFC] fill-current drop-shadow-[0_-2px_5px_rgba(0,0,0,0.05)]"
        >
          <path d="M0 0 C20 0 20 40 50 40 S80 0 100 0 V-10 H0 Z" />
        </svg>

        <!-- The Floating Active Circle (Black circle inside the white cutout) -->
        <div
          class="absolute top-[3px] w-12 h-12 bg-[#0F172A] rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.3)] group-active:scale-90"
        >
          <div
            v-if="activeIndex !== -1"
            v-html="navItems[activeIndex].icon"
            class="w-5 h-5 text-white"
          ></div>
        </div>
      </div>
    </div>

    <!-- Nav Items -->
    <button
      v-for="(item, index) in navItems"
      :key="item.name"
      @click="handleNavigate(item.path)"
      class="relative flex flex-col items-center justify-center flex-1 h-full z-10 group mt-1"
    >
      <!-- Icon (Hidden when active) -->
      <div
        v-html="item.icon"
        class="w-6 h-6 transition-all duration-500"
        :class="
          activeIndex === index
            ? 'opacity-0 scale-50'
            : 'opacity-40 text-white group-hover:opacity-100'
        "
      ></div>

      <!-- Label -->
      <span
        class="text-[8px] font-black uppercase tracking-[2px] mt-1 transition-all duration-500"
        :class="
          activeIndex === index
            ? 'text-white opacity-100 mt-5 scale-110'
            : 'text-white/30 opacity-60'
        "
      >
        {{ item.name }}
      </span>
    </button>
  </footer>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
