<script setup lang="ts">
import { useViewport } from "@/shared/hooks/use-viewport";
import UsersMobile from "@/features/Users/mobile/UsersMobile.vue";

const { isMobile } = useViewport();
</script>

<template>
  <UsersMobile v-if="isMobile" />
  <!-- TODO: Desktop login view -->
  <h1 v-else>Belum ready</h1>
</template>
