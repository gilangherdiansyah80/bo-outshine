<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import ResetPasswordMobile from "@/features/ResetPassword/mobile/ResetPasswordMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <ResetPasswordMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
