/**
 * Responsive Navigation System Public API
 */

// Core types and interfaces
export type {
  NavigationActions,
  NavigationState,
  ResponsiveProviderProps,
  ResponsiveRouteProps,
  StackEntry,
} from './types'

// Store access
export { useNavigationStore } from './store'

// Hooks
export {
  useNavigationActions,
  useNavigationState,
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from '@/shared/hooks/use-responsive-navigation'

// Utilities
export {
  createScreenSearchParam,
  isValidScreenPath,
  parseScreenSearchParam,
} from './utils'

// Browser logic
export { useBrowserNavigation } from './browser-navigation'

// Type guards
export { isValidStackEntry } from './types'
