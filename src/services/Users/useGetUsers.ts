import { ref, onMounted } from "vue";
import { fetcherOSStore } from "@/core/lib/axios";

export interface UserBackend {
  id: string;
  email: string;
  isActive: boolean;
  roleName: string;
  fullName: string;
  avatarUrl: string;
  phone: string;
  createdAt: string;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: UserBackend[];
}

export const getUsersData = async (): Promise<UserBackend[]> => {
  const response = await fetcherOSStore.get<GetUsersResponse>(
    "/api/v1/users/customers",
  );

  if (!response.data) {
    throw new Error("Failed to fetch users");
  }

  if (response.data.data) {
    return response.data.data;
  }

  return response.data as unknown as UserBackend[];
};

export const useGetUsers = () => {
  const users = ref<UserBackend[]>([]);
  const isLoading = ref(true);
  const isError = ref(false);

  const fetchUsers = async () => {
    isLoading.value = true;
    isError.value = false;
    try {
      users.value = await getUsersData();
    } catch (e: any) {
      isError.value = true;
      users.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    fetchUsers();
  });

  return {
    users,
    isLoading,
    isError,
    refetch: fetchUsers,
  };
};
