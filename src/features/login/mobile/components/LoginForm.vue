<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/shared/ui/Card.vue'
import Input from '@/shared/ui/Input.vue'
import Button from '@/shared/ui/Button.vue'
import { usePostLogin } from '@/services/Auth/usePostLogin'
import { useTokenStore } from '@/core/lib/auth-adapter/tokenStore'
import { useUserStore } from '@/core/lib/auth-adapter/userStore'

/**
 * LoginForm - Email/Password form card using shared UI components
 */

const router = useRouter()
const tokenStore = useTokenStore()
const userStore = useUserStore()
const { trigger, isLoading } = usePostLogin()

const email = ref('')
const password = ref('')
const loginError = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) return
  
  loginError.value = ''
  
  try {
    const res = await trigger({ 
      email: email.value, 
      password: password.value 
    })
    
    if (res.success && res.data) {
      // Store tokens
      tokenStore.actions.setToken({
        accessToken: res.data.accessToken || '',
        refreshToken: res.data.refreshToken || ''
      })
      
      // Update User Store
      userStore.actions.setUser({
        isLoggedIn: true,
        email: res.data.user?.email || email.value,
        name: res.data.user?.fullName || 'User',
        ...res.data.user
      } as any)
      
      // Redirect to home
      router.push('/home')
    } else {
      loginError.value = res.message || 'Login failed. Please check your credentials.'
    }
  } catch (err: any) {
    console.error('Login error:', err)
    loginError.value = err?.response?.data?.message || 'Unauthorized: Invalid email or password.'
  }
}
</script>

<template>
  <div class="login-form">
    <Card no-padding class="login-form__card">
      <div class="p-6 sm:p-8">
        <!-- Error Message -->
        <div v-if="loginError" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
          <p class="text-[11px] text-red-600 font-medium uppercase tracking-wider text-center">
            {{ loginError }}
          </p>
        </div>

        <!-- Email Field -->
        <div class="mb-6">
          <Input
            v-model="email"
            label="EMAIL ADDRESS"
            type="email"
            placeholder="editorial@theatelier.com"
            required
          >
            <template #prefix>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </template>
          </Input>
        </div>

        <!-- Password Field -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-1">
            <label class="block text-sm font-medium text-gray-700 uppercase tracking-wider text-[11px]">PASSWORD</label>
            <a href="#" class="text-[10px] font-semibold text-blue-600 uppercase tracking-wider hover:text-blue-700 transition-colors">FORGOT PASSWORD?</a>
          </div>
          <Input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          >
            <template #prefix>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="16" r="1" fill="currentColor"/>
                </svg>
              </div>
            </template>
          </Input>
        </div>

        <!-- Login Button -->
        <Button 
          block 
          size="lg" 
          :loading="isLoading"
          class="mt-4 !bg-blue-600 hover:!bg-blue-700 shadow-lg shadow-blue-500/30 uppercase tracking-[4px] py-4 rounded-xl"
          @click="handleLogin"
        >
          LOGIN
        </Button>

        <!-- Access Notice -->
        <p class="mt-8 text-center text-xs text-gray-400 leading-relaxed uppercase tracking-wider">
          Access restricted to authorized editorial staff
          <br />and administrators of The Atelier.
        </p>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.login-form {
  padding: 0 20px;
}

.login-form__card {
  border-radius: 16px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.04),
    0 2px 10px rgba(0, 0, 0, 0.02);
}

/* Override Input base label if needed or just use Tailwind in template */
:deep(.text-sm) {
  letter-spacing: 1.5px;
}
</style>
