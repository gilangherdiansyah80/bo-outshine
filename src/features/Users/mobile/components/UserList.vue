<script setup lang="ts">
import { ref, computed } from "vue";
import { useGetUsers } from "@/services/Users/useGetUsers";
import UserCard from "./UserCard.vue";

const { users, isLoading, isError, refetch } = useGetUsers();

const searchQuery = ref("");

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q),
  );
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Search Bar -->
    <div class="bg-white px-5 py-3 flex flex-col gap-y-2">
      <div
        class="relative bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
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
          placeholder="Cari user..."
          class="w-full pl-12 pr-4 py-3.5 text-[13px] font-bold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
        />
      </div>
      <p class="text-[12px] font-bold text-slate-400 px-1">
        {{ filteredUsers.length }} user ditemukan
      </p>
    </div>

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
        Gagal memuat data user
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
      v-else-if="filteredUsers.length === 0"
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <p class="text-[14px] font-bold text-slate-400">
        {{ searchQuery ? "User tidak ditemukan" : "Belum ada user" }}
      </p>
    </div>

    <!-- User List -->
    <div v-else class="flex flex-col gap-2">
      <UserCard v-for="user in filteredUsers" :key="user.id" :user="user" />
    </div>
  </div>
</template>
