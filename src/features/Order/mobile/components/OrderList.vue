<script setup lang="ts">
import { computed } from "vue";
import { useGetOrders } from "@/services/Order/useGetOrders";
import OrderCard from "./OrderCard.vue";

/**
 * OrderList - Fetches and filters orders based on active status
 */

const props = defineProps<{
  activeTab: string;
}>();

const { orders, isLoading, isError, refetch } = useGetOrders();

const filteredOrders = computed(() => {
  if (!orders.value) return [];
  if (props.activeTab === "all") return orders.value;

  return orders.value.filter((order) => {
    const status = order.status.toLowerCase();
    if (props.activeTab === "pending")
      return ["unpaid", "pending"].includes(status);
    if (props.activeTab === "processing")
      return ["packed", "processing"].includes(status);
    if (props.activeTab === "shipping")
      return ["shipped", "shipping"].includes(status);
    if (props.activeTab === "completed") return status === "completed";
    if (props.activeTab === "cancelled") return status === "cancelled";
    return true;
  });
});
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div class="relative w-12 h-12">
        <div
          class="absolute inset-0 border-4 border-gray-100 rounded-full"
        ></div>
        <div
          class="absolute inset-0 border-4 border-t-slate-800 rounded-full animate-spin"
        ></div>
      </div>
      <span
        class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
        >Fetching Orders...</span
      >
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="px-6 py-10 text-center">
      <div
        class="bg-red-50 text-red-600 p-8 rounded-[2.5rem] border border-red-100/50 flex flex-col items-center"
      >
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          class="mb-4 opacity-50"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span class="font-bold text-sm mb-4 tracking-tight"
          >Failed to load orders</span
        >
        <button
          @click="refetch()"
          class="px-8 py-3 bg-red-600 text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-red-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredOrders.length === 0"
      class="flex flex-col items-center justify-center py-20 px-10 text-center gap-4"
    >
      <div
        class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-2"
      >
        <svg
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-slate-200"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="18" y1="8" x2="23" y2="13" />
          <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
      </div>
      <div>
        <h3 class="text-[16px] font-black text-slate-800 tracking-tight mb-1">
          Tidak Ada Pesanan
        </h3>
        <p
          class="text-[12px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest"
        >
          {{
            activeTab === "all"
              ? "Anda belum memiliki pesanan"
              : "Belum ada pesanan dengan status ini"
          }}
        </p>
      </div>
    </div>

    <!-- Order Grid -->
    <div v-else class="py-2 pb-24 flex flex-col gap-2 overflow-y-auto">
      <OrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
      />
    </div>
  </div>
</template>
