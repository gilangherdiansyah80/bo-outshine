<script setup lang="ts">
/**
 * ResetPasswordScreen - Assembles the reset password page components
 */
import ResetPasswordForm from "../components/ResetPasswordForm.vue";
import LoginFooter from "@/features/login/mobile/components/LoginFooter.vue";
import LoginHero from "@/features/login/mobile/components/LoginHero.vue";
import { useResponsiveNavigation } from "@/shared/hooks/use-responsive-navigation";

const { pop } = useResponsiveNavigation();

const handleBack = () => {
  pop();
};
</script>

<template>
  <main class="min-h-screen flex flex-col overflow-x-hidden relative">
    <!-- Back Button -->
    <button
      @click="handleBack"
      class="absolute top-4 left-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#0F172A] shadow-md hover:bg-white transition-all active:scale-90"
      aria-label="Back"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M15 19l-7-7 7-7"
        ></path>
      </svg>
    </button>

    <!-- Hero Image Area -->
    <LoginHero />

    <!-- Content Area with Rounded Top -->
    <div
      class="flex-1 flex flex-col bg-[#0F172A] rounded-t-3xl -mt-2 px-4 pb-8"
    >
      <div class="mt-8 mb-8">
        <ResetPasswordForm />
      </div>
      <div class="mt-auto">
        <LoginFooter />
      </div>
    </div>
  </main>
</template>
