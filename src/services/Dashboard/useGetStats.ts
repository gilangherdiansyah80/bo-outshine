import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

/**
 * Interface representing a single dashboard statistic item.
 */
export interface DashboardStat {
  label: string;
  count: number;
}

/**
 * Interface representing the API response for dashboard statistics.
 */
interface StatsResponse {
  success: boolean;
  message: string;
  data: DashboardStat[];
}

/**
 * Fetches dashboard statistics from the API.
 * 
 * @returns A promise that resolves to an array of dashboard statistics.
 * @throws An error if the API request fails or returns an unsuccessful response.
 */
export const getStatsData = async (): Promise<DashboardStat[]> => {
  const response =
    await fetcherOSStore.get<StatsResponse>("/api/v1/dashboard/stats");

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to fetch dashboard statistics",
    );
  }

  return response.data.data;
};

/**
 * Vue composition hook for managing dashboard statistics data fetching and state.
 * 
 * @returns An object containing reactive stats data, loading state, error state, and a refetch function.
 */
export const useGetStats = () => {
  const stats = ref<DashboardStat[]>([]);
  const isLoading = ref(true);
  const error = ref<any>(null);

  const fetchStats = async () => {
    isLoading.value = true;
    try {
      stats.value = await getStatsData();
    } catch (e) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchStats);

  return {
    stats,
    isLoading,
    isError: error,
    refetch: fetchStats,
  };
};
