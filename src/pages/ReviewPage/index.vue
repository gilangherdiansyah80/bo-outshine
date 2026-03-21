<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import ReviewMobile from "@/features/Review/mobile/ReviewMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <ReviewMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
