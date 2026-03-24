import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostGrupRequest {
  link: string;
}

export interface PostGrupResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostGrup = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string, payload: PostGrupRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.post<PostGrupResponse>(
        `/api/v1/products/${productId}/group-link`,
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
