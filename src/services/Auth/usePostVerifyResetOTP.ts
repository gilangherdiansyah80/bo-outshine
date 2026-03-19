import { ref } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

// Flag to toggle between mock and real API
const USE_MOCK = false;

export interface VerifyResetOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyResetOTPResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * Hook for verifying reset password OTP (Vue Composable)
 */
export const usePostVerifyResetOTP = () => {
  const data = ref<VerifyResetOTPResponse | null>(null);
  const error = ref<any>(null);
  const isLoading = ref(false);

  const trigger = async (arg: VerifyResetOTPRequest): Promise<VerifyResetOTPResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse: VerifyResetOTPResponse = {
          success: true,
          message: "OTP verified correctly",
        };
        data.value = mockResponse;
        return mockResponse;
      }

      const response = await fetcherOSStore.post("/api/v1/auth/verify-reset-otp", arg);
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
