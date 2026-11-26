<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import { TRADES, jobId, jobPath, tradeCounts, type Trade } from '~~/shared/jobs'
import type { Job } from '~~/shared/schemas'

const props = withDefaults(
  defineProps<{ jobs: Job[]; active?: Trade | 'all'; limit?: number; as?: 'h1' | 'h2' }>(),
  { active: 'all', as: 'h2' },
)

const counts = computed(() => tradeCounts(props.jobs))
const filters = computed(() => [
  { key: 'all' as const, label: 'All', to: '/single-trade/', n: counts.value.all },
  ...TRADES.filter((t) => counts.value[t] > 0).map((t) => ({
    key: t,
    label: t[0]!.toUpperCase() + t.slice(1),
    to: `/single-trade/${t}/`,
    n: counts.value[t],
  })),
])
const shown = computed(() => {
  const list = props.active === 'all' ? props.jobs : props.jobs.filter((j) => j.trade === props.active)
  return props.limit ? list.slice(0, props.limit) : list
})
const pad = (n: number) => String(n).padStart(2, '0')
const cap = (t: string) => t[0]!.toUpperCase() + t.slice(1)
</script>

<template>
  <section id="wall" class="wall">
    <header>
      <component :is="as">Single trades</component>
      <p class="lede">
        {{ counts.all }} measured packages. Every tile is a real marked-up sheet. Hover to see it in colour, click to open the job.
      </p>
    </header>
    <nav class="filters" aria-label="Filter by trade">
      <NuxtLink
        v-for="f in filters"
        :key="f.key"
        :to="f.to"
        :class="{ on: f.key === active }"
        :aria-current="f.key === active ? 'page' : undefined"
      >{{ f.label }}<sup class="num">{{ f.n }}</sup></NuxtLink>
    </nav>
    <div class="grid">
      <NuxtLink v-for="j in shown" :key="jobId(j)" :to="jobPath(j)" class="tile">
        <MediaImg
          kind="jobs"
          :id="jobId(j)"
          :alt="`Marked-up ${j.trade} take-off sheet`"
          sizes="(max-width: 760px) 50vw, 20vw"
        />
        <span class="cap"><b>{{ cap(j.trade) }} · Job {{ pad(j.job) }}</b><span>{{ j.projectType }}</span></span>
      </NuxtLink>
    </div>
    <p class="foot">
      <slot name="foot">Sheets shown with client names and title blocks removed.</slot>
    </p>
  </section>
</template>

<style scoped>
.wall { padding: 12vh max(16px, 4vw); }
header { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 4vw; margin-bottom: 5vh; }
header :is(h1, h2) { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; margin: 0; line-height: .9; }
.lede { font-size: 14px; line-height: 1.55; color: #555; max-width: 360px; margin: 0; }
.filters { display: flex; flex-wrap: wrap; gap: 6px 22px; margin-bottom: 4vh; font-size: 14px; border-top: 1px solid var(--ink); padding-top: 16px; }
.filters a { color: var(--mute); transition: color .2s; }
.filters sup { font-size: 10px; margin-left: 3px; }
.filters a.on, .filters a:hover { color: var(--ink); }
.filters a.on { box-shadow: inset 0 -1px 0 var(--accent); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
.tile { position: relative; display: block; aspect-ratio: 640/453; overflow: hidden; background: var(--soft); transition: transform .35s, box-shadow .35s; }
.tile :deep(.media) { height: 100%; }
.tile :deep(img), .tile :deep(.media-placeholder) { width: 100%; height: 100%; object-fit: cover; }
.tile :deep(img) { transition: transform .6s cubic-bezier(.2,.7,.2,1), filter .4s; filter: grayscale(.85) contrast(1.05); }
.tile :deep(.media-placeholder) { aspect-ratio: auto !important; font-size: 11px; }
.tile:hover, .tile:focus-visible { box-shadow: 0 10px 28px rgba(0, 0, 0, .18); z-index: 1; }
.tile:hover :deep(img), .tile:focus-visible :deep(img) { transform: scale(1.06); filter: none; }
.cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 8px 10px; font-size: 11px; display: flex; justify-content: space-between; gap: 8px; background: rgba(255, 255, 255, .95); transform: translateY(100%); transition: transform .3s; }
.cap b { font-weight: 400; }
.tile:hover .cap, .tile:focus-visible .cap { transform: none; }
@media (hover: none) {
  .cap { transform: none; }
  .tile :deep(img) { filter: none; }
}
.foot { margin-top: 3vh; font-size: 13px; color: var(--mute); }
@media (max-width: 760px) {
  header { grid-template-columns: 1fr; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
