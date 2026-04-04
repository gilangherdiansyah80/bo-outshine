import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PutSizeRequest {
  stock: number;
}

export interface PutSizeResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePutSize = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string, sizeId: string, payload: PutSizeRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.put<PutSizeResponse>(
        `/api/v1/products/${productId}/sizes/${sizeId}`,
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
