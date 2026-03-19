<script setup lang="ts">
import { useSlots, computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  noPadding?: boolean
}>(), {
  noPadding: false,
})

const slots = useSlots()
const hasHeader = computed(() => !!props.title || !!props.subtitle || !!slots.header || !!slots.action)
const hasFooter = computed(() => !!slots.footer)
</script>

<template>
  <div class="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
    <!-- Header -->
    <div v-if="hasHeader" class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
      <div>
        <slot name="header">
          <h3 v-if="title" class="text-base font-semibold leading-6 text-gray-900">{{ title }}</h3>
          <p v-if="subtitle" class="mt-1 max-w-2xl text-sm text-gray-500">{{ subtitle }}</p>
        </slot>
      </div>
      <div v-if="$slots.action" class="flex-shrink-0">
        <slot name="action" />
      </div>
    </div>
    
    <!-- Body -->
    <div :class="[noPadding ? '' : 'px-4 py-5 sm:p-6']">
      <slot />
    </div>
    
    <!-- Footer -->
    <div v-if="hasFooter" class="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>
