<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }>(),
  {
    show: false,
    title: 'Konfirmasi',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    type: 'danger',
  }
);

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:show', value: boolean): void;
}>();

const visible = ref(props.show);

watch(
  () => props.show,
  (val) => {
    visible.value = val;
  }
);

const handleConfirm = () => {
  emit('confirm');
  close();
};

const handleCancel = () => {
  emit('cancel');
  close();
};

const close = () => {
  visible.value = false;
  emit('update:show', false);
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Overlay -->
        <div 
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          @click="handleCancel"
        ></div>

        <!-- Dialog Box -->
        <Transition
          enter-active-class="transition duration-300 ease-out delay-75"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            v-if="visible"
            class="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl shadow-black/10 overflow-hidden"
          >
            <div class="p-6">
              <!-- Header Icon -->
              <div 
                class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                :class="{
                  'bg-red-50 text-red-500': type === 'danger',
                  'bg-amber-50 text-amber-500': type === 'warning',
                  'bg-blue-50 text-blue-500': type === 'info'
                }"
              >
                <!-- Danger Icon -->
                <svg v-if="type === 'danger'" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3.04l-6.928-120c-.77-1.333-2.694-1.333-3.464 0L3.34 16.96c-.77 1.373.192 3.04 1.732 3.04z" />
                </svg>
                <!-- Warning Icon -->
                <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <!-- Info Icon -->
                <svg v-else viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>

              <!-- Content -->
              <h3 class="text-xl font-black text-slate-800 mb-2 tracking-tight">
                {{ title }}
              </h3>
              <p class="text-[13px] font-medium text-slate-500 leading-relaxed">
                {{ message }}
              </p>
            </div>

            <!-- Actions -->
            <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button
                @click="handleCancel"
                class="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
              >
                {{ cancelText }}
              </button>
              <button
                @click="handleConfirm"
                class="flex-1 px-4 py-3 rounded-xl text-[13px] font-bold text-white shadow-lg active:scale-95 transition-all"
                :class="{
                  'bg-red-600 hover:bg-red-700 shadow-red-500/30': type === 'danger',
                  'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30': type === 'warning',
                  'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30': type === 'info'
                }"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
