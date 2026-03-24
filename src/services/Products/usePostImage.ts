import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostImageResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostImage = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string, imageFile: File) => {
    isLoading.value = true;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetcherOSStore.post<PostImageResponse>(
        `/api/v1/products/${productId}/images`,
        formData,
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
