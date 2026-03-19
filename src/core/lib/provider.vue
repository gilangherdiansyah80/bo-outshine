<script setup lang="ts">
import { useBrowserNavigation } from '@/core/lib/browser-navigation'
import ResponsiveSearchParamsSync from '@/core/lib/url-sync.vue'

const props = withDefaults(defineProps<{
  basePath?: string
}>(), {
  basePath: '/',
})

/**
 * Responsive navigation provider that orchestrates all navigation logic.
 * Wraps the application to provide virtual navigation capabilities on mobile.
 */
useBrowserNavigation()
</script>

<template>
  <ResponsiveSearchParamsSync :basePath="props.basePath" />
  <slot />
</template>
