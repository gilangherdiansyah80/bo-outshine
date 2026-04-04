import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

export const useDeleteCategory = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.delete<DeleteCategoryResponse>(
        `/api/v1/categories/${id}`
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
