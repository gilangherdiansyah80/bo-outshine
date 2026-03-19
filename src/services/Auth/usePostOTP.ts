import { ref } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

// Flag to toggle between mock and real API
const USE_MOCK = false;

export interface OTPRequest {
  email: string;
  otpCode: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * Hook for OTP verification (Vue Composable)
 */
export const usePostOTP = () => {
  const data = ref<OTPResponse | null>(null);
  const error = ref<any>(null);
  const isLoading = ref(false);

  const trigger = async (arg: OTPRequest): Promise<OTPResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse: OTPResponse = {
          success: true,
          message: "OTP verified successfully",
          data: {
            email: arg.email,
            status: "verified",
          },
        };
        data.value = mockResponse;
        return mockResponse;
      }

      const response = await fetcherOSStore.post("/api/v1/auth/verify-otp", arg);
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
