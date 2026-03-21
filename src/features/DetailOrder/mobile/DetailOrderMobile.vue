<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import DetailOrderScreen from "./screen/DetailOrderScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="DetailOrderScreen" />
</template>
