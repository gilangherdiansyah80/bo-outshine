<script setup lang="ts">
/**
 * BottomSheet Component
 * Slides up from bottom, ideal for mobile actions/forms
 */
defineProps<{
  show: boolean
  title?: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-end justify-center"
        aria-labelledby="bottom-sheet-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Background Overlay -->
        <div
          class="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
          @click="$emit('close')"
        />

        <!-- Bottom Sheet Panel -->
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="ease-in duration-200"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div
            v-if="show"
            class="relative w-full max-w-lg bg-white rounded-t-2xl shadow-xl transform transition-all max-h-[85vh] flex flex-col"
          >
            <!-- Drag Handle -->
            <div class="flex justify-center pt-3 pb-1">
              <div class="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <!-- Header -->
            <div class="flex items-center justify-between px-4 pb-3">
              <h3
                v-if="title"
                id="bottom-sheet-title"
                class="text-lg font-semibold text-gray-900"
              >
                {{ title }}
              </h3>
              <span v-else />
              <button
                type="button"
                class="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                @click="$emit('close')"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="px-4 pb-4 overflow-y-auto flex-1">
              <slot />
            </div>

            <!-- Footer (optional) -->
            <div
              v-if="$slots.footer"
              class="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-none"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
