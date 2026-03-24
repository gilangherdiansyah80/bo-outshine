import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

export interface PostProductRequest {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  isPo: boolean;
  poDpPercent: number;
}

export interface PostProductResponse {
  success: boolean;
  message: string;
  data: any; // Or define specific product response interface if needed
}

export const usePostProduct = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const mutate = async (payload: PostProductRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.post<PostProductResponse>('/api/v1/products', payload);
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
