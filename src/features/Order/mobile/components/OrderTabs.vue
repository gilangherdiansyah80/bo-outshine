<script setup lang="ts">
/**
 * OrderTabs - Horizontal navigation for filtering orders by status
 */

defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: "update:activeTab", value: string): void;
}>();

const tabs = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Belum Bayar" },
  { id: "processing", label: "Dikemas" },
  { id: "shipping", label: "Dikirim" },
  { id: "completed", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" },
];

const handleTabClick = (id: string) => {
  emit("update:activeTab", id);
};
</script>

<template>
  <div
    class="bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide whitespace-nowrap"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="handleTabClick(tab.id)"
      class="relative py-4 px-4 text-center transition-all duration-300 group"
    >
      <span
        class="text-[14px] font-bold transition-colors duration-300"
        :class="
          activeTab === tab.id
            ? 'text-slate-900'
            : 'text-slate-400 group-hover:text-slate-600'
        "
      >
        {{ tab.label }}
      </span>

      <!-- Active Underline -->
      <div
        v-if="activeTab === tab.id"
        class="absolute bottom-0 left-4 right-4 h-[3px] bg-slate-800 rounded-t-full"
      ></div>

      <!-- Divider -->
      <div
        v-if="tab.id !== 'cancelled'"
        class="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-4 bg-gray-200"
      ></div>
    </button>
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
