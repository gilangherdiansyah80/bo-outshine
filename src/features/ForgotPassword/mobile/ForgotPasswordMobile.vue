<script setup lang="ts">
import ResponsiveRoute from "@/core/lib/components.vue";
import ForgotPasswordScreen from "./screen/ForgotPasswordScreen.vue";
import OTPScreen from "./screen/OTPScreen.vue";
</script>

<template>
  <ResponsiveRoute path="/" :component="ForgotPasswordScreen" />
  <ResponsiveRoute path="/code-otp" :component="OTPScreen" />
</template>
