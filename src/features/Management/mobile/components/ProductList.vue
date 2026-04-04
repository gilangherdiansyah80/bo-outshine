<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useGetProducts } from "@/services/Products/useGetProducts";
import { useDeleteProduct } from "@/services/Products/useDeleteProduct";
import { useNavigationStore } from "@/core/lib/store";
import Alert from "@/shared/components/Alert.vue";
import type { AlertType } from "@/shared/components/Alert.vue";
import ConfirmDialog from "@/shared/components/ConfirmDialog.vue";

const navigationStore = useNavigationStore();
const { products, isLoading, isError, refetch } = useGetProducts();
const { mutate: deleteProductMutation } = useDeleteProduct();
const searchQuery = ref("");

const filteredProducts = computed(() => {
  if (!products.value) return [];
  if (!searchQuery.value) return products.value;
  return products.value.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Dropdown menu state
const activeMenu = ref<string | null>(null);

const toggleMenu = (productId: string) => {
  activeMenu.value = activeMenu.value === productId ? null : productId;
};

const closeMenu = () => {
  activeMenu.value = null;
};

// Close menu on outside click
const handleOutsideClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".product-menu-container")) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleOutsideClick);
});

const viewProduct = (productId: string) => {
  window.open(
    `https://outshine-store.vercel.app/outshine/product/${productId}`,
    "_blank",
  );
  closeMenu();
};

const editProduct = (productId: string) => {
  navigationStore.actions.push('/edit-product', { productId });
  closeMenu();
};

// Alert State
const showAlert = ref(false);
const alertType = ref<AlertType>("info");
const alertMessage = ref("");

// Confirm Dialog State
const showConfirmDialog = ref(false);
const confirmDialogMessage = ref("");
const pendingDeleteId = ref<string | null>(null);

const deleteProduct = (productId: string) => {
  closeMenu();
  const productLabel =
    products.value?.find((p) => p.id === productId)?.name || "produk ini";

  pendingDeleteId.value = productId;
  confirmDialogMessage.value = `Apakah Anda yakin ingin menghapus ${productLabel}?`;
  showConfirmDialog.value = true;
};

const executeDelete = async () => {
  if (!pendingDeleteId.value) return;
  
  try {
    await deleteProductMutation(pendingDeleteId.value);
    alertType.value = "success";
    alertMessage.value = "Produk berhasil dihapus!";
    showAlert.value = true;
    refetch(); // Reload the list
  } catch (error: any) {
    alertType.value = "error";
    alertMessage.value =
      error?.response?.data?.message ||
      "Gagal menghapus produk. Silakan coba lagi.";
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
      title="Hapus Produk"
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
        <div
          class="absolute inset-y-0 left-4 flex items-center pointer-events-none"
        >
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
          placeholder="Search products..."
          class="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 shadow-sm transition-all shadow-black/5"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div class="relative w-12 h-12">
        <div
          class="absolute inset-0 border-4 border-slate-100 rounded-full"
        ></div>
        <div
          class="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"
        ></div>
      </div>
      <span
        class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
        >Fetching Catalog...</span
      >
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="px-6 py-10 text-center">
      <div
        class="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100/50 flex flex-col items-center"
      >
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          class="mb-3 opacity-50"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
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

    <!-- Empty State -->
    <div
      v-else-if="!filteredProducts.length"
      class="flex flex-col items-center justify-center py-20 px-10 text-center"
    >
      <div
        class="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-300"
      >
        <svg
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <h3
        class="text-xl font-black text-slate-800 tracking-tight mb-2 uppercase"
      >
        No items found
      </h3>
      <p
        class="text-[10px] font-black text-slate-400 uppercase tracking-[2px] leading-relaxed"
      >
        We couldn't find any products matching your search.
      </p>
    </div>

    <!-- Product List Grid -->
    <div v-else class="px-6 pb-24 grid grid-cols-1 gap-4">
      <!-- Add New Product Card -->
      <button
        @click="navigationStore.actions.push('/add-product')"
        class="w-full h-44 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group hover:border-blue-300 hover:bg-blue-50/20"
      >
        <div
          class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-blue-100 transition-all"
        >
          <div
            class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
        <div class="text-center">
          <h3 class="text-[15px] font-black text-slate-800 tracking-tight">
            Tambah Produk Baru
          </h3>
          <p class="text-[11px] font-bold text-slate-400">
            Daftarkan item koleksi terbaru Anda
          </p>
        </div>
      </button>

      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white rounded-[2.5rem] p-3 border border-slate-50 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group relative"
        :class="activeMenu === product.id ? 'z-50' : 'z-10'"
      >
        <!-- Product Image Container -->
        <div
          class="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-100 flex-shrink-0 relative shadow-inner"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div
            v-if="product.isNew"
            class="absolute top-2 left-2 bg-blue-600 text-white text-[7px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg shadow-blue-500/20"
          >
            NEW ARRIVAL
          </div>
        </div>

        <!-- Product Details -->
        <div class="flex-1 min-w-0 pr-2">
          <div class="flex items-center gap-2 mb-1">
            <span
              class="text-[9px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50/50 rounded-lg"
            >
              {{ product.category }}
            </span>
          </div>

          <h3
            class="text-[13px] font-black text-[#0F172A] truncate mb-1.5 tracking-tight group-hover:text-blue-600 transition-colors"
          >
            {{ product.name }}
          </h3>

          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-black text-[#0F172A]">
              {{ formatCurrency(product.price) }}
            </span>
            <div v-if="product.originalPrice" class="flex items-center gap-2">
              <span class="text-[10px] text-slate-300 line-through font-bold">
                {{ formatCurrency(product.originalPrice) }}
              </span>
              <span class="text-[9px] font-black text-red-500">
                -{{ product.discount }}%
              </span>
            </div>
          </div>
        </div>

        <!-- Float Action Button -->
        <div class="relative product-menu-container">
          <button
            @click.stop="toggleMenu(product.id)"
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
              v-if="activeMenu === product.id"
              class="absolute right-0 top-12 z-50 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-black/10 py-2"
            >
              <button
                @click.stop="viewProduct(product.id)"
                class="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-blue-500"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Lihat Produk
              </button>
              <button
                @click.stop="editProduct(product.id)"
                class="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
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
                Edit Produk
              </button>
              <div class="border-t border-slate-100 my-1"></div>
              <button
                @click.stop="deleteProduct(product.id)"
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
                Hapus Produk
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
