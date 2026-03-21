<script setup lang="ts">
import type { UserBackend } from "@/services/Users/useGetUsers";

defineProps<{
  user: UserBackend;
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
    class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all"
  >
    <!-- Avatar -->
    <div
      class="w-12 h-12 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200"
    >
      <img
        v-if="user.avatarUrl"
        :src="user.avatarUrl"
        :alt="user.fullName"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-white text-[16px] font-black"
      >
        {{ user.fullName?.charAt(0)?.toUpperCase() || "?" }}
      </div>
    </div>

    <!-- User Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3
          class="text-[14px] font-black text-slate-900 truncate tracking-tight"
        >
          {{ user.fullName || "No Name" }}
        </h3>
        <span
          :class="[
            'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0',
            user.isActive
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-red-50 text-red-500 border border-red-100',
          ]"
        >
          {{ user.isActive ? "Aktif" : "Nonaktif" }}
        </span>
      </div>
      <p class="text-[12px] font-bold text-slate-400 truncate mt-0.5">
        {{ user.email }}
      </p>
      <div class="flex items-center gap-3 mt-1.5">
        <span
          v-if="user.phone"
          class="text-[11px] font-bold text-slate-400 flex items-center gap-1"
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            />
          </svg>
          {{ user.phone }}
        </span>
        <span
          class="text-[11px] font-bold text-slate-300 flex items-center gap-1"
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {{ formatDate(user.createdAt) }}
        </span>
      </div>
    </div>

    <!-- Chevron -->
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      class="text-slate-300 flex-shrink-0"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  </div>
</template>
