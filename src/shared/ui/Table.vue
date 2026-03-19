<script setup lang="ts">
const props = withDefaults(defineProps<{
  columns: {
    key: string
    label: string
    align?: 'left' | 'center' | 'right'
    width?: string
  }[]
  data: any[]
  loading?: boolean
  emptyMessage?: string
}>(), {
  loading: false,
  emptyMessage: 'No data found'
})
</script>

<template>
  <div class="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th 
            v-for="col in columns" 
            :key="col.key"
            scope="col" 
            class="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6"
            :class="[
              col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
            ]"
            :style="{ width: col.width }"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <!-- Loading State -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="py-12 text-center text-sm text-gray-500">
            <div class="flex justify-center flex-col items-center">
              <svg class="animate-spin h-6 w-6 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="!data || data.length === 0">
          <td :colspan="columns.length" class="py-10 text-center text-sm text-gray-500">
            {{ emptyMessage }}
          </td>
        </tr>

        <!-- Data Rows -->
        <tr v-else v-for="(row, rowIndex) in data" :key="rowIndex" class="hover:bg-gray-50 transition-colors">
          <td 
            v-for="col in columns" 
            :key="col.key"
            class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 text-gray-900"
            :class="[
               col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
            ]"
          >
            <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
