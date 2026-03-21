import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface SubOrderItemBackend {
  productName: string;
  sizeName: string;
  quantity: number;
  productImage: string;
  formattedPrice: string;
}

export interface OrderItemBackend {
  id: number;
  status: string;
  totalPrice: string;
  createdAt: string;
  userId: number;
  userEmail: string;
  userName: string;
  totalProducts: number;
  formattedTotalPrice: string;
  items: SubOrderItemBackend[];
}

export interface GetOrdersResponse {
  success: boolean;
  message: string;
  data: OrderItemBackend[];
}

const USE_MOCK = false;

export const mockOrders: OrderItemBackend[] = [
  {
    id: 15,
    status: "pending",
    totalPrice: "300000.00",
    createdAt: "2026-03-22T10:00:00.000Z",
    userId: 3,
    userEmail: "customer@example.com",
    userName: "John Doe",
    totalProducts: 1,
    formattedTotalPrice: "Rp 300.000",
    items: [
      {
        productName: "The Venoms",
        sizeName: "S, Standard",
        quantity: 1,
        productImage:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200",
        formattedPrice: "Rp 300.000",
      },
    ],
  },
];

export const getOrdersData = async (): Promise<OrderItemBackend[]> => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockOrders;
  }

  const response = await fetcherOSStore.get<GetOrdersResponse>(
    "/api/v1/orders/admin/all",
  );

  if (!response.data) {
    throw new Error("Failed to fetch orders");
  }

  // Flexibly handle the response shape
  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  throw new Error("Invalid response format from orders API");
};

export const useGetOrders = () => {
  const data = ref<OrderItemBackend[] | null>(null);
  const isLoading = ref(true);
  const error = ref<any>(null);

  const fetchOrders = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      data.value = await getOrdersData();
    } catch (e: any) {
      error.value = e;
      data.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchOrders();
  });

  return {
    orders: data,
    isLoading,
    isError: error,
    refetch: fetchOrders,
  };
};
