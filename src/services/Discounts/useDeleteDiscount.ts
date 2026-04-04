import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface DeleteDiscountResponse {
  success: boolean;
  message: string;
}

export const useDeleteDiscount = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (id: number | string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.delete<DeleteDiscountResponse>(
        `/api/v1/discounts/${id}`
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
