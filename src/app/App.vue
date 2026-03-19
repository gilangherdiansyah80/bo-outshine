<script setup lang="ts">
import { useViewport } from '@/shared/hooks/use-viewport'
import HomeMobile from '@/features/home/mobile/index.vue'
import HomeWeb from '@/features/home/web/index.vue'

const { isMobile } = useViewport()
</script>

<template>
  <HomeMobile v-if="isMobile" />
  <HomeWeb v-else />
</template>
