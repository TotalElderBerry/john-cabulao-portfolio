<script setup lang="ts">
import SheetViewer from '~/components/work/SheetViewer.vue'
import BoqLink from '~/components/work/BoqLink.vue'
import LegendPanel from '~/components/work/LegendPanel.vue'
import ContactBand from '~/components/site/ContactBand.vue'
import { TRADES, jobId, jobPath, neighbours } from '~~/shared/jobs'
import { mediaFor } from '~~/shared/media'

const route = useRoute()
const trade = String(route.params.trade)
const raw = String(route.params.n)
const n = /^\d+$/.test(raw) ? Number(raw) : NaN

const [job, jobs, site] = await Promise.all([
  (TRADES as readonly string[]).includes(trade) && Number.isInteger(n) ? useJob(trade, n) : Promise.resolve(null),
  useJobs(),
  useSite(),
])
if (!job) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const pad = (x: number) => String(x).padStart(2, '0')
const label = trade[0]!.toUpperCase() + trade.slice(1)
const title = `${label} — Job ${pad(job.job)}`
const id = jobId(job)
const media = mediaFor(useManifest(), 'jobs', id)
const page = ref(1)
const { prev, next } = neighbours(jobs, job)

const meta = [
  { k: 'Project type', v: job.projectType },
  { k: 'Measured in', v: job.tool },
  { k: 'Scope', v: job.scope },
  { k: 'Delivered', v: 'Markups + BOQ' },
].filter((m): m is { k: string; v: string } => typeof m.v === 'string' && m.v.trim() !== '')

useHead({ title: `${title} · Cabulao` })
</script>

<template>
  <div>
    <section class="job">
      <nav class="crumb" aria-label="Breadcrumb">
        <NuxtLink to="/single-trade/">Single trades</NuxtLink> /
        <NuxtLink :to="`/single-trade/${trade}/`">{{ label }}</NuxtLink> /
        <b aria-current="page">Job {{ pad(job.job) }}</b>
      </nav>
      <h1>{{ title }}</h1>
      <dl class="meta">
        <div v-for="m in meta" :key="m.k"><dt>{{ m.k }}</dt><dd>{{ m.v }}</dd></div>
      </dl>

      <div class="body" :class="{ solo: !job.legend.length && !job.boqDownload }">
        <SheetViewer
          v-model:page="page"
          :job-id="id"
          :pages="media?.pages ?? 1"
          :ratio="media?.ratio"
          :alt="`Marked-up ${trade} take-off sheet, job ${pad(job.job)}`"
        />
        <LegendPanel v-if="job.legend.length || job.boqDownload" :items="job.legend">
          <a v-if="job.boqDownload" :href="`/media/jobs/${id}/boq.pdf`" download>BOQ (PDF) <span aria-hidden="true">↓</span></a>
        </LegendPanel>
      </div>

      <BoqLink v-if="job.flagship && job.boq?.length" :job-id="id" :lines="job.boq" :ratio="media?.ratio" />

      <nav class="pn" aria-label="Other jobs">
        <NuxtLink v-if="prev" :to="jobPath(prev)" class="prev">
          <small>← Prev</small> {{ label }} · Job {{ pad(prev.job) }}
        </NuxtLink>
        <NuxtLink v-if="next" :to="jobPath(next)" class="next">
          <small>Next →</small> {{ label }} · Job {{ pad(next.job) }}
        </NuxtLink>
      </nav>
    </section>
    <ContactBand :site="site" />
  </div>
</template>

<style scoped>
.job { background: var(--soft); padding: 14vh max(16px, 4vw) 10vh; }
.crumb { font-size: 12px; color: var(--mute); margin-bottom: 18px; }
.crumb a:hover, .crumb a:focus-visible { color: var(--ink); }
.crumb b { color: var(--ink); font-weight: 400; }
h1 { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; line-height: .9; margin: 0; }
.meta { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--ink); margin: 5vh 0 4vh; }
.meta div { padding: 14px 16px 14px 0; font-size: 13px; color: var(--mute); }
.meta dd { display: block; color: var(--ink); font-weight: 400; font-size: 17px; margin: 4px 0 0; }
.body { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 3vw; align-items: start; }
.body.solo { grid-template-columns: minmax(0, 1fr); }
.pn { display: flex; justify-content: space-between; gap: 24px; margin-top: 8vh; border-top: 1px solid var(--ink); padding-top: 18px; font-size: 17px; }
.pn small { display: block; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); margin-bottom: 4px; }
.pn .next { margin-left: auto; text-align: right; }
.pn a:hover, .pn a:focus-visible { color: var(--accent); }
@media (max-width: 760px) {
  .job { padding: 12vh 16px 8vh; }
  .meta { grid-template-columns: 1fr 1fr; }
  .body { grid-template-columns: minmax(0, 1fr); gap: 32px; }
}
</style>
