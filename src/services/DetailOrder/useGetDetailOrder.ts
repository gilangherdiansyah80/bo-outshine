import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";
import { formatIDR } from "@/core/lib/utils";

export interface DetailOrderAddress {
  id: number | string;
  userId?: number | string;
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface DetailOrderItem {
  id: number | string;
  orderId: number | string;
  productId: number | string;
  sizeId?: number | string;
  price: string | number;
  quantity: number;
  productName: string;
  sizeName?: string;
  originalPrice?: string | number;
  productImage: string;
  discountedPrice?: number;
  formattedOriginalPrice?: string;
  formattedDiscountedPrice?: string;
}

export interface DetailOrderPayment {
  id: number | string;
  orderId: number | string;
  amount: string | number;
  status: string;
  paymentMethodCodes?: string;
  paymentMethodName?: string;
  bank?: string;
  proofUrl?: string;
  proofId?: string; // New ID from new response
}

export interface DetailOrderBackend {
  id: string; // Changed to string based on ord_123456
  userId: number;
  addressId: number;
  totalPrice: number | string; // Changed to number based on example
  status: string;
  paymentType?: string;
  paidAmount?: string | number;
  remainingAmount?: string | number;
  createdAt?: string;
  updatedAt?: string;
  paymentProof?: string;
  paymentProofId?: string; // New ID for verification
  formattedTotalPrice?: string;
  formattedPaidAmount?: string;
  formattedRemainingAmount?: string;
  address?: DetailOrderAddress;
  items: DetailOrderItem[];
  latestPayment?: DetailOrderPayment;
}

export interface GetDetailOrderResponse {
  success: boolean;
  message: string;
  data: DetailOrderBackend;
}

export const getDetailOrderData = async (orderId: string | number): Promise<DetailOrderBackend> => {
  const response = await fetcherOSStore.get<GetDetailOrderResponse>(`/api/v1/orders/admin/${orderId}`);

  if (!response.data) {
    throw new Error("Failed to fetch order detail");
  }

  const rawData = response.data.data;
  
  // Transform and format numeric fields for UI compatibility
  const order: DetailOrderBackend = {
    ...rawData,
    formattedTotalPrice: rawData.formattedTotalPrice || formatIDR(Number(rawData.totalPrice || 0)),
    formattedPaidAmount: rawData.formattedPaidAmount || formatIDR(Number(rawData.paidAmount || 0)),
    formattedRemainingAmount: rawData.formattedRemainingAmount || formatIDR(Number(rawData.remainingAmount || 0)),
    items: (rawData.items || []).map((item: DetailOrderItem) => ({
      ...item,
      formattedOriginalPrice: item.formattedOriginalPrice || formatIDR(Number(item.price || item.originalPrice || 0)),
      formattedDiscountedPrice: item.formattedDiscountedPrice || formatIDR(Number(item.discountedPrice || 0)),
    })),
  };

  return order;
};

export const useGetDetailOrder = (orderId: string | number) => {
  const data = ref<DetailOrderBackend | null>(null);
  const isLoading = ref(true);
  const error = ref<any>(null);

  const fetchDetail = async () => {
    if (!orderId) return;
    isLoading.value = true;
    error.value = null;
    try {
      data.value = await getDetailOrderData(orderId);
    } catch (e: any) {
      error.value = e;
      data.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchDetail();
  });

  return {
    order: data,
    isLoading,
    isError: error,
    refetch: fetchDetail,
  };
};
