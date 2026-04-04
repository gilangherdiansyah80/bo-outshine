import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PutDiscountRequest {
  type: 'percent' | 'fixed';
  value: number;
  startDate?: string;
  endDate?: string;
}

export interface PutDiscountResponse {
  success: boolean;
  message: string;
  data: any;
}

export const usePutDiscount = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (id: number | string, payload: PutDiscountRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.put<PutDiscountResponse>(
        `/api/v1/discounts/${id}`,
        payload
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
