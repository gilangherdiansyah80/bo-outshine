<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import OrderMobile from "@/features/Order/mobile/OrderMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <OrderMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
