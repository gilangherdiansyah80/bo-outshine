<script setup lang="ts">
import type { ReviewBackend } from "@/services/review/useGetReview";

defineProps<{
  review: ReviewBackend;
}>();

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>

<template>
  <div
    class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4"
  >
    <!-- Reviewer Info -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200"
      >
        <img
          v-if="review.userAvatar"
          :src="review.userAvatar"
          :alt="review.userName"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-white text-[14px] font-black"
        >
          {{ review.userName?.charAt(0)?.toUpperCase() || "?" }}
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h4
          class="text-[13px] font-black text-slate-900 truncate tracking-tight"
        >
          {{ review.userName || "Anonymous" }}
        </h4>
        <p class="text-[11px] font-bold text-slate-400">
          {{ formatDate(review.createdAt) }}
        </p>
      </div>
      <!-- Rating Stars -->
      <div class="flex items-center gap-0.5 flex-shrink-0">
        <svg
          v-for="i in 5"
          :key="i"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          :fill="i <= review.rating ? '#FBBF24' : '#E2E8F0'"
          stroke="none"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      </div>
    </div>

    <!-- Comment -->
    <p class="text-[13px] font-bold text-slate-600 leading-relaxed">
      {{ review.comment }}
    </p>

    <!-- Review Images -->
    <div
      v-if="review.images && review.images.length > 0"
      class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
    >
      <div
        v-for="(img, idx) in review.images"
        :key="idx"
        class="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100"
      >
        <img
          :src="img"
          :alt="`Review image ${idx + 1}`"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex items-center gap-3 pt-3 border-t border-gray-50">
      <div
        class="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100"
      >
        <img
          v-if="review.productImage"
          :src="review.productImage"
          :alt="review.productName"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[12px] font-bold text-slate-400">Produk</p>
        <h5
          class="text-[13px] font-black text-slate-800 truncate tracking-tight"
        >
          {{ review.productName }}
        </h5>
      </div>
    </div>
  </div>
</template>
