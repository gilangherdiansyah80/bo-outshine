<script setup lang="ts">
import { useHome } from "@/services/home.service";

const { data, isLoading } = useHome();
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else style="padding: 2rem">
    <h1 class="text-red-500">Welcome to bo-outshine - Web</h1>
    <p>Gilang Architecture Folder (GAF)</p>
    <ul v-if="data">
      <li v-for="item in data" :key="item.id">{{ item.title }}</li>
    </ul>
  </div>
</template>
