<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useNavigationStore } from "@/core/lib/store";
import MobileHeader from "./MobileHeader.vue";
import MobileFooter from "./MobileFooter.vue";

/**
 * MobileLayout - Modern layout wrapper for all mobile-first features
 */

const route = useRoute();
const navigationStore = useNavigationStore();

const shouldHideNav = computed(() => {
  // Hide nav if route meta says so, or if internal navigation is on a sub-page
  const currentPath = navigationStore.stack[navigationStore.stack.length - 1]?.path || "/";
  return route.meta.hideNav || currentPath !== "/";
});
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">
    <!-- Top Navigation (Hidden on auth pages and internal sub-pages) -->
    <MobileHeader v-if="!shouldHideNav" />

    <!-- Main Content Area -->
    <main
      class="flex-1 w-full transition-all duration-300"
      :class="[!shouldHideNav ? 'pt-16 pb-[92px]' : 'pt-0 pb-0']"
    >
      <slot />
    </main>

    <!-- Bottom Navigation (Hidden on auth pages and internal sub-pages) -->
    <MobileFooter v-if="!shouldHideNav" />
  </div>
</template>

<style scoped>
/* Ensure smooth transitions between views if needed */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
