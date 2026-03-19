<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDevice } from '@/shared/hooks/use-viewport'
import { useNavigationStore } from '@/core/lib/store'
import { isValidScreenPath, parseScreenSearchParam } from '@/core/lib/utils'

export type Props = {
  basePath: string
}

const props = withDefaults(defineProps<Props>(), {
  basePath: '/',
})

const router = useRouter()
const route = useRoute()
const { isMobile } = useDevice()
const navigationStore = useNavigationStore()

// Flags to prevent circular updates
const isUpdatingFromUrl = ref(false)
const isUpdatingFromStack = ref(false)

// Computed values from store
const currentStackEntry = computed(() => {
  const stack = navigationStore.stack
  return stack[stack.length - 1]
})

const currentStackPath = computed(() => currentStackEntry.value?.path ?? '/')
const currentStackParams = computed(() => currentStackEntry.value?.params ?? {})

// Get screen param from URL query
const screenSearchParam = computed(() => {
  return (route.query.screen as string) ?? null
})

const doInitialSync = () => {
  // Always mark as hydrated on mount
  navigationStore.actions.setHasHydrated()

  // If not mobile, we don't sync with URL params but we still need to be "ready"
  if (!isMobile.value) {
    navigationStore.actions.setHasReady()
    return
  }

  if (!navigationStore.isHydrated) return

  const urlScreenPath = screenSearchParam.value
    ? parseScreenSearchParam(screenSearchParam.value)
    : '/'

  if (
    isValidScreenPath(urlScreenPath) &&
    urlScreenPath !== currentStackPath.value
  ) {
    isUpdatingFromUrl.value = true
    navigationStore.actions.replace(urlScreenPath, {})
    setTimeout(() => {
      isUpdatingFromUrl.value = false
    }, 0)
  }

  navigationStore.actions.setHasReady()
}

/**
 * Sync URL to match stack (when stack changes from user navigation)
 */
const syncUrlFromStack = () => {
  if (!isMobile.value || !navigationStore.isHydrated || !navigationStore.isReady) return
  if (isUpdatingFromUrl.value) return

  const newQuery: Record<string, string> = {
    screen: currentStackPath.value,
  }

  // Add extra params from stack, sorted by key for stability
  const keys = Object.keys(currentStackParams.value).sort()
  keys.forEach((key) => {
    const value = currentStackParams.value[key]
    if (value !== undefined && value !== null) {
      newQuery[key] = String(value)
    }
  })

  // Only update URL if something is actually different
  const currentScreen = route.query.screen as string | undefined
  if (newQuery.screen !== currentScreen) {
    isUpdatingFromStack.value = true
    router.replace({ query: newQuery })
    setTimeout(() => {
      isUpdatingFromStack.value = false
    }, 0)
  }
}

/**
 * Sync stack to match URL (when URL changes from browser navigation)
 */
const syncStackFromUrl = () => {
  if (!isMobile.value || !navigationStore.isHydrated || !navigationStore.isReady) return
  if (isUpdatingFromStack.value) return

  const urlScreenPath = screenSearchParam.value
    ? parseScreenSearchParam(screenSearchParam.value)
    : '/'

  // Extract other params from query
  const otherParams: Record<string, string> = {}
  Object.entries(route.query).forEach(([key, value]) => {
    if (key !== 'screen' && value) {
      otherParams[key] = String(value)
    }
  })

  // Check if stack already matches URL to prevent loops
  const paramsMatch =
    JSON.stringify(otherParams) === JSON.stringify(currentStackParams.value)
  if (urlScreenPath === currentStackPath.value && paramsMatch) return

  if (!isValidScreenPath(urlScreenPath)) return

  isUpdatingFromUrl.value = true
  navigationStore.actions.replace(urlScreenPath, otherParams)
  setTimeout(() => {
    isUpdatingFromUrl.value = false
  }, 0)
  navigationStore.actions.setHasReady()
}

// Watch for route changes (initial sync)
onMounted(() => {
  doInitialSync()
})

// Watch for store stack changes → sync to URL
watch(
  [currentStackPath, currentStackParams],
  () => syncUrlFromStack(),
)

// Watch for URL query changes → sync to store
watch(
  () => route.query,
  () => syncStackFromUrl(),
)
</script>

<template>
  <!-- Renderless component: handles URL ↔ store sync only -->
</template>
