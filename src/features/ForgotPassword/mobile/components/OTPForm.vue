<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import OtpInput from "@/shared/ui/OtpInput.vue";
import { usePostVerifyResetOTP } from "@/services/Auth/usePostVerifyResetOTP";
import { usePostOTP } from "@/services/Auth/usePostOTP";
import { useResponsiveRouteParams } from "@/shared/hooks/use-responsive-navigation";
import { useRouter } from "vue-router";

/**
 * OTPForm - Handles OTP verification for password reset
 */

const params = useResponsiveRouteParams<{ email: string }>();
const email = computed(() => params.value.email || "");

const { trigger: verifyOtp, isLoading: isVerifying } = usePostVerifyResetOTP();
const { trigger: resendOtp, isLoading: isResending } = usePostOTP();
const router = useRouter();

const otp = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const timer = ref(60);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const startTimer = () => {
  timer.value = 60;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }, 1000);
};

const handleOtpVerify = async (e?: Event) => {
  if (e) e.preventDefault();
  if (otp.value.length < 6) return;

  errorMessage.value = "";
  successMessage.value = "";
  
  try {
    const res = await verifyOtp({ 
      email: email.value, 
      otp: otp.value 
    });
    
    if (res.success) {
      successMessage.value = "OTP verified! Redirecting...";
      // Navigate to Reset Password Screen via router to change top-level page
      router.push({ path: "/outshine/reset-password", query: { email: email.value, otp: otp.value } });
    } else {
      errorMessage.value = res.message || "Invalid OTP. Please try again.";
    }
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message || "Verification failed. Please try again.";
  }
};

const handleResend = async () => {
  if (timer.value > 0 || isResending.value) return;

  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await resendOtp({ email: email.value, otpCode: "" });
    if (res.success) {
      successMessage.value = "A new OTP has been sent to your email.";
      startTimer();
    } else {
      errorMessage.value = res.message || "Failed to resend OTP.";
    }
  } catch (err: any) {
    errorMessage.value = "Failed to resend. Please try again later.";
  }
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="p-6 bg-white rounded-3xl shadow-xl">
    <form @submit="handleOtpVerify" class="space-y-6 text-center">
      <!-- Icon Container -->
      <div
        class="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          ></path>
        </svg>
      </div>

      <!-- Header -->
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-gray-900">Verifikasi OTP</h2>
        <p class="text-sm text-gray-500">
          Kode OTP telah dikirim ke
          <span class="font-bold text-gray-900">{{ email }}</span>
        </p>
      </div>

      <!-- Status Messages -->
      <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-100 rounded-xl">
        <p class="text-xs text-red-600 font-medium italic">{{ errorMessage }}</p>
      </div>
      <div v-if="successMessage" class="p-3 bg-green-50 border border-green-100 rounded-xl">
        <p class="text-xs text-green-600 font-medium">{{ successMessage }}</p>
      </div>

      <!-- OTP Input -->
      <div class="py-2">
        <OtpInput
          :length="6"
          :disabled="isVerifying"
          @change="(val) => (otp = val)"
          @complete="() => handleOtpVerify()"
        />
      </div>

      <!-- Resend Logic -->
      <div class="text-sm">
        <p v-if="timer > 0" class="text-gray-500">
          Kirim ulang dalam <span class="font-bold text-blue-600">{{ timer }}s</span>
        </p>
        <button
          v-else
          type="button"
          @click="handleResend"
          class="font-bold text-blue-600 hover:text-blue-800 transition-colors"
          :disabled="isResending"
        >
          Kirim Ulang Kode
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isVerifying || otp.length < 6"
        class="w-full flex justify-center items-center py-4 px-4 border border-transparent cursor-pointer text-sm font-bold rounded-2xl text-white bg-[#0F172A] hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95 disabled:opacity-50"
      >
        <span v-if="isVerifying" class="flex items-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Memverifikasi...
        </span>
        <span v-else>Verifikasi OTP</span>
      </button>
    </form>
  </div>
</template>
