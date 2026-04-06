<script setup lang="ts">
import type { DetailOrderBackend } from "@/services/DetailOrder/useGetDetailOrder";
import { usePutStatus, type OrderStatusUpdate } from "@/services/Order/usePutStatus";

const props = defineProps<{
  order?: DetailOrderBackend;
}>();

const emit = defineEmits(["success"]);

const { updateStatus, isLoading } = usePutStatus();

const handleUpdateStatus = async (status: OrderStatusUpdate) => {
  if (!props.order?.id || isLoading.value) return;

  try {
    await updateStatus(props.order.id, status);
    emit("success");
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
};
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe z-30 shadow-[0_-4px_20_px_-10px_rgba(0,0,0,0.1)]"
  >
    <div class="flex gap-3 max-w-lg mx-auto" v-if="order">
      <button
        v-if="order.status === 'pending'"
        @click="handleUpdateStatus('cancelled')"
        :disabled="isLoading"
        class="flex-1 py-3.5 px-4 bg-white border border-gray-200 text-slate-800 rounded-xl text-[13px] font-black tracking-tight active:bg-slate-50 transition-colors disabled:opacity-50"
      >
        {{ isLoading ? 'Loading...' : 'Tolak Pembayaran' }}
      </button>
      <button
        v-if="order.status === 'pending'"
        @click="handleUpdateStatus('processing')"
        :disabled="isLoading"
        class="flex-1 py-3.5 px-4 bg-[#F24E2B] border border-[#F24E2B] text-white rounded-xl text-[13px] font-black tracking-tight active:bg-[#d94424] transition-colors shadow-lg shadow-orange-600/20 disabled:opacity-50"
      >
        {{ isLoading ? 'Loading...' : 'Konfirmasi Pembayaran' }}
      </button>
      <button
        v-else
        @click="handleUpdateStatus('shipping')"
        :disabled="isLoading"
        class="flex-1 py-3.5 px-4 bg-white border border-gray-200 text-slate-800 rounded-xl text-[13px] font-black tracking-tight active:bg-slate-50 transition-colors disabled:opacity-50"
      >
        {{ isLoading ? 'Loading...' : 'Pesanan Sudah Dikirim' }}
      </button>
    </div>
  </div>
</template>
