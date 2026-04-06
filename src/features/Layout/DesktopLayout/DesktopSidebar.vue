<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const menuItems = [
  {
    name: "Dashboard",
    path: "/outshine/dashboard",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  },
  {
    name: "Management",
    path: "/outshine/management",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>`,
  },
  {
    name: "Orders",
    path: "/outshine/order",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  },
  {
    name: "Reviews",
    path: "/outshine/review",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    name: "Users",
    path: "/outshine/users",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
];

const currentPath = computed(() => route.path);

const navigateTo = (path: string) => {
  router.push(path);
};

const logout = () => {
  // Add logout logic here
  router.push("/outshine/login");
};
</script>

<template>
  <aside
    class="w-[260px] h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 sticky top-0"
  >
    <!-- Logo Section -->
    <div class="h-16 flex items-center px-6 gap-3 border-b border-slate-800/50">
      <div
        class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 group cursor-pointer"
        @click="navigateTo('/outshine/dashboard')"
      >
        <span class="text-white font-black italic scale-110 group-hover:scale-125 transition-transform">O</span>
      </div>
      <div class="flex flex-col">
          <span class="font-black text-lg tracking-tight text-white leading-none">OUTSHINE</span>
          <span class="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">Admin Panel</span>
      </div>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
      <div
        v-for="item in menuItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
        :class="[
          currentPath.startsWith(item.path)
            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
            : 'hover:bg-slate-800 hover:text-white',
        ]"
      >
        <div 
          class="w-5 h-5 flex items-center justify-center transition-colors"
          :class="[currentPath.startsWith(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-blue-400']"
          v-html="item.icon"
        ></div>
        <span class="text-sm font-semibold tracking-wide">{{ item.name }}</span>
        
        <!-- Active Indicator -->
        <div 
            v-if="currentPath.startsWith(item.path)"
            class="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"
        ></div>
      </div>
    </nav>

    <!-- Bottom Actions / User Section -->
    <div class="p-4 border-t border-slate-800/50 bg-slate-950/20">
      <div class="flex items-center gap-3 p-2 mb-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-slate-800 shadow-sm transition-transform hover:scale-105 cursor-pointer">
          A
        </div>
        <div class="flex flex-col truncate">
          <span class="text-sm font-bold text-white leading-none truncate">Admin User</span>
          <span class="text-xs text-slate-500 mt-1 truncate">Super Admin</span>
        </div>
      </div>

      <button
        @click="logout"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        <span class="text-sm font-semibold">Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
