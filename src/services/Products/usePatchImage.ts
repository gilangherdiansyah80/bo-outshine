import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PatchImageResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePatchImage = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (imageId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.patch<PatchImageResponse>(
        `/api/v1/products/images/${imageId}/primary`,
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
