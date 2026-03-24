import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostSpecRequest {
  key: string;
  value: string;
}

export interface PostSpecResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostSpesification = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string, payload: PostSpecRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.post<PostSpecResponse>(
        `/api/v1/products/${productId}/specs`,
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
