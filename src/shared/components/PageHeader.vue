<script setup lang="ts">
/**
 * PageHeader Component
 * Standard header for dashboard pages
 */
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="md:flex md:items-center md:justify-between mb-8">
    <div class="min-w-0 flex-1">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500">
        {{ subtitle }}
      </p>
    </div>
    <div class="mt-4 flex md:ml-4 md:mt-0 gap-x-3">
      <slot name="actions" />
    </div>
  </div>
</template>
