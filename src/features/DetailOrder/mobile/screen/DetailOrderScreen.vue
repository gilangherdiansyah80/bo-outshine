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
const { order, isLoading, isError, refetch } = useGetDetailOrder(orderIdParams);
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#f6f6f6] pb-24 relative">
    <DetailOrderHeader />

    <div v-if="isLoading" class="flex-1 flex items-center justify-center py-20">
      <div
        class="animate-spin w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="isError"
      class="flex-1 flex flex-col items-center justify-center p-10 text-center"
    >
      <div
        class="bg-red-50 text-red-600 p-8 rounded-[2.5rem] border border-red-100/50 flex flex-col items-center max-w-sm mx-auto"
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
          >Gagal memuat detail pesanan</span
        >
        <p
          class="text-[11px] font-bold text-red-400 uppercase tracking-widest leading-relaxed mb-6"
        >
          Terjadi kesalahan saat mengambil data dari server.
        </p>
        <button
          @click="refetch()"
          class="px-8 py-3 bg-red-600 text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-red-200"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <!-- Success State -->
    <template v-else-if="order">
      <div class="animate-fade-in flex flex-col w-full mx-auto max-w-lg">
        <!-- The blue box contains the ENUM status exactly matching the image -->
        <DetailOrderStatus :statusLabel="order.status" />
        <DetailOrderShipping :order="order" />

        <DetailOrderProducts :order="order" />
        <DetailOrderSummary :order="order" />
        <DetailOrderHelp :order="order" />
      </div>
      <!-- Actions are only shown if order exists and not in error state -->
      <DetailOrderActions :order="order" @success="refetch" />
    </template>

    <!-- Empty/Not Found State -->
    <div
      v-else
      class="flex-1 flex flex-col items-center justify-center p-10 text-center"
    >
      <div
        class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4"
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
      <h3 class="text-[16px] font-black text-slate-800 tracking-tight mb-1">
        Pesanan Tidak Ditemukan
      </h3>
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        Maaf, pesanan yang Anda cari tidak tersedia.
      </p>
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
