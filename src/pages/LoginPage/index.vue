<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import LoginMobile from "@/features/login/mobile/LoginMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <LoginMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
