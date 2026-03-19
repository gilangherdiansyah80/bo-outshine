<script setup lang="ts">
import { useHome } from '@/services/home.service'

const { data, isLoading } = useHome()
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else style="padding: 1rem">
    <h1>Welcome to bo-outshine - Mobile</h1>
    <p>Gilang Architecture Folder (GAF)</p>
    <ul v-if="data">
      <li v-for="item in data" :key="item.id">{{ item.title }}</li>
    </ul>
  </div>
</template>
