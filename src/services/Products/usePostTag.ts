import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostTagRequest {
  tagId: string;
}

export interface PostTagResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostTag = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string, payload: PostTagRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.post<PostTagResponse>(
        `/api/v1/products/${productId}/tags`,
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
