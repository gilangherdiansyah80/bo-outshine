<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import ManagementScreen from "./screen/ManagementScreen.vue";
import AddProductScreen from "./screen/AddProductScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="ManagementScreen" />
  <ResponsiveRoute path="/add-product" :component="AddProductScreen" />
</template>
