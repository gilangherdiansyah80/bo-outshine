<script setup lang="ts">
import { useRoute } from "vue-router";
import MobileHeader from "./MobileHeader.vue";
import MobileFooter from "./MobileFooter.vue";

/**
 * MobileLayout - Modern layout wrapper for all mobile-first features
 */

const route = useRoute();
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">
    <!-- Top Navigation (Hidden if meta.hideNav is true) -->
    <MobileHeader v-if="!route.meta.hideNav" />

    <!-- Main Content Area -->
    <main
      class="flex-1 w-full transition-all duration-300"
      :class="[!route.meta.hideNav ? 'pt-16 pb-[92px]' : 'pt-0 pb-0']"
    >
      <slot />
    </main>

    <!-- Bottom Navigation (Hidden if meta.hideNav is true) -->
    <MobileFooter v-if="!route.meta.hideNav" />
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
