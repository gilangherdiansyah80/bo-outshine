<script setup lang="ts">
import { ref } from 'vue';
import { useNavigationStore } from '@/core/lib/store';
import { usePostSize } from '@/services/Sizes/usePostSize';
import Button from '@/shared/ui/Button.vue';
import Alert from '@/shared/components/Alert.vue';
import type { AlertType } from '@/shared/components/Alert.vue';

const navigationStore = useNavigationStore();
const { mutate: postSize, isLoading: isSubmitting } = usePostSize();

// Form State
const name = ref('');

// Alert State
const showAlert = ref(false);
const alertType = ref<AlertType>('info');
const alertMessage = ref('');

const submitForm = async () => {
  if (!name.value.trim()) {
    alertType.value = 'error';
    alertMessage.value = 'Nama ukuran harus diisi.';
    showAlert.value = true;
    return;
  }

  try {
    await postSize(name.value.trim());
    
    alertType.value = 'success';
    alertMessage.value = 'Ukuran sukses ditambahkan!';
    showAlert.value = true;
    
    setTimeout(() => {
      navigationStore.actions.pop();
    }, 1500);
  } catch (error: any) {
    console.error('Failed to add size:', error);
    alertType.value = 'error';
    alertMessage.value = error?.response?.data?.message || 'Gagal menambahkan ukuran. Silakan coba lagi.';
    showAlert.value = true;
  }
};
</script>

<template>
  <div class="px-6 py-10">
    <!-- Alert -->
    <div class="mb-8">
      <Alert
        :type="alertType"
        :message="alertMessage"
        :show="showAlert"
        @close="showAlert = false"
      />
    </div>

    <form @submit.prevent="submitForm" class="flex flex-col gap-10">
      <!-- Size Info Section -->
      <div class="flex flex-col items-center justify-center mb-4">
        <div class="w-24 h-24 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner mb-6 transition-transform hover:scale-110 duration-500">
           <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.5">
             <path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2M8 12h8" />
           </svg>
        </div>
        <h2 class="text-lg font-black text-slate-800 tracking-tight uppercase">Detail Ukuran</h2>
        <p class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Definisikan standar ukuran baru</p>
      </div>

      <!-- Size Name Section -->
      <div class="flex flex-col gap-4">
        <label for="size-name" class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none px-2">Label Ukuran</label>
        <div class="relative group">
           <div class="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M7 7h10M7 12h10M7 17h10" />
              </svg>
           </div>
           <input
            id="size-name"
            v-model="name"
            type="text"
            placeholder="Contoh: XL, 42, XXL"
            class="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 text-[15px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/20 shadow-sm transition-all uppercase"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-6 pb-12">
        <Button
          type="submit"
          :loading="isSubmitting"
          block
          size="lg"
          class="bg-[#0F172A] hover:bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] h-16 shadow-2xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span>Tambah Ukuran</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Button>
      </div>
    </form>
  </div>
</template>
