import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface CategoryItem {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoryResponse {
  success: boolean;
  message: string;
  data: CategoryItem[];
}

export const useGetCategory = () => {
  const data = ref<CategoryItem[]>([]);
  const isLoading = ref(true);
  const error = ref<any>(null);

  const fetchCategories = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.get<GetCategoryResponse>("/api/v1/categories");
      data.value = response.data.data;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchCategories);

  return {
    data,
    isLoading,
    isError: error,
    mutate: fetchCategories,
  };
};
