<script setup lang="ts">
/**
 * LoginHeader - Displays the brand title and subtitle
 */
</script>

<template>
  <div class="login-header">
    <h1 class="login-header__title">THE ATELIER</h1>
    <p class="login-header__subtitle">ADMIN LOGIN</p>
  </div>
</template>

<style scoped>
.login-header {
  text-align: center;
  padding: 48px 24px 32px;
}

.login-header__title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 4px;
  margin-bottom: 8px;
}

.login-header__subtitle {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  letter-spacing: 6px;
  text-transform: uppercase;
}
</style>
