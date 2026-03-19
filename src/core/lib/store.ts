import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { StackEntry, NavigationState } from './types'

/**
 * Navigation store using Pinia
 */
export const useNavigationStore = defineStore('navigation', () => {
  const stack = ref<StackEntry[]>([{ path: '/', params: {} }])
  const isHydrated = ref(false)
  const isReady = ref(false)
  const isDoingRealNavigation = ref(false)
  const navigationAttempts = ref(0)
  const lastNavigationTime = ref(0)

  const push = (path: string, params: Record<string, unknown> = {}) => {
    stack.value.push({ path, params })
  }

  const pop = () => {
    if (stack.value.length > 1) {
      stack.value.pop()
    }
  }

  const popTo = (path: string) => {
    const index = stack.value.findIndex((entry) => entry.path === path)
    if (index !== -1) {
      stack.value = stack.value.slice(0, index + 1)
    }
  }

  const popToTop = () => {
    if (stack.value.length > 1) {
      stack.value = [stack.value[0]]
    }
  }

  const replace = (path: string, params: Record<string, unknown> = {}) => {
    if (stack.value.length > 0) {
      stack.value[stack.value.length - 1] = { path, params }
    } else {
      stack.value = [{ path, params }]
    }
  }

  const setHasHydrated = () => {
    isHydrated.value = true
  }

  const setHasReady = () => {
    isReady.value = true
  }

  const setIsDoingRealNavigation = (value: boolean) => {
    isDoingRealNavigation.value = value
  }

  const resetNavigationSafety = () => {
    navigationAttempts.value = 0
    lastNavigationTime.value = 0
  }

  const setNavigationAttempts = (attempts: number) => {
    navigationAttempts.value = attempts
  }

  const actions = reactive({
    push,
    pop,
    popTo,
    popToTop,
    replace,
    setHasHydrated,
    setHasReady,
    setIsDoingRealNavigation,
    resetNavigationSafety,
    setNavigationAttempts,
  })

  return {
    stack,
    isHydrated,
    isReady,
    isDoingRealNavigation,
    navigationAttempts,
    lastNavigationTime,
    actions,
  }
})

export type { NavigationState }
