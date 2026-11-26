<script setup lang="ts">
import ContactBand from '~/components/site/ContactBand.vue'
import { jobId, jobPath } from '~~/shared/jobs'

const [site, jobs] = await Promise.all([useSite(), useJobs()])
const exampleFor = (id?: string) => {
  const j = id ? jobs.find((x) => jobId(x) === id) : undefined
  return j ? jobPath(j) : null
}
const steps = [
  { t: 'Send drawings', d: 'Share a link to the set, with the trades and the deadline.' },
  { t: 'Take-off', d: 'Every item is measured on screen and marked up on the sheets.' },
  { t: 'BOQ delivered', d: 'A measured BOQ in Excel, with notes and assumptions.' },
]
const types = ['Fit-outs', 'New builds', 'Refurbishments']
const pad = (n: number) => String(n).padStart(2, '0')
usePageSeo({
  title: 'Services · Cabulao',
  description: `${site.services.map((s) => s.title).join(', ')} — measured from your drawings by ${site.name}, ${site.role.toLowerCase()}.`,
})
</script>

<template>
  <div>
    <section class="pg">
      <h1>Services</h1>
      <p class="sub">Four ways to get your quantities and costs measured.</p>
      <article v-for="(s, i) in site.services" :key="s.title" class="svc">
        <span class="n">{{ pad(i + 1) }}</span>
        <h2>{{ s.title }}</h2>
        <div class="cols">
          <div><h3>What you send</h3><p>{{ s.send }}</p></div>
          <div>
            <h3>What you get</h3>
            <p>{{ s.get }}</p>
            <NuxtLink v-if="exampleFor(s.example)" :to="exampleFor(s.example)!" class="ex">See an example →</NuxtLink>
          </div>
        </div>
      </article>

      <h2 class="big">How it works</h2>
      <ol class="steps">
        <li v-for="(st, i) in steps" :key="st.t">
          <span class="n">{{ pad(i + 1) }}</span>
          <b>{{ st.t }}</b>
          <span>{{ st.d }}</span>
        </li>
      </ol>

      <h2 class="big">Project types</h2>
      <p class="types">{{ types.join(' · ') }}</p>
    </section>
    <ContactBand :site="site" />
  </div>
</template>

<style scoped>
.pg { padding: 14vh max(16px, 4vw) 10vh; }
h1, .big { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; line-height: .9; margin: 0; }
.big { margin-top: 12vh; }
.sub { font-size: 13px; color: var(--mute); margin: 18px 0 6vh; }
.svc { display: grid; grid-template-columns: 70px minmax(0, 1fr); gap: 0 24px; padding: 28px 0 36px; border-top: 1px solid var(--line); }
.svc:first-of-type { border-top-color: var(--ink); }
.svc:last-of-type { border-bottom: 1px solid var(--line); }
.n { font-size: 12px; color: var(--mute); font-variant-numeric: tabular-nums; padding-top: 10px; }
.svc h2 { grid-column: 2; font-weight: 300; font-size: clamp(28px, 4vw, 60px); letter-spacing: -.03em; line-height: 1; margin: 0 0 24px; }
.svc .n { grid-row: 1; }
.cols { grid-column: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 24px 4vw; }
h3 { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--mute); font-weight: 400; margin: 0 0 8px; }
.cols p { margin: 0; font-size: 17px; line-height: 1.55; max-width: 46ch; }
.ex { display: inline-block; margin-top: 16px; font-size: 14px; color: var(--accent); border-bottom: 1px solid var(--accent); }
.steps { list-style: none; padding: 0; margin: 6vh 0 0; border-top: 1px solid var(--ink); }
.steps li { display: grid; grid-template-columns: 70px minmax(0, 1fr) minmax(0, 1.4fr); gap: 24px; align-items: baseline; padding: 22px 0; border-bottom: 1px solid var(--line); }
.steps b { font-weight: 300; font-size: clamp(24px, 3vw, 44px); letter-spacing: -.03em; }
.steps li span:last-child { font-size: 16px; color: var(--mute); line-height: 1.5; }
.steps .n { padding: 0; }
.types { font-size: clamp(24px, 3.4vw, 52px); font-weight: 200; letter-spacing: -.03em; margin: 5vh 0 0; }
@media (max-width: 760px) {
  .pg { padding: 12vh 16px 8vh; }
  .svc { grid-template-columns: minmax(0, 1fr); }
  .svc h2, .cols { grid-column: 1; }
  .svc .n { grid-row: auto; padding: 0 0 8px; }
  .cols { grid-template-columns: 1fr; }
  .steps li { grid-template-columns: minmax(0, 1fr); gap: 6px; }
}
</style>
