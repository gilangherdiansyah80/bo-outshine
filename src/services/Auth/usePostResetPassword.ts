import { ref } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

// Flag to toggle between mock and real API
const USE_MOCK = false;

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * Hook for resetting password (Vue Composable)
 */
export const usePostResetPassword = () => {
  const data = ref<ResetPasswordResponse | null>(null);
  const error = ref<any>(null);
  const isLoading = ref(false);

  const trigger = async (arg: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse: ResetPasswordResponse = {
          success: true,
          message: "Password reset successfully",
        };
        data.value = mockResponse;
        return mockResponse;
      }

      const response = await fetcherOSStore.post("/api/v1/auth/reset-password", arg);
      data.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    trigger,
    data,
    isLoading,
    isError: error,
  };
};
