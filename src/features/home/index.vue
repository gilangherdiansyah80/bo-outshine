<script setup lang="ts">
import { useViewport } from '@/shared/hooks/use-viewport'
import HomeMobile from './mobile/index.vue'
import HomeWeb from './web/index.vue'

const { isMobile } = useViewport()
</script>

<template>
  <HomeMobile v-if="isMobile" />
  <HomeWeb v-else />
</template>
