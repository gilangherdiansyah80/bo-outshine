<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/core/lib/auth-adapter/userStore";
import { usePostLogout } from "@/services/Auth/usePostLogout";

const userStore = useUserStore();
const router = useRouter();
const isProfileOpen = ref(false);
const { trigger: logoutTrigger, isLoading: isLoggingOut } = usePostLogout();

const handleLogout = async () => {
  try {
    await logoutTrigger();
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    isProfileOpen.value = false;
    userStore.actions.clearUser();
    localStorage.removeItem("token");
    router.push("/login");
  }
};
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-[100] shadow-sm"
  >
    <!-- Logo Section -->
    <div class="-ml-3">
      <img src="/images/logo-nobg.png" alt="Outshine" class="w-32 h-full" />
    </div>

    <!-- Actions Section -->
    <div class="flex items-center gap-3 relative">
      <!-- User Avatar Toggle -->
      <button 
        @click="isProfileOpen = !isProfileOpen"
        class="flex items-center gap-x-2 active:scale-95 transition-all"
      >
        <div
          class="hidden sm:flex items-center justify-center text-blue-700 font-bold text-sm"
        >
          Hi, {{ userStore.dataUser?.name || "U" }}
        </div>

        <div
          class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200"
        >
          {{ userStore.dataUser?.name?.charAt(0).toUpperCase() || "U" }}
        </div>
      </button>

      <!-- Profile Card Dropdown -->
      <div
        v-if="isProfileOpen"
        class="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[110] animate-in fade-in zoom-in duration-200"
      >
        <div class="p-3 border-b border-slate-50 mb-1">
          <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Logged in as
          </div>
          <div class="text-sm font-black text-slate-800 truncate">
            {{ userStore.dataUser?.name || "User Account" }}
          </div>
          <div class="text-[10px] text-slate-400 font-medium truncate">
            {{ userStore.dataUser?.email || "outshine@management.com" }}
          </div>
        </div>
        
        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95 group disabled:opacity-50"
        >
          <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <svg 
              v-if="!isLoggingOut"
              class="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <div v-else class="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
          <span class="text-sm font-black">{{ isLoggingOut ? 'Logging out...' : 'Log out' }}</span>
        </button>
      </div>

      <!-- Backdrop for closing -->
      <div 
        v-if="isProfileOpen" 
        @click="isProfileOpen = false"
        class="fixed inset-0 z-[105]"
      ></div>

      <!-- Notification Icon -->
      <button
        class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-all active:scale-90"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
      </button>
    </div>
  </header>
</template>
