import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface DeleteProductResponse {
  success: boolean;
  message: string;
  data: any;
}

export const useDeleteProduct = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.delete<DeleteProductResponse>(
        `/api/v1/products/${productId}`,
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
