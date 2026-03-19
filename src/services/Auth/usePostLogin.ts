import { ref } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

// Flag to toggle between mock and real API
const USE_MOCK = false;

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * Hook for user login (Vue Composable)
 */
export const usePostLogin = () => {
  const data = ref<LoginResponse | null>(null);
  const error = ref<any>(null);
  const isLoading = ref(false);

  const trigger = async (arg: LoginRequest): Promise<LoginResponse> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (USE_MOCK) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockResponse: LoginResponse = {
          success: true,
          message: "Login successful",
          data: {
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            user: {
              id: "mock-user-id",
              email: arg.email,
              fullName: "Mock User",
            },
          },
        };
        data.value = mockResponse;
        return mockResponse;
      }

      // Real API call
      const response = await fetcherOSStore.post("/api/v1/auth/login", arg);
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
