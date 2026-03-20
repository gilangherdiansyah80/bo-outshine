<script setup lang="ts">
import DashboardWelcome from "../components/DashboardWelcome.vue";
import DashboardStats from "../components/DashboardStats.vue";
import OrderChart from "../components/OrderChart.vue";

/**
 * DashboardScreen - Mobile dashboard overview screen.
 * This file serves as a container for dashboard sub-components.
 */
</script>

<template>
  <div class="h-screen bg-white -mt-5 pt-3">
    <!-- Header/Welcome Section -->
    <DashboardWelcome />

    <!-- Stats Cards Section (Horizontal scroll) -->
    <DashboardStats />

    <!-- Order Chart Section (Trends & Filters) -->
    <OrderChart />
  </div>
</template>
