import { ref } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

// Flag to toggle between mock and real API
const USE_MOCK = false;

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * Hook for forgot password (Vue Composable)
 */
export const usePostForgotPassword = () => {
  const data = ref<ForgotPasswordResponse | null>(null);
  const error = ref<any>(null);
  const isLoading = ref(false);

  const trigger = async (arg: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse: ForgotPasswordResponse = {
          success: true,
          message: "Reset OTP sent to your email",
        };
        data.value = mockResponse;
        return mockResponse;
      }

      const response = await fetcherOSStore.post("/api/v1/auth/forgot-password", arg);
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
