import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostSizeResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostSize = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (name: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.post<PostSizeResponse>(
        '/api/v1/sizes',
        { name }
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
