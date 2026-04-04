import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface DeleteSizeResponse {
  success: boolean;
  message: string;
}

export const useDeleteSize = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (id: number | string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.delete<DeleteSizeResponse>(
        `/api/v1/sizes/${id}`
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
