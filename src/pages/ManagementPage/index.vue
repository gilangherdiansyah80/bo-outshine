<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import ManagementMobile from "@/features/Management/mobile/ManagementMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <ManagementMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
