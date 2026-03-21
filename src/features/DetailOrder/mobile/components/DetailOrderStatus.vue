<script setup lang="ts">
defineProps<{
  statusLabel: string;
}>();
</script>

<template>
  <div class="px-4 py-4 mt-2">
    <div class="bg-[#0F172A] rounded-t-xl px-5 py-4 flex items-center">
      <h2 class="text-white text-[16px] font-extrabold tracking-tight">{{ statusLabel }}</h2>
    </div>
  </div>
</template>
