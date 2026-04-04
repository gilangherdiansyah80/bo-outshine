<script setup lang="ts">
import { ref, watch } from 'vue';
import { useNavigationStore } from '@/core/lib/store';
import { usePutDiscount } from '@/services/Discounts/usePutDiscount';
import { useGetDiscounts } from '@/services/Discounts/useGetDiscounts';
import Button from '@/shared/ui/Button.vue';
import Alert from '@/shared/components/Alert.vue';
import type { AlertType } from '@/shared/components/Alert.vue';

const props = defineProps<{
  discountId: string | number;
}>();

const navigationStore = useNavigationStore();
const { data: discounts } = useGetDiscounts();
const { mutate: putDiscount, isLoading: isSubmitting } = usePutDiscount();

// Form State
const productName = ref('');
const type = ref<'percent' | 'fixed'>('percent');
const value = ref<number>(0);
const startDate = ref('');
const endDate = ref('');
const isActive = ref(true);
const hasPopulated = ref(false);

// Alert State
const showAlert = ref(false);
const alertType = ref<AlertType>('info');
const alertMessage = ref('');

const formatToInputDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

watch(() => discounts.value, (newDiscounts) => {
  if (newDiscounts && newDiscounts.length > 0 && !hasPopulated.value) {
    const discount = newDiscounts.find((d) => String(d.id) === String(props.discountId));
    if (discount) {
      productName.value = discount.productName;
      type.value = discount.type;
      value.value = discount.value;
      startDate.value = formatToInputDate(discount.startDate);
      endDate.value = formatToInputDate(discount.endDate);
      isActive.value = discount.isActive;
      hasPopulated.value = true;
    }
  }
}, { immediate: true });

const submitForm = async () => {
  if (Number(value.value) <= 0) {
    alertType.value = 'error';
    alertMessage.value = 'Nilai diskon harus lebih dari 0.';
    showAlert.value = true;
    return;
  }

  try {
    await putDiscount(props.discountId, {
      type: type.value,
      value: Number(value.value),
      startDate: startDate.value || undefined,
      endDate: endDate.value || undefined
    });
    
    alertType.value = 'success';
    alertMessage.value = 'Promo berhasil diperbarui!';
    showAlert.value = true;
    
    setTimeout(() => {
      navigationStore.actions.pop();
    }, 1500);
  } catch (error: any) {
    console.error('Failed to update discount:', error);
    alertType.value = 'error';
    alertMessage.value = error?.response?.data?.message || 'Gagal memperbarui promo. Silakan coba lagi.';
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
      <!-- Product Display (Read Only on Edit) -->
      <div class="flex flex-col gap-3 opacity-60">
        <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Produk (Tidak dapat diubah)</label>
        <div class="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 px-6">
          <span class="text-[14px] font-bold text-slate-700">{{ productName || 'Loading...' }}</span>
        </div>
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
          <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Aktifkan atau jeda promo ini</p>
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
          Simpan Perubahan
        </Button>
      </div>
    </form>
  </div>
</template>
