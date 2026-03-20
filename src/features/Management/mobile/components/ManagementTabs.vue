<script setup lang="ts">
/**
 * ManagementTabs - Horizontal scrollable tabs for management sections
 */
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const tabs = ["Product", "Category", "Tags", "Discount", "Size", "Hero"];

const handleTabClick = (tab: string) => {
  emit("update:modelValue", tab);
};
</script>

<template>
  <div class="w-full bg-white border-b border-gray-100 flex items-center h-14 relative z-50">
    <div class="flex overflow-x-auto scrollbar-hide h-full items-center px-2">
      <div 
        v-for="(tab, index) in tabs" 
        :key="tab"
        class="flex items-center h-full"
      >
        <!-- Tab Item -->
        <button
          @click="handleTabClick(tab)"
          class="px-5 transition-all relative whitespace-nowrap h-full flex items-center justify-center min-w-[100px]"
          :class="modelValue === tab ? 'text-[#0F172A]' : 'text-[#64748B]'"
        >
          <span class="text-[13px] font-bold tracking-tight">
            {{ tab }}
          </span>
          
          <!-- Active Underline -->
          <div
            v-if="modelValue === tab"
            class="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0F172A] rounded-t-full mx-3 shadow-[0_-2px_6px_rgba(15,23,42,0.1)]"
          ></div>
        </button>

        <!-- Vertical Divider (Pipe) -->
        <div 
          v-if="index < tabs.length - 1"
          class="h-4 w-[1px] bg-slate-200/50 mx-1"
        ></div>
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
