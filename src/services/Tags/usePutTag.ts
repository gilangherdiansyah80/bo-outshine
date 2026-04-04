import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PutTagResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePutTag = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (id: number | string, name: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.put<PutTagResponse>(
        `/api/v1/tags/${id}`,
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
