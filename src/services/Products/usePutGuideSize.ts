import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PutGuideSizeResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePutGuideSize = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (sizeGuideId: string, imageFile: File, description: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('description', description);

      const response = await fetcherOSStore.put<PutGuideSizeResponse>(
        `/api/v1/size-guide/${sizeGuideId}`,
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
