import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { DefaultAuthUserWithLoggedIn } from './auth-adapter'

/**
 * User Store using Pinia
 */
export const useUserStore = defineStore('auth-user', () => {
  const dataUser = ref<DefaultAuthUserWithLoggedIn | null>(null)
  const dataMatrix = ref<any | null>(null)
  const isLoading = ref(true)

  const isLoggedIn = computed(() => !!dataUser.value?.isLoggedIn)

  const setUser = (val: DefaultAuthUserWithLoggedIn) => {
    dataUser.value = {
      ...(dataUser.value || {}),
      ...val,
    } as DefaultAuthUserWithLoggedIn
  }

  const setDataMatrix = (data: any) => {
    dataMatrix.value = {
      ...(dataMatrix.value || {}),
      ...data,
    }
  }

  const clearUser = () => {
    dataUser.value = null
    dataMatrix.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const actions = reactive({
    setUser,
    setDataMatrix,
    clearUser,
    setLoading,
  })

  return {
    dataUser,
    dataMatrix,
    isLoading,
    isLoggedIn,
    actions,
  }
})

export const useUserActions = () => {
  const store = useUserStore()
  return store.actions
}
