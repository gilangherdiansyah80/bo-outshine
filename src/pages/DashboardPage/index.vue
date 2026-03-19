<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import DashboardMobile from "@/features/Dashboard/mobile/DashboardMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <DashboardMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
