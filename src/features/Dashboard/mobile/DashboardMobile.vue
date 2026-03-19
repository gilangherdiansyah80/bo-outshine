<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import DashboardScreen from "./screen/DashboardScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="DashboardScreen" />
</template>
