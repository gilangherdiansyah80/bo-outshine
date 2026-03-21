<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import ReviewScreen from "./screen/ReviewScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="ReviewScreen" />
</template>
