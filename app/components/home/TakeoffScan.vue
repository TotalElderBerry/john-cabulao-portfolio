<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import type { Job } from '~~/shared/schemas'
import { formatQty, jobId } from '~~/shared/jobs'

const props = defineProps<{ job: Job }>()

const id = computed(() => jobId(props.job))
const items = computed(() => props.job.legend.slice(0, 4))
const kicker = computed(() =>
  [props.job.trade.charAt(0).toUpperCase() + props.job.trade.slice(1), `Job ${String(props.job.job).padStart(2, '0')}`, props.job.projectType]
    .filter(Boolean)
    .join(' · '),
)

// The prerendered HTML (and reduced motion) shows the finished take-off; once mounted with motion
// allowed, the scan line and the quantities follow the pinned section's scroll progress.
const el = ref<HTMLElement | null>(null)
const progress = useScrollProgress(el)
const reduced = useReducedMotion()
const mounted = ref(false)
onMounted(() => { mounted.value = true })
const p = computed(() => (mounted.value && !reduced.value ? Math.min(progress.value * 1.15, 1) : 1))

const decimals = (n: number) => (String(n).split('.')[1] ?? '').length
function qty(q: number, unit: string): { n: string; u: string } {
  const d = decimals(q)
  const v = p.value >= 1 ? q : Math.round(q * p.value * 10 ** d) / 10 ** d
  const s = formatQty(v, unit)
  const cut = s.lastIndexOf(' ')
  return { n: s.slice(0, cut), u: s.slice(cut + 1) }
}
</script>

<template>
  <section id="scan" ref="el" class="scan" :style="{ '--p': `${p * 100}%` }">
    <div class="pin">
      <div class="plate">
        <MediaImg class="grey" kind="jobs" :id="id" alt="" sizes="(max-width: 760px) 100vw, 70vw" />
        <MediaImg
          class="col"
          kind="jobs"
          :id="id"
          :alt="`${kicker} — marked-up take-off sheet`"
          sizes="(max-width: 760px) 100vw, 70vw"
        />
        <div class="line" aria-hidden="true" />
      </div>
      <div class="side">
        <small>{{ kicker }}</small>
        <h2>One floor,<br>measured live.</h2>
        <div v-for="it in items" :key="it.label" class="q">
          <span><i :style="{ background: it.color }" />{{ it.label }}</span>
          <b class="num">{{ qty(it.qty, it.unit).n }}<u>{{ qty(it.qty, it.unit).u }}</u></b>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scan { height: 320vh; position: relative; }
.pin {
  position: sticky; top: 0; height: 100vh;
  display: grid; grid-template-columns: 1fr 340px; gap: 4vw; padding: 12vh 4vw 8vh; align-items: center;
}
.plate { position: relative; height: 100%; overflow: hidden; background: #f4f4f4; }
/* 113% tall: the sheet's redacted title-block strip along the bottom falls outside the plate. */
.plate > :deep(*) { position: absolute; left: 0; top: 0; width: 100%; height: 113%; }
.plate :deep(.media img) { width: 100%; height: 100%; object-fit: cover; }
.plate > :deep(.grey) { filter: grayscale(1) contrast(.7) brightness(1.15); }
.plate > :deep(.col) { clip-path: inset(0 calc(100% - var(--p, 0%)) 0 0); }
.plate .line {
  position: absolute; top: 0; bottom: 0; left: var(--p, 0%); width: 2px;
  background: var(--accent); box-shadow: 0 0 0 6px rgba(59, 85, 230, .12);
}
.side small { font-size: 12px; color: var(--mute); letter-spacing: .1em; text-transform: uppercase; }
.side h2 { font-weight: 300; font-size: 38px; line-height: 1.05; margin: 10px 0 34px; letter-spacing: -.02em; }
.q {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  padding: 14px 0; border-top: 1px solid var(--line); font-size: 14px;
}
.q:last-of-type { border-bottom: 1px solid var(--line); }
.q i { display: inline-block; width: 10px; height: 10px; margin-right: 10px; vertical-align: -1px; }
.q b { font-weight: 300; font-size: 30px; letter-spacing: -.02em; white-space: nowrap; }
.q b u { text-decoration: none; font-size: 13px; color: var(--mute); margin-left: 4px; }

@media (max-width: 760px) {
  .scan { height: 260vh; }
  .pin {
    grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) auto;
    gap: 20px; padding: 80px 16px 24px; align-items: stretch;
  }
  .side h2 { font-size: 26px; margin: 6px 0 14px; }
  .q { padding: 9px 0; font-size: 13px; }
  .q b { font-size: 22px; }
}
</style>
