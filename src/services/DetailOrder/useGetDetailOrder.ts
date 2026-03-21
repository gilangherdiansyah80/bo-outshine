import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface DetailOrderAddress {
  id: number;
  userId: number;
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface DetailOrderItem {
  id: number;
  orderId: number;
  productId: number;
  sizeId: number;
  price: string;
  quantity: number;
  productName: string;
  sizeName: string;
  originalPrice: string;
  productImage: string;
  discountedPrice: number;
  formattedOriginalPrice: string;
  formattedDiscountedPrice: string;
}

export interface DetailOrderPayment {
  id: number;
  orderId: number;
  amount: string;
  status: string;
  paymentMethodCodes: string;
  paymentMethodName: string;
  bank: string;
}

export interface DetailOrderBackend {
  id: number | string;
  userId: number;
  addressId: number;
  totalPrice: string;
  status: string;
  paymentType: string;
  paidAmount: string;
  remainingAmount: string;
  createdAt: string;
  updatedAt: string;
  formattedTotalPrice: string;
  formattedPaidAmount: string;
  formattedRemainingAmount: string;
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

  // Automatically adapt to response shape (whether wrapped in success/data or array or direct object)
  if (response.data.data) {
    return response.data.data;
  }
  
  return response.data as unknown as DetailOrderBackend;
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
