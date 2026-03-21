import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface ReviewBackend {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  productName: string;
  productImage: string;
  userEmail: string;
  userName: string;
  userAvatar: string;
  images: string[];
}

export interface GetReviewsResponse {
  success: boolean;
  message: string;
  data: ReviewBackend[];
}

export const getReviewsData = async (): Promise<ReviewBackend[]> => {
  const response = await fetcherOSStore.get<GetReviewsResponse>(
    "/api/v1/reviews/all",
  );

  if (!response.data) {
    throw new Error("Failed to fetch reviews");
  }

  if (response.data.data) {
    return response.data.data;
  }

  return response.data as unknown as ReviewBackend[];
};

export const useGetReviews = () => {
  const reviews = ref<ReviewBackend[]>([]);
  const isLoading = ref(true);
  const isError = ref(false);

  const fetchReviews = async () => {
    isLoading.value = true;
    isError.value = false;
    try {
      reviews.value = await getReviewsData();
    } catch (e: any) {
      isError.value = true;
      reviews.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchReviews();
  });

  return {
    reviews,
    isLoading,
    isError,
    refetch: fetchReviews,
  };
};
