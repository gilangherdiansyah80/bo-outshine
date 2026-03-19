import { watch, onMounted, onUnmounted } from 'vue'
import { useNavigationStore } from '@/core/lib/store'
import { parseScreenSearchParam } from '@/core/lib/utils'
import { useDevice } from '@/shared/hooks/use-viewport'

/**
 * Composable to handle browser back/forward navigation.
 * Syncs the browser URL with the virtual navigation stack on mobile.
 */
export const useBrowserNavigation = () => {
  const navigationStore = useNavigationStore()
  const { isMobile } = useDevice()

  let handlePopState: (() => void) | null = null

  const setupListener = () => {
    // Browser navigation syncing only needed on mobile where we have virtual stack
    if (!isMobile.value) return

    handlePopState = () => {
      try {
        // If we're doing a real navigation (e.g. from router.back()), don't interfere
        if (navigationStore.isDoingRealNavigation) {
          navigationStore.actions.setIsDoingRealNavigation(false)
          return
        }

        const searchParams = new URLSearchParams(window.location.search)
        const newScreen = searchParams.get('screen') ?? '/'
        const decodedScreen = parseScreenSearchParam(newScreen)

        const currentStack = navigationStore.stack
        const topOfStackPath = currentStack[currentStack.length - 1]?.path

        // Only sync if the URL state is different from the stack state
        if (decodedScreen !== topOfStackPath) {
          // Check if the target screen exists in our stack
          const targetIndex = currentStack.findIndex(
            (entry) => entry.path === decodedScreen,
          )

          if (targetIndex !== -1) {
            // If target exists in stack, pop to it
            navigationStore.actions.popTo(decodedScreen)
          } else {
            // If target doesn't exist in stack, it means we went back beyond our virtual navigation
            // Reset to the target screen or home
            navigationStore.actions.replace(decodedScreen)
          }
        }
      } catch (error) {
        console.error('[ResponsiveNavigation] Popstate handler error:', error)
        // Reset to safe home state on error
        navigationStore.actions.replace('/')
      }
    }

    window.addEventListener('popstate', handlePopState)
  }

  const removeListener = () => {
    if (handlePopState) {
      window.removeEventListener('popstate', handlePopState)
      handlePopState = null
    }
  }

  onMounted(() => {
    setupListener()
  })

  onUnmounted(() => {
    removeListener()
  })

  // Re-setup listener when isMobile changes
  watch(isMobile, () => {
    removeListener()
    setupListener()
  })
}
