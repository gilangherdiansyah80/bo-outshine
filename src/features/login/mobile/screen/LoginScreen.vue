<script setup lang="ts">
/**
 * LoginScreen - Assembles login page components
 */
import LoginHeader from "../components/LoginHeader.vue";
import LoginForm from "../components/LoginForm.vue";
import LoginFooter from "../components/LoginFooter.vue";
import LoginHero from "../components/LoginHero.vue";
</script>

<template>
  <main class="min-h-screen flex flex-col overflow-x-hidden">
    <!-- Hero Image Area -->
    <LoginHero />

    <!-- Content Area with Rounded Top -->
    <div class="flex-1 flex flex-col bg-[#0F172A] rounded-t-3xl -mt-2">
      <LoginHeader />
      <div class="mt-4 mb-8">
        <LoginForm />
      </div>
      <div class="mt-auto">
        <LoginFooter />
      </div>
    </div>
  </main>
</template>
