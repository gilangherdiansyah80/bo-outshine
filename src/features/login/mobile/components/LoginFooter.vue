<script setup lang="ts">
/**
 * LoginFooter - Copyright text and footer links
 */
</script>

<template>
  <div class="login-footer">
    <p class="login-footer__editorial">EDITORIAL PRECISION © 2024</p>

    <div class="login-footer__links">
      <a href="#" class="login-footer__link">PRIVACY POLICY</a>
      <span class="login-footer__dot">•</span>
      <a href="#" class="login-footer__link">SUPPORT</a>
      <span class="login-footer__dot">•</span>
      <a href="#" class="login-footer__link">TERMS OF SERVICE</a>
    </div>

    <p class="login-footer__copyright">
      © 2024 DIGITAL ATELIER ADMIN. EDITORIAL PRECISION.
    </p>
  </div>
</template>

<style scoped>
.login-footer {
  text-align: center;
  padding: 40px 24px 32px;
}

.login-footer__editorial {
  font-size: 11px;
  font-weight: 500;
  color: #c4c9d4;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 48px;
}

.login-footer__links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.login-footer__link {
  font-size: 11px;
  font-weight: 500;
  color: #3b5bdb;
  letter-spacing: 1.5px;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.login-footer__link:hover {
  color: #2b4acb;
}

.login-footer__dot {
  font-size: 8px;
  color: #c4c9d4;
}

.login-footer__copyright {
  font-size: 10px;
  font-weight: 500;
  color: #9ca3af;
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
