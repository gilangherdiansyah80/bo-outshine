import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostDiscountRequest {
  type: 'percent' | 'fixed';
  value: number;
  startDate?: string;
  endDate?: string;
}

export interface PostDiscountResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostDiscount = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string, payload: PostDiscountRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.post<PostDiscountResponse>(
        `/api/v1/products/${productId}/discount`,
        payload
      );
      return response.data;
    } catch (err: any) {
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    mutate,
    isLoading,
    isError: error,
  };
};
