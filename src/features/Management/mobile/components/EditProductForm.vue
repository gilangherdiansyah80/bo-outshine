<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useNavigationStore } from '@/core/lib/store';
import { useGetProductDetail } from '@/services/Products/useGetProductDetail';
import { usePutProduct } from '@/services/Products/usePutProduct';
import { usePostImage } from '@/services/Products/usePostImage';
import { usePatchImage } from '@/services/Products/usePatchImage';
import { usePostGrup } from '@/services/Products/usePostGrup';
import { usePostTag } from '@/services/Products/usePostTag';
import { usePostSize } from '@/services/Products/usePostSize';
import { usePutSize } from '@/services/Products/usePutSize';
import { usePostGuideSize } from '@/services/Products/usePostGuideSize';
import { usePostSpesification } from '@/services/Products/usePostSpesification';
import { useGetCategory } from '@/services/Category/useGetCategory';
import { useGetTags } from '@/services/Tags/useGetTags';
import { useGetSizes } from '@/services/Sizes/useGetSizes';
import Button from '@/shared/ui/Button.vue';
import BottomSheet from '@/shared/components/BottomSheet.vue';
import Alert from '@/shared/components/Alert.vue';
import type { AlertType } from '@/shared/components/Alert.vue';
import type { ProductDetail } from '@/services/Products/useGetProductDetail';

const props = defineProps<{
  productId: string;
}>();

const navigationStore = useNavigationStore();
const { isLoading: isLoadingDetail, fetch: fetchDetail } = useGetProductDetail();
const { mutate: updateProduct, isLoading: isSubmitting } = usePutProduct();
const { mutate: uploadImage } = usePostImage();
const { mutate: setPrimaryImage } = usePatchImage();
const { mutate: postGroupLink } = usePostGrup();
const { mutate: postTag } = usePostTag();
const { mutate: postSize } = usePostSize();
const { mutate: putSize } = usePutSize();
const { mutate: postGuideSize } = usePostGuideSize();
const { mutate: postSpec } = usePostSpesification();
const { data: categories, isLoading: isLoadingCategories } = useGetCategory();
const { data: tags, isLoading: isLoadingTags } = useGetTags();
const { data: sizes, isLoading: isLoadingSizes } = useGetSizes();

// Form State
const form = ref({
  name: '',
  price: 0,
  description: '',
  categoryId: '',
  isActive: true,
  isPo: false,
  poDpPercent: 0,
});

const groupLink = ref('');
const selectedTagIds = ref<string[]>([]);

// Specifications State
interface SpecItem {
  key: string;
  value: string;
}
const specs = ref<SpecItem[]>([]);

const addSpec = () => {
  specs.value.push({ key: '', value: '' });
};

const removeSpec = (index: number) => {
  specs.value.splice(index, 1);
};

const toggleTag = (tagId: string) => {
  const idx = selectedTagIds.value.indexOf(tagId);
  if (idx > -1) {
    selectedTagIds.value.splice(idx, 1);
  } else {
    selectedTagIds.value.push(tagId);
  }
};

// Size State — map of MasterSizeID -> stock
const selectedSizes = ref<Record<string, number>>({});
// Map MasterSizeID -> RelationUUID for PUT calls
const sizeRelationMap = ref<Record<string, string>>({});

const toggleSize = (sizeId: string) => {
  if (sizeId in selectedSizes.value) {
    const copy = { ...selectedSizes.value };
    delete copy[sizeId];
    selectedSizes.value = copy;
  } else {
    selectedSizes.value = { ...selectedSizes.value, [sizeId]: 0 };
  }
};

const updateStock = (sizeId: string, stock: number) => {
  selectedSizes.value = { ...selectedSizes.value, [sizeId]: stock };
};

// Size Guide State
const sizeGuideImage = ref<File | null>(null);
const sizeGuidePreview = ref<string | null>(null);
const sizeGuideDescription = ref('');
const showSizeGuideSheet = ref(false);
const sizeGuideInput = ref<HTMLInputElement | null>(null);
const existingSizeGuideUrl = ref<string | null>(null);

const openSizeGuideSheet = () => {
  showSizeGuideSheet.value = true;
};

const closeSizeGuideSheet = () => {
  showSizeGuideSheet.value = false;
};

const triggerSizeGuideInput = () => {
  sizeGuideInput.value?.click();
};

const onSizeGuideChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    sizeGuideImage.value = file;
    sizeGuidePreview.value = URL.createObjectURL(file);
    existingSizeGuideUrl.value = null;
    closeSizeGuideSheet();
  }
  target.value = '';
};

const removeSizeGuide = () => {
  if (sizeGuidePreview.value) {
    URL.revokeObjectURL(sizeGuidePreview.value);
  }
  sizeGuideImage.value = null;
  sizeGuidePreview.value = null;
  existingSizeGuideUrl.value = null;
};

// Price formatting with dot separator
const priceDisplay = ref('');
const onPriceInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const raw = target.value.replace(/\D/g, '');
  const num = parseInt(raw, 10) || 0;
  form.value.price = num;
  priceDisplay.value = num > 0 ? num.toLocaleString('id-ID') : '';
};

// Image State — support multiple images
interface ImageItem {
  file: File | null;
  preview: string;
  existingId?: string; // ID from server for existing images
  isExisting: boolean;
}
const images = ref<ImageItem[]>([]);
const primaryIndex = ref(0);
const showImageSheet = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const openImageSheet = () => {
  showImageSheet.value = true;
};

const closeImageSheet = () => {
  showImageSheet.value = false;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      images.value.push({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false,
      });
    }
    closeImageSheet();
  }
  target.value = '';
};

const removeImage = (index: number) => {
  if (!images.value[index].isExisting) {
    URL.revokeObjectURL(images.value[index].preview);
  }
  images.value.splice(index, 1);
  if (images.value.length === 0) {
    primaryIndex.value = 0;
  } else if (primaryIndex.value >= images.value.length) {
    primaryIndex.value = 0;
  } else if (index < primaryIndex.value) {
    primaryIndex.value--;
  }
};

// Computed: current size guide display URL
const displaySizeGuideUrl = computed(() => {
  return sizeGuidePreview.value || existingSizeGuideUrl.value;
});

// Populate form with existing product data
const populateForm = (product: ProductDetail) => {
  form.value = {
    name: product.name,
    price: product.basePrice,
    description: product.description,
    categoryId: product.category?.id || '',
    isActive: product.isActive ?? true,
    isPo: product.isPo,
    poDpPercent: product.poDpPercent,
  };

  // Price display
  priceDisplay.value = product.basePrice > 0 ? product.basePrice.toLocaleString('id-ID') : '';

  // Images
  if (product.images && product.images.length > 0) {
    images.value = product.images.map((img) => ({
      file: null,
      preview: img.imageUrl,
      existingId: img.id,
      isExisting: true,
    }));
    // Find primary image index
    const primaryIdx = product.images.findIndex((img) => img.isPrimary);
    primaryIndex.value = primaryIdx >= 0 ? primaryIdx : 0;
  }

  // Tags
  if (product.tags && product.tags.length > 0) {
    selectedTagIds.value = product.tags.map((tag) => String(tag.id));
  }

  // Sizes
  if (product.sizes && product.sizes.length > 0) {
    const sizeMap: Record<string, number> = {};
    const relationMap: Record<string, string> = {};
    
    product.sizes.forEach((s) => {
      // API returns relationship id (UUID), name, and stock
      // We match by name to find the Master Size ID
      const masterSize = sizes.value?.find(ms => ms.name === s.name);
      if (masterSize) {
        const msid = String(masterSize.id);
        sizeMap[msid] = s.stock;
        relationMap[msid] = s.id; // Relationship UUID
      }
    });
    
    selectedSizes.value = sizeMap;
    sizeRelationMap.value = relationMap;
  }

  // Specs
  if (product.specs && product.specs.length > 0) {
    specs.value = product.specs.map((s) => ({ key: s.key, value: s.value }));
  }

  // Group Link
  if (product.groupLink) {
    groupLink.value = product.groupLink.link;
  }

  // Size Guide
  if (product.sizeGuide) {
    existingSizeGuideUrl.value = product.sizeGuide.imageUrl;
    sizeGuideDescription.value = product.sizeGuide.description || '';
  }
};

// Fetch product detail on mount
const isInitializing = ref(true);

onMounted(async () => {
  try {
    const detail = await fetchDetail(props.productId);
    if (detail) {
      populateForm(detail);
    }
  } catch (err) {
    alertType.value = 'error';
    alertMessage.value = 'Gagal memuat data produk.';
    showAlert.value = true;
  } finally {
    isInitializing.value = false;
  }
});

const submitForm = async () => {
  try {
    // 1. Update product basic data
    await updateProduct(props.productId, form.value);

    // 2. Upload new images (only non-existing ones)
    const newImages = images.value.filter((img) => !img.isExisting && img.file);
    if (newImages.length > 0) {
      const uploadedImageIds: string[] = [];
      for (const img of newImages) {
        const uploadResult = await uploadImage(props.productId, img.file!);
        if (uploadResult?.data?.id) {
          uploadedImageIds.push(uploadResult.data.id);
        }
      }

      // Set primary image if a new image is selected as primary
      const primaryImg = images.value[primaryIndex.value];
      if (primaryImg && !primaryImg.isExisting && uploadedImageIds.length > 0) {
        // Find the index of this new image among new images only
        const newImgIndex = newImages.indexOf(primaryImg);
        if (newImgIndex >= 0 && uploadedImageIds[newImgIndex]) {
          await setPrimaryImage(uploadedImageIds[newImgIndex]);
        }
      } else if (primaryImg && primaryImg.isExisting && primaryImg.existingId) {
        // Set existing image as primary
        await setPrimaryImage(primaryImg.existingId);
      }
    } else {
      // No new images, but primary might have changed
      const primaryImg = images.value[primaryIndex.value];
      if (primaryImg && primaryImg.isExisting && primaryImg.existingId) {
        await setPrimaryImage(primaryImg.existingId);
      }
    }

    // 3. Post group link jika diisi
    if (groupLink.value.trim()) {
      await postGroupLink(props.productId, { link: groupLink.value.trim() });
    }

    // 4. Post tags yang dipilih
    if (selectedTagIds.value.length > 0) {
      for (const tagId of selectedTagIds.value) {
        await postTag(props.productId, { tagId });
      }
    }

    // 5. Update existing sizes / Post new sizes
    if (Object.keys(selectedSizes.value).length > 0) {
      for (const [msid, stock] of Object.entries(selectedSizes.value)) {
        if (sizeRelationMap.value[msid]) {
          // Update existing size stock using Relation UUID
          const relationId = sizeRelationMap.value[msid];
          await putSize(props.productId, relationId, { stock });
        } else {
          // Add new size using Master Size ID
          await postSize(props.productId, { sizeId: msid, stock });
        }
      }
    }

    // 6. Post size guide jika ada file baru
    if (sizeGuideImage.value) {
      await postGuideSize(props.productId, sizeGuideImage.value, sizeGuideDescription.value);
    }

    // 7. Post specifications
    if (specs.value.length > 0) {
      for (const spec of specs.value) {
        if (spec.key.trim() && spec.value.trim()) {
          await postSpec(props.productId, { key: spec.key.trim(), value: spec.value.trim() });
        }
      }
    }

    alertType.value = 'success';
    alertMessage.value = 'Produk berhasil diperbarui!';
    showAlert.value = true;
    setTimeout(() => {
      navigationStore.actions.pop();
    }, 1500);
  } catch (error: any) {
    console.error('Failed to update product:', error);
    alertType.value = 'error';
    alertMessage.value = error?.response?.data?.message || 'Gagal memperbarui produk. Silakan coba lagi.';
    showAlert.value = true;
  }
};

// Alert State
const showAlert = ref(false);
const alertType = ref<AlertType>('info');
const alertMessage = ref('');
</script>

<template>
  <div class="px-6 py-4">
    <!-- Alert -->
    <div class="mb-4">
      <Alert
        :type="alertType"
        :message="alertMessage"
        :show="showAlert"
        :duration="alertType === 'error' ? 5000 : 0"
        @close="showAlert = false"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="isInitializing || isLoadingDetail"
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
        >Loading Product Data...</span
      >
    </div>

    <form v-else @submit.prevent="submitForm" class="flex flex-col gap-6">

      <!-- Image Upload Section -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-slate-700">Gambar Produk</label>

        <!-- Image Grid -->
        <div class="grid grid-cols-3 gap-3">
          <!-- Image Previews (existing + new) -->
          <div
            v-for="(img, index) in images"
            :key="index"
            class="relative aspect-square rounded-2xl overflow-hidden border-2 group transition-all"
            :class="primaryIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'"
          >
            <img :src="img.preview" alt="Preview" class="w-full h-full object-cover" />

            <!-- Primary Badge -->
            <span
              v-if="primaryIndex === index"
              class="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow"
            >
              Primary
            </span>

            <!-- Existing Badge -->
            <span
              v-if="img.isExisting"
              class="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full shadow"
            >
              Saved
            </span>

            <!-- Overlay Actions -->
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-1.5">
              <!-- Set Primary -->
              <button
                type="button"
                @click="primaryIndex = index"
                class="w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all"
                :class="primaryIndex === index ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'"
                title="Set sebagai gambar utama"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" :fill="primaryIndex === index ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
              <!-- Remove -->
              <button
                type="button"
                @click="removeImage(index)"
                class="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Add More Button -->
          <button
            type="button"
            @click="openImageSheet"
            class="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all hover:border-blue-300 hover:bg-blue-50/20"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span class="text-[10px] font-bold text-slate-400">Tambah</span>
          </button>
        </div>
      </div>

      <!-- Name -->
      <div class="flex flex-col gap-2">
        <label for="edit-name" class="text-sm font-bold text-slate-700">Nama Produk</label>
        <input
          id="edit-name"
          v-model="form.name"
          type="text"
          required
          placeholder="Contoh: The Venoms"
          class="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
        />
      </div>

      <!-- Price -->
      <div class="flex flex-col gap-2">
        <label for="edit-price" class="text-sm font-bold text-slate-700">Harga (Rp)</label>
        <input
          id="edit-price"
          :value="priceDisplay"
          @input="onPriceInput"
          type="text"
          inputmode="numeric"
          required
          placeholder="Contoh: 150.000"
          class="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
        />
      </div>

      <!-- Category -->
      <div class="flex flex-col gap-2">
        <label for="edit-category" class="text-sm font-bold text-slate-700">Kategori</label>
        <select
          id="edit-category"
          v-model="form.categoryId"
          required
          class="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
        >
          <option value="" disabled>Pilih Kategori</option>
          <option v-if="isLoadingCategories" value="" disabled>Loading categories...</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-2">
        <label for="edit-description" class="text-sm font-bold text-slate-700">Deskripsi</label>
        <textarea
          id="edit-description"
          v-model="form.description"
          required
          rows="4"
          placeholder="Jelaskan detail produk anda..."
          class="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
        ></textarea>
      </div>

      <!-- Tags -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-slate-700">Tags <span class="text-slate-400 font-medium">(Opsional)</span></label>
        <div v-if="isLoadingTags" class="text-[12px] text-slate-400 font-medium">Memuat tags...</div>
        <div v-else class="flex flex-wrap gap-2">
          <button
            v-for="tag in tags"
            :key="tag.id"
            type="button"
            @click="toggleTag(String(tag.id))"
            class="px-4 py-2 rounded-full text-[12px] font-bold border transition-all active:scale-95"
            :class="selectedTagIds.includes(String(tag.id))
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>

      <!-- Sizes -->
      <div class="flex flex-col gap-3">
        <label class="text-sm font-bold text-slate-700">Ukuran & Stok <span class="text-slate-400 font-medium">(Opsional)</span></label>
        <div v-if="isLoadingSizes" class="text-[12px] text-slate-400 font-medium">Memuat ukuran...</div>
        <div v-else class="flex flex-wrap gap-2">
          <button
            v-for="size in sizes"
            :key="size.id"
            type="button"
            @click="toggleSize(String(size.id))"
            class="px-4 py-2 rounded-full text-[12px] font-bold border transition-all active:scale-95"
            :class="String(size.id) in selectedSizes
              ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'"
          >
            {{ size.name }}
          </button>
        </div>

        <!-- Stock inputs for selected sizes -->
        <div v-if="Object.keys(selectedSizes).length > 0" class="flex flex-col gap-2 mt-1">
          <div
            v-for="size in sizes.filter(s => String(s.id) in selectedSizes)"
            :key="'stock-' + size.id"
            class="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100"
          >
            <span class="text-[13px] font-bold text-slate-700 w-16">{{ size.name }}</span>
            <input
              type="number"
              :value="selectedSizes[String(size.id)]"
              @input="updateStock(String(size.id), parseInt(($event.target as HTMLInputElement).value) || 0)"
              min="0"
              placeholder="Stok"
              class="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
            />
            <span class="text-[11px] text-slate-400 font-medium">pcs</span>
          </div>
        </div>
      </div>

      <!-- Size Guide -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-slate-700">Panduan Ukuran <span class="text-slate-400 font-medium">(Opsional)</span></label>
        
        <div
          v-if="displaySizeGuideUrl"
          class="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 group"
        >
          <img :src="displaySizeGuideUrl" alt="Size Guide" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" @click="openSizeGuideSheet" class="px-4 py-2 bg-white text-slate-700 rounded-xl text-xs font-bold shadow-lg">Ganti</button>
            <button type="button" @click="removeSizeGuide" class="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg">Hapus</button>
          </div>
        </div>
        <button
          v-else
          type="button"
          @click="openSizeGuideSheet"
          class="w-full h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all hover:border-blue-300 hover:bg-blue-50/20"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span class="text-[11px] font-bold text-slate-400">Upload gambar panduan ukuran</span>
        </button>

        <input
          v-model="sizeGuideDescription"
          type="text"
          placeholder="Deskripsi panduan ukuran (opsional)"
          class="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
        />
      </div>

      <!-- Specifications -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-bold text-slate-700">Spesifikasi <span class="text-slate-400 font-medium">(Opsional)</span></label>
          <button
            type="button"
            @click="addSpec"
            class="flex items-center gap-1 text-[12px] font-bold text-blue-600 active:scale-95 transition-all"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Tambah
          </button>
        </div>

        <div v-if="specs.length === 0" class="text-[12px] text-slate-400 font-medium">Belum ada spesifikasi. Klik "Tambah" untuk menambahkan.</div>

        <div
          v-for="(spec, index) in specs"
          :key="index"
          class="flex items-start gap-2"
        >
          <input
            v-model="spec.key"
            type="text"
            placeholder="Label (cth: Packaging)"
            class="flex-1 bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
          />
          <input
            v-model="spec.value"
            type="text"
            placeholder="Nilai (cth: Box & Zip Lock)"
            class="flex-1 bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
          />
          <button
            type="button"
            @click="removeSpec(index)"
            class="flex-shrink-0 w-9 h-9 mt-0.5 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all active:scale-95"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- PO Status -->
      <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <input
          id="edit-isPo"
          v-model="form.isPo"
          type="checkbox"
          class="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
        />
        <label for="edit-isPo" class="text-sm font-bold text-slate-700">Produk Pre-Order (PO)</label>
      </div>

      <!-- PO DP Percent -->
      <div v-if="form.isPo" class="flex flex-col gap-2">
        <label for="edit-poDpPercent" class="text-sm font-bold text-slate-700">Persentase DP (%)</label>
        <input
          id="edit-poDpPercent"
          v-model.number="form.poDpPercent"
          type="number"
          required
          min="1"
          max="100"
          placeholder="Contoh: 75"
          class="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
        />
      </div>

      <!-- Group Link (Optional) -->
      <div class="flex flex-col gap-2">
        <label for="edit-groupLink" class="text-sm font-bold text-slate-700">Link Grup WhatsApp <span class="text-slate-400 font-medium">(Opsional)</span></label>
        <input
          id="edit-groupLink"
          v-model="groupLink"
          type="url"
          placeholder="https://chat.whatsapp.com/..."
          class="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all"
        />
      </div>

      <div class="pt-4 pb-8">
        <Button
          type="submit"
          :loading="isSubmitting"
          block
          size="lg"
          class="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-amber-500/30"
        >
          Update Produk
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

    <!-- BottomSheet for Image Upload -->
    <BottomSheet :show="showImageSheet" title="Upload Gambar" @close="closeImageSheet">
      <div class="flex flex-col gap-4">
        <button
          type="button"
          @click="triggerFileInput"
          class="flex items-center gap-4 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 active:scale-[0.98] transition-all"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div class="text-left">
            <h4 class="text-sm font-bold text-slate-800">Pilih dari Galeri</h4>
            <p class="text-[11px] text-slate-400 font-medium">JPG, PNG, WEBP (maks 5MB)</p>
          </div>
        </button>

        <button
          type="button"
          @click="triggerFileInput"
          class="flex items-center gap-4 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 active:scale-[0.98] transition-all"
        >
          <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <div class="text-left">
            <h4 class="text-sm font-bold text-slate-800">Ambil Foto</h4>
            <p class="text-[11px] text-slate-400 font-medium">Gunakan kamera perangkat</p>
          </div>
        </button>
      </div>
    </BottomSheet>

    <!-- Hidden file input for size guide -->
    <input
      ref="sizeGuideInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onSizeGuideChange"
    />

    <!-- BottomSheet for Size Guide Upload -->
    <BottomSheet :show="showSizeGuideSheet" title="Upload Panduan Ukuran" @close="closeSizeGuideSheet">
      <div class="flex flex-col gap-4">
        <button
          type="button"
          @click="triggerSizeGuideInput"
          class="flex items-center gap-4 w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 active:scale-[0.98] transition-all"
        >
          <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div class="text-left">
            <h4 class="text-sm font-bold text-slate-800">Pilih Gambar Panduan</h4>
            <p class="text-[11px] text-slate-400 font-medium">JPG, PNG, WEBP (maks 5MB)</p>
          </div>
        </button>
      </div>
    </BottomSheet>
  </div>

</template>
