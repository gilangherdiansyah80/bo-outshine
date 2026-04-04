import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PutHeroResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePutHero = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (id: number | string, formData: FormData) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.put<PutHeroResponse>(
        `/api/v1/hero-sections/${id}`,
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
