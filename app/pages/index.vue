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

useSeoMeta({
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
    <HomeStatementReveal :statement="site.statement" />
    <HomeTakeoffScan v-if="scanJob" :job="scanJob" />
    <HomeMultiGallery :projects="projects" />
    <SiteContactBand :site="site" />
  </div>
</template>
