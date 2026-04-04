<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useGetHero } from "@/services/Hero/useGetHero";
import { useDeleteHero } from "@/services/Hero/useDeleteHero";
import { useNavigationStore } from "@/core/lib/store";
import Alert from "@/shared/components/Alert.vue";
import type { AlertType } from "@/shared/components/Alert.vue";
import ConfirmDialog from "@/shared/components/ConfirmDialog.vue";

const navigationStore = useNavigationStore();
const { data: heroes, isLoading, isError, refetch } = useGetHero();
const { mutate: deleteHeroMutation } = useDeleteHero();
const searchQuery = ref("");

const goToAddHero = () => {
  navigationStore.actions.push("/add-hero");
};

const filteredHeroes = computed(() => {
  if (!heroes.value) return [];
  if (!searchQuery.value) return heroes.value;
  return heroes.value.filter((h) =>
    h.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Dropdown menu state
const activeMenu = ref<string | null>(null);

const toggleMenu = (id: string | number) => {
  const idStr = String(id);
  activeMenu.value = activeMenu.value === idStr ? null : idStr;
};

const closeMenu = () => {
  activeMenu.value = null;
};

// Close menu on outside click
const handleOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".hero-menu-container")) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const editHero = (heroId: string | number) => {
  navigationStore.actions.push('/edit-hero', { heroId });
  closeMenu();
};

// Alert State
const showAlert = ref(false);
const alertType = ref<AlertType>("info");
const alertMessage = ref("");

// Confirm Dialog State
const showConfirmDialog = ref(false);
const confirmDialogMessage = ref("");
const pendingDeleteId = ref<string | number | null>(null);

const confirmDelete = (heroId: string | number) => {
  closeMenu();
  const heroLabel =
    heroes.value?.find((h) => h.id === heroId)?.title || "banner ini";

  pendingDeleteId.value = heroId;
  confirmDialogMessage.value = `Apakah Anda yakin ingin menghapus banner "${heroLabel}"?`;
  showConfirmDialog.value = true;
};

const executeDelete = async () => {
  if (!pendingDeleteId.value) return;
  
  try {
    await deleteHeroMutation(pendingDeleteId.value);
    alertType.value = "success";
    alertMessage.value = "Banner berhasil dihapus!";
    showAlert.value = true;
    refetch(); // Reload the list
  } catch (error: any) {
    alertType.value = "error";
    alertMessage.value =
      error?.response?.data?.message ||
      "Gagal menghapus banner. Silakan coba lagi.";
    showAlert.value = true;
  } finally {
    pendingDeleteId.value = null;
  }
};
</script>

<template>
  <div class="flex flex-col gap-2 relative">
    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-model:show="showConfirmDialog"
      title="Hapus Banner"
      :message="confirmDialogMessage"
      type="danger"
      confirmText="Ya, Hapus"
      cancelText="Batal"
      @confirm="executeDelete"
    />

    <!-- Alert Component -->
    <div class="fixed top-20 left-6 right-6 z-50 pointer-events-none">
      <Alert
        class="pointer-events-auto"
        :type="alertType"
        :message="alertMessage"
        :show="showAlert"
        :duration="4000"
        @close="showAlert = false"
      />
    </div>

    <!-- Search Bar -->
    <div class="px-6 py-4">
      <div class="relative group">
        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            class="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search hero banners..."
          class="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 shadow-sm transition-all shadow-black/5"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Banners...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="px-6 py-10 text-center">
      <div class="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100/50 flex flex-col items-center">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" class="mb-3 opacity-50">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span class="font-bold text-sm mb-4">Something went wrong</span>
        <button 
          @click="refetch" 
          class="px-8 py-3 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Hero List Grid -->
    <div v-else class="px-6 pb-24 grid grid-cols-1 gap-6">
       <!-- Add New Hero Card -->
      <button
        @click="goToAddHero"
        class="w-full h-44 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group hover:border-blue-300 hover:bg-blue-50/20"
      >
        <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-blue-100 transition-all">
          <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
        </div>
        <div class="text-center">
          <h3 class="text-[15px] font-black text-slate-800 tracking-tight">Tambah Banner Baru</h3>
          <p class="text-[11px] font-bold text-slate-400">Atur konten utama halaman depan</p>
        </div>
      </button>

      <div
        v-for="hero in filteredHeroes"
        :key="hero.id"
        class="bg-white rounded-[2.5rem] overflow-visible border border-slate-50 shadow-sm active:scale-[0.98] transition-all group flex flex-col relative"
        :class="activeMenu === String(hero.id) ? 'z-50' : 'z-10'"
      >
        <!-- Hero Image (Banner) -->
        <div class="h-40 w-full relative">
          <img
            :src="hero.background_image || (hero as any).backgroundImage"
            :alt="hero.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div class="absolute top-4 left-4">
             <span class="px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
               {{ hero.badge_text || (hero as any).badgeText || '' }}
             </span>
          </div>
          
          <div class="absolute bottom-4 left-4 right-4">
             <h3 class="text-white font-black text-lg leading-tight tracking-tight drop-shadow-md">
               {{ hero.title }}
             </h3>
          </div>
        </div>

        <!-- Hero Actions & Info -->
        <div class="p-5 flex items-center justify-between">
          <div class="flex items-center gap-3">
             <div 
               :class="[
                 'w-2 h-2 rounded-full animate-pulse',
                 (hero.is_active ?? (hero as any).isActive) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'
               ]"
             ></div>
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">
               {{ (hero.is_active ?? (hero as any).isActive) ? 'Active on Storefront' : 'Draft / Hidden' }}
             </span>
          </div>
          
          <div class="relative hero-menu-container">
            <button
              @click.stop="toggleMenu(hero.id)"
              class="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-400 hover:bg-[#0F172A] hover:text-white transition-all shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                stroke="none"
              >
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="activeMenu === String(hero.id)"
                class="absolute right-0 bottom-12 z-50 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-black/10 py-2"
              >
                <button
                  @click.stop="editHero(hero.id)"
                  class="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-indigo-500"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Edit Banner
                </button>
                <div class="border-t border-slate-100 my-1"></div>
                <button
                  @click.stop="confirmDelete(hero.id)"
                  class="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    />
                  </svg>
                  Hapus Banner
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
