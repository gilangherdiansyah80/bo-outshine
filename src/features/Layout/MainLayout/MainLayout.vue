<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useViewport } from "@/shared/hooks/use-viewport";
import ResponsiveProvider from "@/core/lib/provider.vue";
import MobileLayout from "@/features/Layout/MobileLayout/MobileLayout.vue";
import DesktopLayout from "@/features/Layout/DesktopLayout/DesktopLayout.vue";

/**
 * MainLayout - Orchestrates responsive layouts and handles global view concerns
 */

const { isMobile } = useViewport();
const route = useRoute();
const mounted = ref(false);
const isLoading = ref(false);

onMounted(() => {
  mounted.value = true;
});

// Scroll reset and simulated loading on route changes
watch(
  () => route.path,
  () => {
    window.scrollTo(0, 0);
    isLoading.value = true;
    const timer = setTimeout(() => {
      isLoading.value = false;
    }, 600);
    
    return () => clearTimeout(timer);
  }
);
</script>

<template>
  <div v-if="mounted">
    <!-- Global Route Transition Loader -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[2000] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all duration-300"
    >
      <div class="relative">
        <div class="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
        <div
          class="absolute top-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    </div>

    <!-- Responsive Layout Switcher -->
    <template v-if="isMobile">
      <ResponsiveProvider basePath="/outshine">
        <MobileLayout>
          <router-view />
        </MobileLayout>
      </ResponsiveProvider>
    </template>

    <template v-else>
      <DesktopLayout>
        <router-view />
      </DesktopLayout>
    </template>
  </div>
  
  <!-- Hydration fallback overlay -->
  <div v-else class="fixed inset-0 bg-white flex items-center justify-center">
    <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
</template>
