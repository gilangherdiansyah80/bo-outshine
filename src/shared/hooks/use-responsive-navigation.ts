import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNavigationStore } from '@/core/lib/store'

/**
 * Simple selector composable for navigation state
 */
export const useNavigationState = () => {
  const store = useNavigationStore()
  return store
}

/**
 * Access the navigation actions
 */
export const useNavigationActions = () => {
  const store = useNavigationStore()
  return store.actions
}

/**
 * Composable for responsive navigation with vue-router integration
 */
export const useResponsiveNavigation = () => {
  const router = useRouter()
  const store = useNavigationStore()
  const { push, pop: popFromStack, popTo, popToTop, replace } = store.actions

  const pop = () => {
    if (store.stack.length > 1) {
      popFromStack()
    } else {
      router.back()
    }
  }

  const currentScreen = computed(() => store.stack[store.stack.length - 1])

  return {
    push,
    pop,
    popTo,
    popToTop,
    replace,
    stack: store.stack,
    currentScreen,
  }
}

/**
 * Composable to access current route parameters
 */
export const useResponsiveRouteParams = <
  T extends Record<string, unknown> = Record<string, unknown>,
>() => {
  const store = useNavigationStore()
  return computed(() =>
    (store.stack[store.stack.length - 1]?.params as T) || ({} as T),
  )
}
