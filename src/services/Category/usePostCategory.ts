import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostCategoryResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostCategory = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (name: string, imageFile: File) => {
    isLoading.value = true;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', imageFile);

      const response = await fetcherOSStore.post<PostCategoryResponse>(
        '/api/v1/categories',
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
