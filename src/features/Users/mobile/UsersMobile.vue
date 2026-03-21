<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import UsersScreen from "./screen/UsersScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="UsersScreen" />
</template>
