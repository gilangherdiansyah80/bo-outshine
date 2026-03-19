import { ref } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";
import { useTokenStore } from "@/core/lib/auth-adapter/tokenStore";

// Flag to toggle between mock and real API
const USE_MOCK = false;

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * Hook for user logout (Vue Composable)
 */
export const usePostLogout = () => {
  const data = ref<LogoutResponse | null>(null);
  const error = ref<any>(null);
  const isLoading = ref(false);
  const tokenStore = useTokenStore();

  const trigger = async (): Promise<LogoutResponse> => {
    isLoading.value = true;
    error.value = null;

    const arg: LogoutRequest = {
      refreshToken: tokenStore.refreshToken,
    };

    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResponse: LogoutResponse = {
          success: true,
          message: "Logout successful",
          data: null,
        };
        data.value = mockResponse;
        return mockResponse;
      }

      const response = await fetcherOSStore.post("/api/v1/auth/logout", arg);
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
