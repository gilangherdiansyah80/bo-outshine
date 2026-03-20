import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface SizeItem {
  id: number;
  name: string;
}

export interface GetSizesResponse {
  success: boolean;
  message: string;
  data: SizeItem[];
}

/**
 * useGetSizes - Hook for fetching sizes from API
 */
export const useGetSizes = () => {
  const data = ref<SizeItem[]>([]);
  const isLoading = ref(true);
  const error = ref<any>(null);

  const fetchSizes = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.get<GetSizesResponse>("/api/v1/sizes");
      data.value = response.data.data;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchSizes);

  return {
    data,
    isLoading,
    isError: error,
    refetch: fetchSizes,
  };
};
