<script setup lang="ts">
import { ref } from "vue";
import OrderTabs from "../components/OrderTabs.vue";
import OrderList from "../components/OrderList.vue";

/**
 * OrderScreen - Manages the state and layout for the mobile order view
 */

const activeTab = ref("all");
</script>

<template>
  <div class="flex flex-col h-full bg-[#f6f6f6] min-h-screen">
    <!-- Tabs Container -->
    <div class="sticky top-0 z-20 bg-white">
      <OrderTabs v-model:activeTab="activeTab" />
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col relative z-10">
      <OrderList :activeTab="activeTab" />
    </main>
  </div>
</template>
