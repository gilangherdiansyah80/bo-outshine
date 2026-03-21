<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import DetailOrderMobile from "@/features/DetailOrder/mobile/DetailOrderMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <DetailOrderMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
