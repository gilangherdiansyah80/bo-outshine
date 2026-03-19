<script setup lang="ts">
/**
 * LoginScreen - Assembles login page components
 */
import LoginHeader from '../components/LoginHeader.vue'
import LoginForm from '../components/LoginForm.vue'
import LoginFooter from '../components/LoginFooter.vue'
</script>

<template>
  <div class="login-screen">
    <LoginHeader />
    <LoginForm />
    <LoginFooter />
  </div>
</template>

<style scoped>
.login-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(180deg, #f0f2f8 0%, #e8ebf2 50%, #dfe3ec 100%);
}
</style>
