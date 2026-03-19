<script setup lang="ts">
import { ref, computed } from "vue";
import { usePostResetPassword } from "@/services/Auth/usePostResetPassword";
import {
  useResponsiveRouteParams,
  useResponsiveNavigation,
} from "@/shared/hooks/use-responsive-navigation";

/**
 * ResetPasswordForm - Handles new password submission
 */

const params = useResponsiveRouteParams<{ email: string; otp: string }>();
const email = computed(() => params.value.email || "");
const otp = computed(() => params.value.otp || "");

const { trigger: resetPassword, isLoading } = usePostResetPassword();
const { push } = useResponsiveNavigation();

const newPassword = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const isSuccess = ref(false);

const handleResetPassword = async (e: Event) => {
  e.preventDefault();
  if (!newPassword.value || isLoading.value) return;

  errorMessage.value = "";
  try {
    const res = await resetPassword({
      email: email.value,
      otp: otp.value,
      newPassword: newPassword.value,
    });

    if (res.success) {
      isSuccess.value = true;
      // You could also auto-navigate after a delay
      // setTimeout(() => {
      //   push("/"); // Back to Login
      // }, 3000);
    } else {
      errorMessage.value =
        res.message || "Failed to update password. Please try again.";
    }
  } catch (err: any) {
    errorMessage.value =
      err?.response?.data?.message ||
      "Something went wrong. Please check your connection.";
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="p-6 bg-white rounded-3xl shadow-xl">
    <form
      v-if="!isSuccess"
      @submit="handleResetPassword"
      class="space-y-6 text-center"
    >
      <!-- Icon -->
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          ></path>
        </svg>
      </div>

      <!-- Header -->
      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-gray-900">Password Baru</h2>
        <p class="text-sm text-gray-500">
          Buat password baru yang aman untuk akun Anda.
        </p>
      </div>

      <!-- Status Messages -->
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
          >New Password</label
        >
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </div>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="newPassword"
            placeholder="••••••••"
            class="block w-full pl-11 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-sm font-medium transition-all outline-none"
            required
            :disabled="isLoading"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
          >
            <!-- Eye / EyeOff Icon -->
            <svg
              v-if="showPassword"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
              ></path>
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || !newPassword"
        class="w-full flex justify-center items-center py-4 px-4 border border-transparent cursor-pointer text-sm font-bold rounded-2xl text-white bg-[#0F172A] hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95 disabled:opacity-50"
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
          Updating...
        </span>
        <span v-else>Update Password</span>
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
        <h2 class="text-2xl font-bold text-gray-900">Sukses!</h2>
        <p class="text-sm text-gray-500 px-4">
          Password Anda berhasil diperbarui. Silakan masuk kembali dengan
          password baru Anda.
        </p>
      </div>
      <button
        @click="push('/')"
        class="w-full py-4 bg-[#0F172A] text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
      >
        Kembali ke Login
      </button>
    </div>
  </div>
</template>
