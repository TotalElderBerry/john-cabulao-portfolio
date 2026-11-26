<script setup lang="ts">
import TradeWall from '~/components/work/TradeWall.vue'
const jobs = await useJobs()
usePageSeo({
  title: 'Single-trade take-offs — John Louis Cabulao',
  description: `${jobs.length} single-trade measured packages: plastering, painting, carpentry, tiling and masonry. Marked-up sheets with a colour legend and a BOQ.`,
})
</script>

<template>
  <TradeWall :jobs="jobs" active="all" as="h1" />
</template>
