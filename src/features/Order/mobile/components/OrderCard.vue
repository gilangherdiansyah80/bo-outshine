<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { OrderItemBackend } from "@/services/Order/useGetOrders";

/**
 * OrderCard - Displays summary information for a single order
 */

const router = useRouter();

const props = defineProps<{
  order: OrderItemBackend;
}>();

// Get the first item to display in the card summary safely
const firstItem = computed(() => props.order?.items?.[0] || null);

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "unpaid":
    case "pending":
      return "Belum Bayar";
    case "packed":
    case "processing":
      return "Dikemas";
    case "shipped":
      return "Dikirim";
    case "completed":
      return "Selesai";
    default:
      return status;
  }
};
</script>

<template>
  <div
    @click="router.push(`/outshine/order/${order.id}`)"
    class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all cursor-pointer"
  >
    <!-- Card Header: Store Info & Status -->
    <div class="flex items-center justify-between pb-3 border-b border-gray-50">
      <div class="flex items-center gap-2">
        <!-- Store Badge -->
        <div
          class="bg-slate-900 border border-slate-700/50 rounded px-1.5 py-0.5 flex items-center justify-center"
        >
          <span class="text-[8px] font-black italic text-white leading-none"
            >Star+</span
          >
        </div>
        <h4
          class="text-[14px] font-black text-slate-800 tracking-tight flex items-center gap-1"
        >
          OUTSHINE Store
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            class="text-slate-400"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </h4>
      </div>
      <span class="text-[12px] font-bold text-slate-700">{{
        getStatusLabel(order.status)
      }}</span>
    </div>

    <!-- Card Content: Product Info -->
    <div v-if="firstItem" class="flex gap-4 py-1">
      <div
        class="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0"
      >
        <img
          :src="firstItem.productImage"
          :alt="firstItem.productName"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div class="flex justify-between items-start">
            <h3
              class="text-[15px] font-black text-[#0F172A] truncate tracking-tight"
            >
              {{ firstItem.productName }}
            </h3>
            <span class="text-[12px] font-bold text-slate-400 ml-2 uppercase"
              >x{{ firstItem.quantity }}</span
            >
          </div>
          <p class="text-[12px] font-bold text-slate-400 mt-1 uppercase">
            {{ firstItem.sizeName }}
          </p>
        </div>
        <div class="text-[14px] font-black text-slate-800">
          {{ firstItem.formattedPrice }}
        </div>
      </div>
    </div>

    <!-- Card Footer: Total & Actions -->
    <div class="pt-3 border-t border-gray-50 mt-auto">
      <div class="flex justify-between items-center">
        <span class="text-[12px] font-bold text-[#ea580c] cursor-pointer">Lihat Detail ></span>
        <p class="text-[13px] font-bold text-slate-400">
          Total {{ order.totalProducts }} produk:
          <span class="text-[15px] font-black text-slate-900 ml-1">{{
            order.formattedTotalPrice
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
