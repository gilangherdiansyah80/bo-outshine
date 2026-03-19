import { ref, computed, onMounted, onUnmounted } from 'vue'

// Default breakpoint (matches Tailwind's md breakpoint)
const DEFAULT_MOBILE_BREAKPOINT = 768

// Debounce delay in milliseconds
const DEFAULT_DEBOUNCE_MS = 100

export interface DeviceInfo {
  /** Whether the viewport is mobile-sized (< breakpoint) */
  isMobile: boolean
  /** Whether the viewport is desktop-sized (>= breakpoint) */
  isDesktop: boolean
  /** Whether the component has mounted */
  mounted: boolean
}

export interface UseDeviceOptions {
  /** Custom breakpoint in pixels. Default: 768 */
  breakpoint?: number
  /** Debounce delay in ms. Set to 0 to disable. Default: 100 */
  debounceMs?: number
}

/**
 * A robust composable for detecting device viewport size.
 *
 * Features:
 * - Debounces resize events for performance
 * - Uses `matchMedia` for efficient media query listening
 * - Supports custom breakpoints
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { isMobile, mounted } = useDevice()
 *
 * // or with custom breakpoint
 * const { isMobile } = useDevice({ breakpoint: 1024 })
 * </script>
 * ```
 */
export const useDevice = (options: UseDeviceOptions = {}) => {
  const {
    breakpoint = DEFAULT_MOBILE_BREAKPOINT,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options

  const isMobile = ref(false)
  const mounted = ref(false)
  const isDesktop = computed(() => !isMobile.value)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let mediaQuery: MediaQueryList | null = null

  const updateValue = () => {
    isMobile.value = window.innerWidth < breakpoint
  }

  const debouncedUpdate = () => {
    if (debounceMs === 0) {
      updateValue()
      return
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(updateValue, debounceMs)
  }

  onMounted(() => {
    // Initial sync
    updateValue()
    mounted.value = true

    // Use matchMedia for efficient media query listening
    mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    mediaQuery.addEventListener('change', debouncedUpdate)

    // Fallback for resize (catches edge cases)
    window.addEventListener('resize', debouncedUpdate)
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', debouncedUpdate)
    }
    window.removeEventListener('resize', debouncedUpdate)
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  return { isMobile, isDesktop, mounted }
}

/**
 * Simple composable that returns the viewport state.
 * Alias for useDevice with default options.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { isMobile } = useViewport()
 * </script>
 * ```
 */
export const useViewport = (options: UseDeviceOptions = {}) => {
  return useDevice(options)
}

/**
 * Composable that returns a computed boolean for mobile viewport.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const isMobile = useIsMobile()
 * </script>
 * ```
 */
export const useIsMobile = (options: UseDeviceOptions = {}) => {
  const { isMobile, mounted } = useDevice(options)
  return computed(() => mounted.value && isMobile.value)
}

/**
 * Composable that returns a computed boolean for desktop viewport.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const isDesktop = useIsDesktop()
 * </script>
 * ```
 */
export const useIsDesktop = (options: UseDeviceOptions = {}) => {
  const { isDesktop, mounted } = useDevice(options)
  return computed(() => mounted.value && isDesktop.value)
}
