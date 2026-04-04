<script setup lang="ts">
import { ref, watch } from 'vue';
import { useNavigationStore } from '@/core/lib/store';
import { usePutHero } from '@/services/Hero/usePutHero';
import { useGetHero } from '@/services/Hero/useGetHero';
import Button from '@/shared/ui/Button.vue';
import Alert from '@/shared/components/Alert.vue';
import type { AlertType } from '@/shared/components/Alert.vue';

const props = defineProps<{
  heroId: string | number;
}>();

const navigationStore = useNavigationStore();
const { data: heroes } = useGetHero();
const { mutate: putHero, isLoading: isSubmitting } = usePutHero();

// Refs
const fileInput = ref<HTMLInputElement | null>(null);

// Form State
const badgeText = ref('');
const title = ref('');
const buttonText = ref('');
const isActive = ref(true);
const backgroundImage = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const hasPopulated = ref(false);

// Alert State
const showAlert = ref(false);
const alertType = ref<AlertType>('info');
const alertMessage = ref('');

watch(() => heroes.value, (newHeroes) => {
  if (newHeroes && newHeroes.length > 0 && !hasPopulated.value) {
    const hero = newHeroes.find((h) => String(h.id) === String(props.heroId)) as any;
    if (hero) {
      badgeText.value = hero.badge_text || hero.badgeText || '';
      title.value = hero.title || '';
      buttonText.value = hero.button_text || hero.buttonText || '';
      isActive.value = hero.is_active !== undefined ? hero.is_active : (hero.isActive !== undefined ? hero.isActive : true);
      imagePreview.value = hero.background_image || hero.backgroundImage || null;
      hasPopulated.value = true;
    }
  }
}, { immediate: true });

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    backgroundImage.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  if (!title.value.trim()) {
    alertType.value = 'error';
    alertMessage.value = 'Judul Banner wajib diisi.';
    showAlert.value = true;
    return;
  }

  const formData = new FormData();
  formData.append('badge_text', badgeText.value);
  formData.append('title', title.value);
  formData.append('button_text', buttonText.value);
  formData.append('is_active', String(isActive.value));
  
  if (backgroundImage.value) {
    formData.append('background_image', backgroundImage.value);
  }

  try {
    await putHero(props.heroId, formData);
    
    alertType.value = 'success';
    alertMessage.value = 'Banner hero berhasil diperbarui!';
    showAlert.value = true;
    
    setTimeout(() => {
      navigationStore.actions.pop();
    }, 1500);
  } catch (error: any) {
    console.error('Failed to update hero banner:', error);
    alertType.value = 'error';
    alertMessage.value = error?.response?.data?.message || 'Gagal memperbarui banner. Silakan coba lagi.';
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

    <form @submit.prevent="submitForm" class="flex flex-col gap-8">
      <!-- Image Picker Section -->
      <div class="flex flex-col gap-4">
        <label class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none px-2">Banner Image</label>
        <div 
          @click="fileInput?.click()"
          class="relative w-full h-48 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-slate-100/50 hover:border-slate-300 active:scale-[0.98] cursor-pointer group"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageChange"
          />
          
          <template v-if="imagePreview">
            <img :src="imagePreview" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                  </svg>
               </div>
            </div>
          </template>
          
          <template v-else>
            <div class="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
               <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6366f1" stroke-width="2.5">
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
               </svg>
            </div>
            <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest">Klik untuk ganti banner</p>
          </template>
        </div>
      </div>

      <!-- Badge Text Section -->
      <div class="flex flex-col gap-4">
        <label for="badge-text" class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none px-2">Badge Text</label>
        <div class="relative">
           <input
            id="badge-text"
            v-model="badgeText"
            type="text"
            placeholder="Contoh: NEW ARRIVAL, BEST SELLER"
            class="w-full bg-white border border-slate-100 rounded-[2rem] py-5 px-8 text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 shadow-sm transition-all"
          />
        </div>
      </div>

      <!-- Title Section -->
      <div class="flex flex-col gap-4">
        <label for="title" class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none px-2">Banner Title</label>
        <div class="relative">
           <textarea
            id="title"
            v-model="title"
            rows="3"
            placeholder="Masukkan judul banner..."
            class="w-full bg-white border border-slate-100 rounded-[2rem] py-5 px-8 text-[14px] font-bold text-slate-700 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 shadow-sm transition-all resize-none"
          ></textarea>
        </div>
      </div>

      <!-- Button Text Section -->
      <div class="flex flex-col gap-4">
        <label for="button-text" class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none px-2">Button Label</label>
        <div class="relative">
           <input
            id="button-text"
            v-model="buttonText"
            type="text"
            class="w-full bg-white border border-slate-100 rounded-[2rem] py-5 px-8 text-[14px] font-bold text-slate-700 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      <!-- Active Toggle -->
      <div class="flex items-center justify-between bg-white p-5 rounded-[2.5rem] border border-slate-50 shadow-sm mt-2">
        <div>
          <h4 class="text-[13px] font-black text-slate-800 uppercase tracking-tight">Tampilkan Banner</h4>
          <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Aktifkan atau simpan sebagai draf</p>
        </div>
        <button
          type="button"
          @click="isActive = !isActive"
          :class="['w-16 h-9 rounded-full transition-all relative', isActive ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-200']"
        >
          <div :class="['absolute top-1.5 w-6 h-6 bg-white rounded-full transition-all shadow-sm', isActive ? 'right-1.5' : 'left-1.5']"></div>
        </button>
      </div>

      <!-- Submit Button -->
      <div class="pt-6 pb-12">
        <Button
          type="submit"
          :loading="isSubmitting"
          block
          size="lg"
          class="bg-[#0F172A] hover:bg-black text-white rounded-[2.5rem] font-black uppercase tracking-widest text-[11px] h-16 shadow-2xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span>Simpan Perubahan</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </Button>
      </div>
    </form>
  </div>
</template>
