import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface TagItem {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTagsResponse {
  success: boolean;
  message: string;
  data: TagItem[];
}

/**
 * useGetTags - Hook for fetching tags from API
 */
export const useGetTags = () => {
  const data = ref<TagItem[]>([]);
  const isLoading = ref(true);
  const error = ref<any>(null);

  const fetchTags = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.get<GetTagsResponse>("/api/v1/tags");
      data.value = response.data.data;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchTags);

  return {
    data,
    isLoading,
    isError: error,
    refetch: fetchTags,
  };
};
