<script setup lang="ts">
import { useRoute } from "vue-router";
import DesktopSidebar from "./DesktopSidebar.vue";
import DesktopHeader from "./DesktopHeader.vue";

/**
 * DesktopLayout - Premium Admin layout for desktop viewports
 */
const route = useRoute();
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex font-sans selection:bg-blue-100 selection:text-blue-700">
    <!-- Desktop Sidebar -->
    <DesktopSidebar v-if="!route.meta.hideNav" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 relative">
      <!-- Desktop Header -->
      <DesktopHeader v-if="!route.meta.hideNav" />

      <!-- Page Content -->
      <main 
        class="flex-1 transition-all duration-500 ease-in-out" 
        :class="[!route.meta.hideNav ? 'p-6 lg:p-10' : 'p-0']"
      >
        <div 
            :class="[!route.meta.hideNav ? 'max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700' : 'w-full']"
        >
          <slot />
        </div>
      </main>

      <!-- Decorative Background Elements -->
      <div v-if="!route.meta.hideNav" class="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div v-if="!route.meta.hideNav" class="fixed bottom-0 left-[260px] -z-10 w-[400px] h-[400px] bg-indigo-400/5 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  </div>
</template>

<style>
/* Global smooth scrolling for the app */
html {
  scroll-behavior: smooth;
}

/* Base transitions for page content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom animate-in classes (Tailwind might need these if not using a plugin) */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromBottom {
  from { transform: translateY(1rem); }
  to { transform: translateY(0); }
}

.animate-in {
  animation-duration: 700ms;
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.slide-in-from-bottom-4 {
  animation-name: slideInFromBottom;
}
</style>
