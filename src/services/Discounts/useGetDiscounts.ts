import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface DiscountItem {
  id: number;
  productId: string;
  productName: string;
  type: "percent" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface GetDiscountsResponse {
  success: boolean;
  message?: string;
  data: DiscountItem[];
}

/**
 * useGetDiscounts - Hook for fetching discounts from API
 */
export const useGetDiscounts = () => {
  const data = ref<DiscountItem[]>([]);
  const isLoading = ref(true);
  const error = ref<any>(null);

  const fetchDiscounts = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.get<GetDiscountsResponse>("/api/v1/discounts");
      data.value = response.data.data;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchDiscounts);

  return {
    data,
    isLoading,
    isError: error,
    refetch: fetchDiscounts,
  };
};
