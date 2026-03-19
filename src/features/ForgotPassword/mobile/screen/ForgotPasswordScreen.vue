<script setup lang="ts">
/**
 * ForgotPasswordScreen - Assembles the forgot password page components
 */
import ForgotPasswordHeader from "../components/ForgotPasswordHeader.vue";
import ForgotPasswordForm from "../components/ForgotPasswordForm.vue";
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
      class="absolute top-4 left-4 backdrop-blur-sm text-[#0F172A] transition-all active:scale-90"
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
      <ForgotPasswordHeader />
      <div class="mt-8 mb-8">
        <ForgotPasswordForm />
      </div>
      <div class="mt-auto">
        <LoginFooter />
      </div>
    </div>
  </main>
</template>
