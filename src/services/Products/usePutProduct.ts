import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PutProductRequest {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isPo: boolean;
  poDpPercent: number;
}

export interface PutProductResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePutProduct = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string, payload: PutProductRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.put<PutProductResponse>(
        `/api/v1/products/${productId}`,
        payload,
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
