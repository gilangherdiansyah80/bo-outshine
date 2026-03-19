<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import ForgotPasswordMobile from "@/features/ForgotPassword/mobile/ForgotPasswordMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <ForgotPasswordMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
