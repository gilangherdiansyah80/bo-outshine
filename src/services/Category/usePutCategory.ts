import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PutCategoryResponse {
  success: boolean;
  message: string;
  data: any;
}

/**
 * usePutCategory - Hook for updating category by ID
 * @param id Category ID
 * @param name Category name
 * @param imageFile Optional image file
 */
export const usePutCategory = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (id: string, name: string, imageFile?: File | null) => {
    isLoading.value = true;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetcherOSStore.put<PutCategoryResponse>(
        `/api/v1/categories/${id}`,
        formData
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
