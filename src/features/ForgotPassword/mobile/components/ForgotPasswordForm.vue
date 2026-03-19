<script setup lang="ts">
import { ref } from "vue";
import { usePostForgotPassword } from "@/services/Auth/usePostForgotPassword";
import { useResponsiveNavigation } from "@/shared/hooks/use-responsive-navigation";

/**
 * ForgotPasswordForm - Implementation of the forgot password logic and UI
 */

const email = ref("");
const { trigger, isLoading } = usePostForgotPassword();
const isSubmitted = ref(false);
const errorMessage = ref("");

const handleEmailSubmit = async (e: Event) => {
  e.preventDefault();
  if (!email.value) return;

  errorMessage.value = "";
  try {
    const res = await trigger({ email: email.value });
    if (res.success) {
      isSubmitted.value = true;
      // Navigate to OTP Screen using the responsive navigation system
      const { push } = useResponsiveNavigation();
      push("/code-otp", { email: email.value });
    } else {
      errorMessage.value =
        res.message || "Something went wrong. Please try again.";
    }
  } catch (err: any) {
    errorMessage.value =
      err?.response?.data?.message ||
      "Failed to send OTP. Please check your connection.";
  }
};
</script>

<template>
  <div class="rounded-3xl shadow-xl">
    <form
      v-if="!isSubmitted"
      @submit="handleEmailSubmit"
      class="space-y-6 text-center"
    >
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
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      </div>

      <!-- Header Text -->
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-gray-100">Lupa Password?</h2>
        <p class="text-sm text-gray-500">
          Masukkan email Anda untuk menerima kode OTP reset password.
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="p-3 bg-red-50 border border-red-100 rounded-xl"
      >
        <p class="text-xs text-red-600 font-medium italic">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Input Field -->
      <div class="space-y-1.5 text-left">
        <label
          class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1"
        >
          Email Address
        </label>
        <div class="relative group">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors"
          >
            <svg
              class="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none"
            required
            :disabled="isLoading"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex justify-center items-center py-4 px-4 border border-transparent cursor-pointer text-sm font-bold rounded-2xl text-white bg-slate-800 transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-70"
      >
        <span v-if="isLoading" class="flex items-center">
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
          Mohon Tunggu...
        </span>
        <span v-else>Kirim OTP</span>
      </button>
    </form>

    <!-- Success State -->
    <div v-else class="text-center py-8 space-y-6">
      <div
        class="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto"
      >
        <svg
          class="w-10 h-10 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-gray-900">OTP Terkirim!</h2>
        <p class="text-sm text-gray-500 px-4">
          Kami telah mengirimkan kode OTP ke <b>{{ email }}</b
          >. Silakan periksa kotak masuk atau folder spam Anda.
        </p>
      </div>
      <button
        @click="isSubmitted = false"
        class="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
      >
        Gunakan email lain
      </button>
    </div>
  </div>
</template>
