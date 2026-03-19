import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { AuthToken } from './auth-adapter'

/**
 * Token Store using Pinia
 */
export const useTokenStore = defineStore('auth-token', () => {
  const accessToken = ref('')
  const refreshToken = ref('')
  const isHydrated = ref(false)

  const setToken = (val: AuthToken) => {
    accessToken.value = val.accessToken
    refreshToken.value = val.refreshToken
  }

  const clearToken = () => {
    accessToken.value = ''
    refreshToken.value = ''
  }

  const setHasHydrated = () => {
    isHydrated.value = true
  }

  const actions = reactive({
    setToken,
    clearToken,
    setHasHydrated,
  })

  return {
    accessToken,
    refreshToken,
    isHydrated,
    actions,
  }
})

// Selector for compatibility if needed
export const useTokenActions = () => {
  const store = useTokenStore()
  return store.actions
}
