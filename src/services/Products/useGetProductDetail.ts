import { ref } from 'vue';
import { fetcherOSStore } from '@/core/lib/axios';

// Full product detail interfaces matching the API response
export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface ProductSize {
  id: string;
  name: string;
  stock: number;
}

export interface ProductSpec {
  id: string;
  key: string;
  value: string;
}

export interface ProductTag {
  id: string;
  name: string;
}

export interface ProductSizeGuide {
  id: string;
  imageUrl: string;
  description: string;
}

export interface ProductGroupLink {
  id: string;
  link: string;
}

export interface ProductDiscount {
  type: string;
  value: number;
}

export interface ProductPricing {
  original: number;
  discounted: number;
  formattedOriginal: string;
  formattedDiscounted: string;
}

export interface ProductRating {
  averageRating: number;
  totalReview: number;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  isActive: boolean;
  isPo: boolean;
  poDpPercent: number;
  primaryImage: string;
  images: ProductImage[];
  tags: ProductTag[];
  sizes: ProductSize[];
  specs: ProductSpec[];
  sizeGuide: ProductSizeGuide | null;
  groupLink: ProductGroupLink | null;
  discount: ProductDiscount | null;
  pricing: ProductPricing;
  rating: ProductRating;
  createdAt: string;
}

export interface GetProductDetailResponse {
  success: boolean;
  message: string;
  data: ProductDetail;
}

export const useGetProductDetail = () => {
  const data = ref<ProductDetail | null>(null);
  const isLoading = ref(false);
  const error = ref<any>(null);

  const fetch = async (productId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetcherOSStore.get<GetProductDetailResponse>(
        `/api/v1/products/${productId}`,
      );
      data.value = response.data.data;
      return response.data.data;
    } catch (err: any) {
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    isLoading,
    isError: error,
    fetch,
  };
};
