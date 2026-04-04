import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostHeroResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePostHero = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (formData: FormData) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Don't set Content-Type header manually for FormData, axios handles it.
      const response = await fetcherOSStore.post<PostHeroResponse>(
        '/api/v1/hero-sections',
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
