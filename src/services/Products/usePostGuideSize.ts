import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostGuideSizeResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostGuideSize = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (productId: string, imageFile: File, description: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('description', description);

      const response = await fetcherOSStore.post<PostGuideSizeResponse>(
        `/api/v1/products/${productId}/size-guide`,
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
