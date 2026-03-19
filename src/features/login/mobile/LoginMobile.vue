<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import LoginScreen from "./screen/LoginScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="LoginScreen" />
</template>
