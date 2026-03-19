<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'full' | 'default'
}>(), {
  variant: 'gray',
  size: 'md',
  rounded: 'full'
})

const classes = computed(() => {
  const base = 'inline-flex items-center font-medium'
  
  const variants = {
    gray: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10',
    red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10',
    yellow: 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
    green: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10',
    indigo: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
    purple: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10',
    pink: 'bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-700/10',
  }
  
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-2.5 py-1 text-sm',
  }
  
  const rounding = props.rounded === 'full' ? 'rounded-full' : 'rounded-md'

  return [base, variants[props.variant], sizes[props.size], rounding].join(' ')
})
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
