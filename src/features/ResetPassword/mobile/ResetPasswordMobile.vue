<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import ResetPasswordScreen from "./screen/ResetPasswordScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="ResetPasswordScreen" />
</template>
