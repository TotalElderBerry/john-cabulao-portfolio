<script setup lang="ts">
import TradeWall from '~/components/work/TradeWall.vue'
import { TRADES, tradeCounts, type Trade } from '~~/shared/jobs'

const route = useRoute()
const slug = String(route.params.trade)
const jobs = await useJobs()
if (!(TRADES as readonly string[]).includes(slug) || tradeCounts(jobs)[slug as Trade] === 0) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}
const label = slug[0]!.toUpperCase() + slug.slice(1)
usePageSeo({
  title: `${label} take-offs — John Louis Cabulao`,
  description: `${tradeCounts(jobs)[slug as Trade]} measured ${slug} packages by John Louis Cabulao: marked-up sheets with a colour legend and a BOQ.`,
})
</script>

<template>
  <TradeWall :jobs="jobs" :active="slug as Trade" as="h1" />
</template>
