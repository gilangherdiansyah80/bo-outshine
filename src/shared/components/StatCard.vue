<script setup lang="ts">
/**
 * StatCard Component
 * Displays key metrics on the dashboard
 */
defineProps<{
  label: string
  value: string | number
  trend?: {
    value: string
    positive: boolean
  }
  icon?: string
}>()
</script>

<template>
  <div class="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-all hover:shadow-md">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
          {{ label }}
        </p>
        <h3 class="mt-1 text-2xl font-bold text-gray-800 dark:text-white">
          {{ value }}
        </h3>
        
        <div v-if="trend" class="flex items-center mt-2">
          <span 
            :class="[trend.positive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50']"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          >
            <svg v-if="trend.positive" class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1V9a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L12 9.586l4.293-4.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0L9 9.414 5.414 13H12z" clip-rule="evenodd"></path>
            </svg>
            {{ trend.value }}
          </span>
          <span class="ml-2 text-xs text-gray-400">vs last month</span>
        </div>
      </div>
      
      <div v-if="icon" class="p-3 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
    </div>
  </div>
</template>
