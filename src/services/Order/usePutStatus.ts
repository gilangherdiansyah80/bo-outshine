import { ref } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export type OrderStatusUpdate = "processing" | "cancelled" | "shipping";

export interface PutStatusBody {
  status: OrderStatusUpdate;
}

export interface PutStatusResponse {
  success: boolean;
  message: string;
}

/**
 * Updates the order status using the unified administrative endpoint.
 * 
 * @param id The Order ID.
 * @param status The new status (processing, cancelled, or shipping).
 * @returns A promise resolving to the API response.
 */
export const putOrderStatus = async (
  id: string | number,
  status: OrderStatusUpdate
): Promise<PutStatusResponse> => {
  const response = await fetcherOSStore.put<PutStatusResponse>(
    `/api/v1/orders/admin/${id}/status`,
    { status }
  );
  return response.data;
};

/**
 * Hook for managing order status updates.
 */
export const usePutStatus = () => {
  const isLoading = ref(false);
  const error = ref<any>(null);

  const updateStatus = async (id: string | number, status: OrderStatusUpdate) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await putOrderStatus(id, status);
      return response;
    } catch (e: any) {
      error.value = e;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    updateStatus,
    isLoading,
    isError: error,
  };
};
