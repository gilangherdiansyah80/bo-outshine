<script setup lang="ts">
import { ref, watch } from 'vue';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

const props = withDefaults(
  defineProps<{
    type?: AlertType;
    message: string;
    show?: boolean;
    duration?: number;
    closable?: boolean;
  }>(),
  {
    type: 'info',
    show: true,
    duration: 0,
    closable: true,
  },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const visible = ref(props.show);

watch(
  () => props.show,
  (val) => {
    visible.value = val;
    if (val && props.duration > 0) {
      setTimeout(() => {
        visible.value = false;
        emit('close');
      }, props.duration);
    }
  },
);

const close = () => {
  visible.value = false;
  emit('close');
};

const styles: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: 'text-emerald-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: 'text-amber-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500',
  },
};
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="visible"
      class="flex items-start gap-3 p-4 rounded-2xl border"
      :class="[styles[type].bg, styles[type].border]"
    >
      <!-- Icon -->
      <div class="flex-shrink-0 mt-0.5" :class="styles[type].icon">
        <!-- Success -->
        <svg v-if="type === 'success'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <!-- Error -->
        <svg v-else-if="type === 'error'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <!-- Warning -->
        <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <!-- Info -->
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </div>

      <!-- Message -->
      <p class="flex-1 text-[13px] font-medium" :class="styles[type].text">
        {{ message }}
      </p>

      <!-- Close -->
      <button
        v-if="closable"
        type="button"
        @click="close"
        class="flex-shrink-0 p-0.5 rounded-full transition-colors hover:bg-black/5"
        :class="styles[type].text"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
