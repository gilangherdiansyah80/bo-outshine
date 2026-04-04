import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface HeroItem {
  id: number;
  badge_text: string;
  title: string;
  button_text: string;
  background_image: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetHeroResponse {
  success: boolean;
  message: string;
  data: HeroItem[];
}

/**
 * useGetHero - Hook for fetching hero sections from API
 */
export const useGetHero = () => {
  const data = ref<HeroItem[]>([]);
  const isLoading = ref(true);
  const error = ref<any>(null);

  const fetchHero = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.get<GetHeroResponse>("/api/v1/hero-sections");
      data.value = response.data.data;
    } catch (err) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchHero);

  return {
    data,
    isLoading,
    isError: error,
    refetch: fetchHero,
  };
};
