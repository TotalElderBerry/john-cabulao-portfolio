<script setup lang="ts">
import { TRADES, jobId, tradeCounts } from '~~/shared/jobs'

const HERO_PROJECT = 'aged-care-residence'
const SCAN_JOB = 'plastering-01'

const [site, jobs, projects] = await Promise.all([useSite(), useJobs(), useProjects()])

const counts = computed(() => {
  const c = tradeCounts(jobs)
  return { projects: projects.length, jobs: c.all, trades: TRADES.filter((t) => c[t] > 0).length }
})
const scanJob = computed(() => jobs.find((j) => jobId(j) === SCAN_JOB) ?? null)

usePageSeo({
  title: `${site.name} — ${site.role}`,
  description: site.statement.replace(/\*/g, ''),
})
</script>

<template>
  <div class="home">
    <HomeHeroMeasured
      :hero-project-slug="HERO_PROJECT"
      :scan-job-id="SCAN_JOB"
      :counts="counts"
      :site="site"
      :projects="projects"
      :jobs="jobs"
    />
    <!-- Below the fold: hydrated when scrolled into view, so their JS and hydration work stay off the LCP path. -->
    <LazyHomeStatementReveal hydrate-on-visible :statement="site.statement" />
    <!-- The scan hydrates eagerly: its quantities are scroll-driven from the top of the page. -->
    <HomeTakeoffScan v-if="scanJob" :job="scanJob" />
    <LazyHomeMultiGallery hydrate-on-visible :projects="projects" />
    <LazyWorkTradeWall hydrate-on-visible :jobs="jobs" :limit="12">
      <template #foot>
        <NuxtLink :to="'/single-trade/'">See all {{ counts.jobs }} jobs →</NuxtLink>
      </template>
    </LazyWorkTradeWall>
    <LazySiteContactBand hydrate-on-visible :site="site" />
  </div>
</template>
