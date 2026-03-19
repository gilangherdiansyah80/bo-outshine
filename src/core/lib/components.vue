<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useNavigationStore } from '@/core/lib/store'

const props = defineProps<{
  /** The route path to match (e.g., "/") */
  path: string
  /** The Vue component to render when path matches */
  component: Component
}>()

const navigationStore = useNavigationStore()

const currentPath = computed(() => {
  const stack = navigationStore.stack
  return stack[stack.length - 1]?.path || '/'
})

const isMatch = computed(() => props.path === currentPath.value)
const isReady = computed(() => navigationStore.isReady)
const shouldRender = computed(() => isMatch.value && isReady.value)

</script>

<template>
  <component :is="component" v-if="shouldRender" />
</template>
