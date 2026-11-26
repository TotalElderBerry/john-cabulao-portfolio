<script setup lang="ts">
import TradeWall from '~/components/work/TradeWall.vue'
const jobs = await useJobs()
useSeoMeta({
  title: 'Single-trade take-offs — John Louis Cabulao',
  description: `${jobs.length} single-trade measured packages: plastering, painting, carpentry, tiling and masonry.`,
})
</script>

<template>
  <TradeWall :jobs="jobs" active="all" as="h1" />
</template>
