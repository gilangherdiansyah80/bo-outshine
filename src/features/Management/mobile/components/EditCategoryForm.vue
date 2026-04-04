<script setup lang="ts">
import { ref, watch } from 'vue';
import { useNavigationStore } from '@/core/lib/store';
import { usePutCategory } from '@/services/Category/usePutCategory';
import { useGetCategory } from '@/services/Category/useGetCategory';
import Button from '@/shared/ui/Button.vue';
import BottomSheet from '@/shared/components/BottomSheet.vue';
import Alert from '@/shared/components/Alert.vue';
import type { AlertType } from '@/shared/components/Alert.vue';

const props = defineProps<{
  categoryId: string;
}>();

const navigationStore = useNavigationStore();
const { data: categories } = useGetCategory();
const { mutate: putCategory, isLoading: isSubmitting } = usePutCategory();

// Form State
const name = ref('');
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const existingImageUrl = ref<string | null>(null);

// Alert State
const showAlert = ref(false);
const alertType = ref<AlertType>('info');
const alertMessage = ref('');

// UI State
const showImageSheet = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const hasPopulated = ref(false);

watch(() => categories.value, (newCategories) => {
  if (newCategories && newCategories.length > 0 && !hasPopulated.value) {
    const category = newCategories.find((c) => c.id === props.categoryId);
    if (category) {
      name.value = category.name;
      existingImageUrl.value = category.imageUrl;
      hasPopulated.value = true;
    }
  }
}, { immediate: true });

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
    showImageSheet.value = false;
  }
};

const removeImage = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imageFile.value = null;
  imagePreview.value = null;
};

const submitForm = async () => {
  if (!name.value.trim()) {
    alertType.value = 'error';
    alertMessage.value = 'Nama kategori harus diisi.';
    showAlert.value = true;
    return;
  }

  try {
    await putCategory(props.categoryId, name.value.trim(), imageFile.value);
    
    alertType.value = 'success';
    alertMessage.value = 'Kategori berhasil diperbarui!';
    showAlert.value = true;
    
    setTimeout(() => {
      navigationStore.actions.pop();
    }, 1500);
  } catch (error: any) {
    console.error('Failed to update category:', error);
    alertType.value = 'error';
    alertMessage.value = error?.response?.data?.message || 'Gagal memperbarui kategori. Silakan coba lagi.';
    showAlert.value = true;
  }
};
</script>

<template>
  <div class="px-6 py-4">
    <!-- Alert -->
    <div class="mb-6">
      <Alert
        :type="alertType"
        :message="alertMessage"
        :show="showAlert"
        @close="showAlert = false"
      />
    </div>

    <form @submit.prevent="submitForm" class="flex flex-col gap-8">
      <!-- Image Upload Section -->
      <div class="flex flex-col gap-3">
        <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gambar Kategori</label>
        
        <div v-if="imagePreview || existingImageUrl" class="relative group">
          <div class="w-full aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl shadow-black/5 relative active:scale-[0.98] transition-all">
            <img :src="imagePreview || existingImageUrl || ''" alt="Category Preview" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
               <button @click="showImageSheet = true" type="button" class="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
            </div>
          </div>
          <div v-if="imagePreview" class="absolute -top-2 -right-2 z-10">
            <button @click="removeImage" type="button" class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <button
          v-else
          type="button"
          @click="showImageSheet = true"
          class="w-full h-44 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all hover:border-blue-300 hover:bg-blue-50/20"
        >
          <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-[13px] font-black text-slate-800 tracking-tight">Pilih Gambar</h3>
            <p class="text-[10px] font-bold text-slate-400">JPG, PNG, atau WEBP</p>
          </div>
        </button>
      </div>

      <!-- Category Name Section -->
      <div class="flex flex-col gap-3">
        <label for="category-name" class="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Nama Kategori</label>
        <input
          id="category-name"
          v-model="name"
          type="text"
          placeholder="Contoh: T-Shirt, Hoodie"
          class="w-full bg-white border border-slate-100 rounded-[1.5rem] py-4 px-6 text-[14px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 shadow-sm transition-all"
        />
      </div>

      <!-- Submit Button -->
      <div class="pt-4 pb-12">
        <Button
          type="submit"
          :loading="isSubmitting"
          block
          size="lg"
          class="bg-[#{0F172A}] hover:bg-black text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] h-14 shadow-xl shadow-slate-200 transition-all active:scale-95"
        >
          Simpan Perubahan
        </Button>
      </div>
    </form>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />

    <!-- Image Selection BottomSheet -->
    <BottomSheet :show="showImageSheet" title="Update Gambar" @close="showImageSheet = false">
      <div class="flex flex-col gap-4">
        <button
          type="button"
          @click="triggerFileInput"
          class="flex items-center gap-4 w-full p-5 bg-slate-50 rounded-[2rem] border border-slate-100 active:scale-[0.98] transition-all"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
             <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div class="text-left">
            <h4 class="text-sm font-black text-slate-800 tracking-tight">Pilih dari Galeri</h4>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pilih gambar baru untuk kategori ini</p>
          </div>
        </button>
      </div>
    </BottomSheet>
  </div>
</template>
