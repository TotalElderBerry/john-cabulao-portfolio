<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import { mediaFor } from '~~/shared/media'
import { zoomToRect } from '~~/shared/zoom'
import { formatNumber } from '~~/shared/jobs'
import type { BoqLine } from '~~/shared/schemas'

const props = withDefaults(
  defineProps<{ jobId: string; lines: BoqLine[]; ratio?: number }>(),
  { ratio: 1.414 },
)

const active = ref<number | null>(null)
const sheet = ref(1)
const hasMedia = computed(() => mediaFor(useManifest(), 'jobs', props.jobId) !== null)

const zoom = computed(() => {
  const l = active.value === null ? null : props.lines[active.value]
  return l ? zoomToRect(l.hotspot) : null
})
const stageStyle = computed(() =>
  hasMedia.value && zoom.value
    ? { transform: `translate(${zoom.value.tx.toFixed(3)}%, ${zoom.value.ty.toFixed(3)}%) scale(${zoom.value.scale.toFixed(3)})` }
    : undefined,
)
const boxStyle = computed(() => {
  const b = zoom.value?.box
  return hasMedia.value && b
    ? { left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }
    : undefined
})
const hud = computed(() => {
  const l = active.value === null ? null : props.lines[active.value]
  return l ? (l.note ?? l.description) : 'Level plan · whole sheet'
})

// Quantity and unit sit in separate columns, so format the number alone (2 dp as in the BOQ).
const qty = (l: BoqLine) => formatNumber(l.qty, l.unit, { fixed: true })

function select(i: number) {
  active.value = i
  sheet.value = props.lines[i]!.sheet
}
function reset() { active.value = null }
</script>

<template>
  <section class="link" aria-labelledby="boq-h">
    <header>
      <h2 id="boq-h">From drawing to line item.</h2>
      <p>Select a line. The drawing zooms to where that quantity was measured.</p>
    </header>
    <div class="pair">
      <div class="view" :class="{ zoomed: !!boxStyle }" :style="{ aspectRatio: String(ratio) }">
        <div class="stage" data-stage :style="stageStyle">
          <MediaImg :key="sheet" kind="jobs" :id="jobId" :page="sheet" alt="Marked-up take-off sheet, whole sheet" sizes="(max-width: 760px) 100vw, 55vw" />
        </div>
        <div class="box" :style="boxStyle" aria-hidden="true" />
        <span class="hud" aria-live="polite" aria-atomic="true">{{ hud }}</span>
        <button type="button" class="reset" @click="reset">Whole sheet</button>
      </div>
      <div class="boq">
        <div class="hd" aria-hidden="true"><span>Ref</span><span>Item</span><span>Qty</span><span>Unit</span></div>
        <button
          v-for="(l, i) in lines"
          :key="l.ref"
          type="button"
          class="line"
          :aria-pressed="active === i"
          @click="select(i)"
        >
          <span class="ref">{{ l.ref }}</span>
          <span class="d">{{ l.description }}<small>{{ l.note ?? 'Measured on plan' }}</small></span>
          <span class="q">{{ qty(l) }}</span>
          <span class="u">{{ l.unit }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.link { margin-top: 12vh; }
header { margin-bottom: 5vh; }
h2 { font-size: clamp(30px, 4vw, 56px); font-weight: 200; letter-spacing: -.04em; line-height: 1; margin: 0 0 12px; }
header p { margin: 0; font-size: 14px; color: var(--mute); }
.pair { display: grid; grid-template-columns: 1.25fr 1fr; gap: 3vw; align-items: start; }
.view { position: sticky; top: 90px; overflow: hidden; background: #fff; border: 1px solid var(--line); }
.stage { position: absolute; left: 0; top: 0; width: 100%; transform-origin: 0 0; transition: transform 1s cubic-bezier(.6, 0, .2, 1); }
.box {
  position: absolute; border: 2px solid var(--accent); background: rgba(59, 85, 230, .08);
  opacity: 0; pointer-events: none; transition: all 1s cubic-bezier(.6, 0, .2, 1);
}
.view.zoomed .box { opacity: 1; }
.hud { position: absolute; left: 12px; top: 12px; max-width: calc(100% - 130px); font-size: 11px; background: var(--ink); color: #fff; padding: 5px 8px; }
.reset { position: absolute; right: 12px; top: 12px; font: inherit; font-size: 11px; background: #fff; border: 1px solid var(--ink); padding: 4px 8px; cursor: pointer; }
.reset:focus-visible, .line:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.boq { font-size: 13px; }
.hd, .line { display: grid; grid-template-columns: 44px 1fr 80px 40px; }
.hd { color: var(--mute); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; padding-bottom: 10px; border-bottom: 1px solid var(--ink); }
.hd span:nth-child(n+3) { text-align: right; }
.line {
  width: 100%; font: inherit; color: inherit; text-align: left; background: none; border: 0;
  border-bottom: 1px solid var(--line); padding: 16px 0; cursor: pointer; align-items: baseline;
  transition: background .25s, padding .25s;
}
.line:hover { background: var(--soft); }
.line[aria-pressed='true'] { background: #eef1ff; padding-left: 10px; box-shadow: inset 2px 0 0 var(--accent); }
.ref { color: var(--mute); font-variant-numeric: tabular-nums; }
.d { line-height: 1.45; padding-right: 14px; }
.d small { display: block; color: var(--mute); margin-top: 4px; }
.q { text-align: right; font-variant-numeric: tabular-nums; font-size: 16px; font-weight: 300; }
.u { text-align: right; color: var(--mute); }
@media (max-width: 760px) {
  .pair { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .view { top: 64px; z-index: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .stage, .box, .line { transition: none; }
}
</style>
