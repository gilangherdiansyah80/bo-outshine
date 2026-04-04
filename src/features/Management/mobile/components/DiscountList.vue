<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useGetDiscounts } from "@/services/Discounts/useGetDiscounts";
import { useDeleteDiscount } from "@/services/Discounts/useDeleteDiscount";
import { useNavigationStore } from "@/core/lib/store";
import Alert from "@/shared/components/Alert.vue";
import type { AlertType } from "@/shared/components/Alert.vue";
import ConfirmDialog from "@/shared/components/ConfirmDialog.vue";

const navigationStore = useNavigationStore();
const { data: discounts, isLoading, isError, refetch } = useGetDiscounts();
const { mutate: deleteDiscountMutation } = useDeleteDiscount();
const searchQuery = ref("");

const goToAddDiscount = () => {
  navigationStore.actions.push("/add-discount");
};

const filteredDiscounts = computed(() => {
  if (!discounts.value) return [];
  if (!searchQuery.value) return discounts.value;
  return discounts.value.filter((d) =>
    d.productName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

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
  if (!target.closest(".discount-menu-container")) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const editDiscount = (discountId: string | number) => {
  navigationStore.actions.push('/edit-discount', { discountId });
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

const confirmDelete = (discountId: string | number) => {
  closeMenu();
  const discountLabel =
    discounts.value?.find((d) => d.id === discountId)?.productName || "promo ini";

  pendingDeleteId.value = discountId;
  confirmDialogMessage.value = `Apakah Anda yakin ingin menghapus promo untuk ${discountLabel}?`;
  showConfirmDialog.value = true;
};

const executeDelete = async () => {
  if (!pendingDeleteId.value) return;
  
  try {
    await deleteDiscountMutation(pendingDeleteId.value);
    alertType.value = "success";
    alertMessage.value = "Promo berhasil dihapus!";
    showAlert.value = true;
    refetch(); // Reload the list
  } catch (error: any) {
    alertType.value = "error";
    alertMessage.value =
      error?.response?.data?.message ||
      "Gagal menghapus promo. Silakan coba lagi.";
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
      title="Hapus Promo"
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
          placeholder="Search promos..."
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
      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Promos...</span>
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

    <!-- Discount List Grid -->
    <div v-else class="px-6 pb-24 grid grid-cols-1 gap-4">
      <!-- Add New Promo Card -->
      <button
        @click="goToAddDiscount"
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
          <h3 class="text-[15px] font-black text-slate-800 tracking-tight">Buat Promo Baru</h3>
          <p class="text-[11px] font-bold text-slate-400">Berikan diskon menarik untuk pelanggan</p>
        </div>
      </button>

      <div
        v-for="discount in filteredDiscounts"
        :key="discount.id"
        class="bg-white rounded-[2.5rem] p-4 border border-slate-50 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group relative"
        :class="activeMenu === String(discount.id) ? 'z-50' : 'z-10'"
      >
        <!-- Type Badge (Ribbon like) -->
        <div class="absolute top-0 right-8 px-3 py-1 bg-amber-100 text-amber-700 text-[8px] font-black uppercase rounded-b-xl shadow-sm">
           Promo
        </div>

        <!-- Discount Display -->
        <div class="w-16 h-16 rounded-[1.8rem] bg-amber-50 flex flex-col items-center justify-center text-amber-600 flex-shrink-0 relative shadow-inner border border-amber-100/50">
          <span class="text-[18px] font-black leading-none tracking-tighter">{{ discount.value }}{{ discount.type === 'percent' ? '%' : '' }}</span>
          <span class="text-[8px] font-black uppercase mt-0.5 opacity-60">OFF</span>
        </div>

        <!-- Promo Details -->
        <div class="flex-1 min-w-0 pr-2">
          <div class="flex items-center gap-2 mb-1">
            <span 
              :class="[
                'text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md',
                discount.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
              ]"
            >
              {{ discount.isActive ? 'RUNNING' : 'PAUSED' }}
            </span>
          </div>
          
          <h3 class="text-[14px] font-black text-[#0F172A] truncate tracking-tight group-hover:text-amber-600 transition-colors">
            {{ discount.productName }}
          </h3>
          
          <div class="flex items-center gap-1.5 mt-2 font-bold text-slate-400 text-[9px] uppercase tracking-wider">
             <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
             </svg>
             <span>Ends {{ formatDate(discount.endDate) }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="relative discount-menu-container">
          <button
            @click.stop="toggleMenu(discount.id)"
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
              v-if="activeMenu === String(discount.id)"
              class="absolute right-0 top-12 z-50 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-black/10 py-2"
            >
              <button
                @click.stop="editDiscount(discount.id)"
                class="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                :class="activeMenu === String(discount.id) ? 'z-50' : 'z-10'"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-amber-500"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Edit Promo
              </button>
              <div class="border-t border-slate-100 my-1"></div>
              <button
                @click.stop="confirmDelete(discount.id)"
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
                Hapus Promo
              </button>
            </div>
          </Transition>
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
