<script setup lang="ts">
import { ref, computed } from "vue";
import { useGetReviews } from "@/services/review/useGetReview";
import ReviewCard from "./ReviewCard.vue";

const { reviews, isLoading, isError, refetch } = useGetReviews();

const searchQuery = ref("");
const filterRating = ref<number | null>(null);

const filteredReviews = computed(() => {
  let result = reviews.value;

  // Filter by rating
  if (filterRating.value !== null) {
    result = result.filter((r) => r.rating === filterRating.value);
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (r) =>
        r.userName?.toLowerCase().includes(q) ||
        r.productName?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q),
    );
  }

  return result;
});

const averageRating = computed(() => {
  if (!reviews.value.length) return 0;
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.value.length).toFixed(1);
});

const setFilter = (rating: number | null) => {
  filterRating.value = filterRating.value === rating ? null : rating;
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <section class="flex flex-col gap-y-4 bg-white p-4">
      <!-- Search Bar -->
      <div class="px-1">
        <div
          class="relative rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari review..."
            class="w-full pl-12 pr-4 py-3.5 text-[13px] font-bold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
          />
        </div>
      </div>

      <!-- Rating Filter + Stats -->
      <div class="px-1 flex items-center gap-2 flex-wrap">
        <button
          v-for="star in [5, 4, 3, 2, 1]"
          :key="star"
          @click="setFilter(star)"
          :class="[
            'flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all active:scale-95',
            filterRating === star
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-white border-gray-100 text-slate-500',
          ]"
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="#FBBF24"
            stroke="none"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          {{ star }}
        </button>
        <div v-if="reviews.length" class="ml-auto flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="#FBBF24"
            stroke="none"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          <span class="text-[13px] font-black text-slate-800">{{
            averageRating
          }}</span>
          <span class="text-[11px] font-bold text-slate-400"
            >({{ reviews.length }})</span
          >
        </div>

        <p class="text-[12px] font-bold text-slate-400 px-1">
          {{ filteredReviews.length }} review ditemukan
        </p>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div
        class="animate-spin w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="isError"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div
        class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-red-400"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <p class="text-[14px] font-bold text-slate-500 mb-3">
        Gagal memuat data review
      </p>
      <button
        @click="refetch"
        class="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[12px] font-bold active:scale-95 transition-all"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredReviews.length === 0"
      class="flex flex-col items-center justify-center py-16 text-center"
    >
      <div
        class="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-slate-300"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      </div>
      <p class="text-[14px] font-bold text-slate-400">
        {{
          searchQuery || filterRating
            ? "Review tidak ditemukan"
            : "Belum ada review"
        }}
      </p>
    </div>

    <!-- Review List -->
    <div v-else class="flex flex-col gap-2">
      <ReviewCard
        v-for="review in filteredReviews"
        :key="review.id"
        :review="review"
      />
    </div>
  </div>
</template>
