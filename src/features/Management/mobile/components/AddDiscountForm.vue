<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNavigationStore } from '@/core/lib/store';
import { usePostDiscount } from '@/services/Discounts/usePostDiscount';
import { useGetProducts } from '@/services/Products/useGetProducts';
import Button from '@/shared/ui/Button.vue';
import Alert from '@/shared/components/Alert.vue';
import BottomSheet from '@/shared/components/BottomSheet.vue';
import type { AlertType } from '@/shared/components/Alert.vue';

const navigationStore = useNavigationStore();
const { mutate: postDiscount, isLoading: isSubmitting } = usePostDiscount();
const { products, isLoading: isLoadingProducts } = useGetProducts();

// Form State
const selectedProductId = ref('');
const selectedProductName = ref('');
const type = ref<'percent' | 'fixed'>('percent');
const value = ref<number>(0);
const startDate = ref(new Date().toISOString().split('T')[0]);
const endDate = ref(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
const isActive = ref(true);

// UI State
const showProductSheet = ref(false);
const productSearchQuery = ref('');
const showAlert = ref(false);
const alertType = ref<AlertType>('info');
const alertMessage = ref('');

const filteredProducts = computed(() => {
  if (!products.value) return [];
  if (!productSearchQuery.value) return products.value;
  return products.value.filter(p => 
    p.name.toLowerCase().includes(productSearchQuery.value.toLowerCase())
  );
});

const selectProduct = (id: string, name: string) => {
  selectedProductId.value = id;
  selectedProductName.value = name;
  showProductSheet.value = false;
};

const submitForm = async () => {
  if (!selectedProductId.value) {
    alertType.value = 'error';
    alertMessage.value = 'Pilih produk terlebih dahulu.';
    showAlert.value = true;
    return;
  }

  if (value.value <= 0) {
    alertType.value = 'error';
    alertMessage.value = 'Nilai diskon harus lebih dari 0.';
    showAlert.value = true;
    return;
  }

  try {
    await postDiscount(selectedProductId.value, {
      type: type.value,
      value: Number(value.value),
      startDate: startDate.value || undefined,
      endDate: endDate.value || undefined
    });
    
    alertType.value = 'success';
    alertMessage.value = 'Promo berhasil dibuat!';
    showAlert.value = true;
    
    setTimeout(() => {
      navigationStore.actions.pop();
    }, 1500);
  } catch (error: any) {
    console.error('Failed to add discount:', error);
    alertType.value = 'error';
    alertMessage.value = error?.response?.data?.message || 'Gagal membuat promo. Silakan coba lagi.';
    showAlert.value = true;
  }
};
</script>

<template>
  <div class="px-6 py-6">
    <!-- Alert -->
    <div class="mb-6">
      <Alert
        :type="alertType"
        :message="alertMessage"
        :show="showAlert"
        @close="showAlert = false"
      />
    </div>

    <form @submit.prevent="submitForm" class="flex flex-col gap-6">
      <!-- Product Selection -->
      <div class="flex flex-col gap-3">
        <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Pilih Produk</label>
        <button
          type="button"
          @click="showProductSheet = true"
          class="w-full bg-white border border-slate-100 rounded-[1.5rem] py-4 px-6 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
        >
          <span v-if="selectedProductName" class="text-[14px] font-bold text-slate-700">{{ selectedProductName }}</span>
          <span v-else class="text-[14px] font-bold text-slate-300 italic">Klik untuk memilih produk...</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" class="text-slate-400">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <!-- Discount Type & Value -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-3">
          <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Tipe</label>
          <div class="flex bg-slate-100 p-1 rounded-2xl h-14">
            <button
              type="button"
              @click="type = 'percent'"
              :class="['flex-1 rounded-xl text-[10px] font-black uppercase transition-all', type === 'percent' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400']"
            >
              Persen (%)
            </button>
            <button
              type="button"
              @click="type = 'fixed'"
              :class="['flex-1 rounded-xl text-[10px] font-black uppercase transition-all', type === 'fixed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400']"
            >
              Nominal (Rp)
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Nilai Diskon</label>
          <input
            v-model="value"
            type="number"
            placeholder="0"
            class="w-full h-14 bg-white border border-slate-100 rounded-[1.5rem] px-6 text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 shadow-sm transition-all"
          />
        </div>
      </div>

      <!-- Validity Period -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-3">
          <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Mulai</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full h-14 bg-white border border-slate-100 rounded-[1.5rem] px-6 text-[13px] font-bold text-slate-700/80 focus:outline-none shadow-sm"
          />
        </div>
        <div class="flex flex-col gap-3">
          <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Berakhir</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full h-14 bg-white border border-slate-100 rounded-[1.5rem] px-6 text-[13px] font-bold text-slate-700/80 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      <!-- Active Toggle -->
      <div class="flex items-center justify-between bg-white p-4 rounded-[1.5rem] border border-slate-50 shadow-sm mt-2">
        <div>
          <h4 class="text-[13px] font-black text-slate-800 uppercase tracking-tight">Status Promo</h4>
          <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Aktifkan promo segera setelah dibuat</p>
        </div>
        <button
          type="button"
          @click="isActive = !isActive"
          :class="['w-14 h-8 rounded-full transition-all relative', isActive ? 'bg-emerald-500' : 'bg-slate-200']"
        >
          <div :class="['absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm', isActive ? 'right-1' : 'left-1']"></div>
        </button>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 pb-10">
        <Button
          type="submit"
          :loading="isSubmitting"
          block
          size="lg"
          class="bg-[#0F172A] hover:bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] h-14 shadow-xl shadow-slate-200 transition-all active:scale-95"
        >
          Buat Promo Sekarang
        </Button>
      </div>
    </form>

    <!-- Product Selection BottomSheet -->
    <BottomSheet :show="showProductSheet" title="Pilih Produk" @close="showProductSheet = false">
      <div class="flex flex-col gap-4 max-h-[60vh]">
        <!-- Search within Sheet -->
        <div class="relative">
          <input
            v-model="productSearchQuery"
            type="text"
            placeholder="Cari produk..."
            class="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5"
          />
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>

        <!-- Product List -->
        <div class="overflow-y-auto flex flex-col gap-2 pr-1">
          <div v-if="isLoadingProducts" class="py-10 text-center">
            <div class="inline-block w-6 h-6 border-2 border-t-blue-600 border-slate-200 rounded-full animate-spin"></div>
          </div>
          <button
            v-for="product in filteredProducts"
            :key="product.id"
            type="button"
            @click="selectProduct(product.id, product.name)"
            class="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors text-left"
          >
            <div class="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-inner">
              <img :src="product.image" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-[13px] font-bold text-slate-800 truncate">{{ product.name }}</h4>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{{ product.category }}</p>
            </div>
            <div v-if="selectedProductId === product.id" class="text-blue-600">
               <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3">
                 <polyline points="20 6 9 17 4 12" />
               </svg>
            </div>
          </button>
          <div v-if="!filteredProducts.length && !isLoadingProducts" class="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">
            Produk tidak ditemukan
          </div>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>
