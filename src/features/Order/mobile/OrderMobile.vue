<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import OrderScreen from "./screen/OrderScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="OrderScreen" />
</template>
