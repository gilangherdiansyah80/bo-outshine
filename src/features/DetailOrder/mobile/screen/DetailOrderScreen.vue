<script setup lang="ts">
import { useRoute } from "vue-router";
import { useGetDetailOrder } from "@/services/DetailOrder/useGetDetailOrder";

import DetailOrderHeader from "../components/DetailOrderHeader.vue";
import DetailOrderStatus from "../components/DetailOrderStatus.vue";
import DetailOrderShipping from "../components/DetailOrderShipping.vue";
import DetailOrderProducts from "../components/DetailOrderProducts.vue";
import DetailOrderSummary from "../components/DetailOrderSummary.vue";
import DetailOrderHelp from "../components/DetailOrderHelp.vue";
import DetailOrderActions from "../components/DetailOrderActions.vue";

const route = useRoute();

// Extract ID from route parameters.
const orderIdParams = route.params.id as string;

// Fetch exactly this order using the new endpoint
const { order, isLoading, isError } = useGetDetailOrder(orderIdParams);


</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#f6f6f6] pb-24 relative">
    <DetailOrderHeader />

    <div
      v-if="isLoading"
      class="flex-1 flex items-center justify-center py-20"
    >
      <div
        class="animate-spin w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full"
      ></div>
    </div>

    <div
      v-else-if="isError"
      class="flex-1 flex flex-col items-center justify-center p-10 text-center"
    >
      <span class="text-red-500 font-bold"
        >Failed to load order details!</span
      >
    </div>

    <div
      v-else-if="order"
      class="animate-fade-in flex flex-col w-full mx-auto max-w-lg"
    >
      <!-- The blue box contains the ENUM status exactly matching the image -->
      <DetailOrderStatus :statusLabel="order.status" />
      <DetailOrderShipping :order="order" />
      <DetailOrderProducts :order="order" />
      <DetailOrderSummary :order="order" />
      <DetailOrderHelp :order="order" />
    </div>

    <DetailOrderActions v-if="order" :order="order" />

    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center p-10 text-center"
    >
      <span class="text-slate-500 font-bold">Order not found</span>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.pb-safe {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
</style>
