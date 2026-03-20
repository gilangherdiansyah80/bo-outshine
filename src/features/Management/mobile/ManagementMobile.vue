<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import ManagementScreen from "./screen/ManagementScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="ManagementScreen" />
</template>
