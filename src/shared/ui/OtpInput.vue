<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

/**
 * OtpInput - A reusable OTP input component with auto-focus and shift
 */

const props = defineProps<{
  length?: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "change", value: string): void;
  (e: "complete", value: string): void;
}>();

const length = props.length || 6;
const otpValues = ref<string[]>(Array(length).fill(""));
const inputRefs = ref<HTMLInputElement[]>([]);

const setRef = (el: any, index: number) => {
  if (el) inputRefs.value[index] = el;
};

const onInput = (index: number, e: Event) => {
  const target = e.target as HTMLInputElement;
  const val = target.value;

  if (val.length > 1) {
    // Handle paste or multiple characters
    const digits = val.slice(0, length).split("");
    digits.forEach((d, i) => {
      if (index + i < length) {
        otpValues.value[index + i] = d;
      }
    });
    const nextIndex = Math.min(index + digits.length, length - 1);
    inputRefs.value[nextIndex]?.focus();
  } else {
    otpValues.value[index] = val;
    if (val && index < length - 1) {
      inputRefs.value[index + 1]?.focus();
    }
  }

  const result = otpValues.value.join("");
  emit("change", result);
  if (result.length === length) {
    emit("complete", result);
  }
};

const onKeyDown = (index: number, e: KeyboardEvent) => {
  if (e.key === "Backspace" && !otpValues.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
};

watch(() => props.disabled, (newVal) => {
  if (newVal) {
    // Optional: blur if disabled
  }
});

onMounted(() => {
  inputRefs.value[0]?.focus();
});
</script>

<template>
  <div class="flex justify-center gap-2 sm:gap-4">
    <input
      v-for="(_, index) in length"
      :key="index"
      :ref="(el) => setRef(el, index)"
      v-model="otpValues[index]"
      type="text"
      inputmode="numeric"
      maxlength="1"
      class="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl transition-all outline-none"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      :disabled="disabled"
      @input="onInput(index, $event)"
      @keydown="onKeyDown(index, $event)"
    />
  </div>
</template>
