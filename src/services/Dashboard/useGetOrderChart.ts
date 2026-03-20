import { ref, onMounted, watch } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

/**
 * Interface representing a single data point in the order chart.
 */
export interface OrderChartItem {
  period: string;
  totalRevenue: number;
  orderCount: number;
}

/**
 * Interface for optional filtering parameters for the order chart.
 */
export interface OrderChartParams {
  status?: string;
  month?: string | number;
  year?: string | number;
}

/**
 * Interface representing the API response for order chart statistics.
 */
interface OrderChartResponse {
  success: boolean;
  message: string;
  data: OrderChartItem[];
}

/**
 * Fetches order chart data from the API with optional filtering.
 * 
 * @param params Optional filter parameters (status, month, year).
 * @returns A promise that resolves to an array of chart data items.
 * @throws An error if the API request fails or returns an unsuccessful response.
 */
export const getOrderChartData = async (
  params: OrderChartParams = {},
): Promise<OrderChartItem[]> => {
  const response = await fetcherOSStore.get<OrderChartResponse>(
    "/api/v1/dashboard/order-charts",
    { params },
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to fetch order chart statistics",
    );
  }

  return response.data.data;
};

/**
 * Vue composition hook for managing order chart data fetching and filtering state.
 * 
 * @param initialParams Initial filter parameters.
 * @returns An object containing reactive chart data, loading state, error state, filters, and a refetch function.
 */
export const useGetOrderChart = (initialParams: OrderChartParams = {}) => {
  const chartData = ref<OrderChartItem[]>([]);
  const isLoading = ref(true);
  const error = ref<any>(null);
  const params = ref<OrderChartParams>(initialParams);

  const fetchChartData = async () => {
    isLoading.value = true;
    try {
      chartData.value = await getOrderChartData(params.value);
    } catch (e) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchChartData);

  // Re-fetch when params change
  watch(params, fetchChartData, { deep: true });

  return {
    chartData,
    isLoading,
    isError: error,
    params,
    refetch: fetchChartData,
  };
};
