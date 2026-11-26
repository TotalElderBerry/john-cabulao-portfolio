<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import type { Project } from '~~/shared/schemas'
import { kebab } from '~~/shared/media'

const props = defineProps<{ projects: Project[] }>()

// html.js is set by an inline head script before first paint, so no-JS visitors keep the stacked layout
// (see the html:not(.js) rules below) while normal desktop never shows a stacked-then-pinned jump.
useHead({ script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }] })

const pad = (n: number) => String(n).padStart(2, '0')
const tools = computed(() => [...new Set(props.projects.map((p) => p.tool))].join(' · '))

// Pinned horizontal gallery: the track slides left with the section's scroll progress (desktop only;
// at ≤760px the panels stack). Panels render uncovered; once mounted with motion allowed, panels still
// off to the right get a curtain that opens as they come into view.
const el = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const panels = ref<HTMLElement[]>([])
const progress = useScrollProgress(el)
const reduced = useReducedMotion()
const tx = ref(0)
const covered = ref<boolean[]>([])
let wide: MediaQueryList | null = null

const motion = () => !reduced.value && !!wide?.matches
useScrollFrame(() => {
  wide ??= window.matchMedia('(min-width: 761px)')
  if (!motion() || !track.value) {
    tx.value = 0
    covered.value = []
    return
  }
  const max = track.value.scrollWidth - innerWidth + innerWidth * 0.04
  tx.value = -progress.value * Math.max(max, 0)
  panels.value.forEach((pn, i) => {
    const r = pn.getBoundingClientRect()
    const inView = r.left < innerWidth * 0.9 && r.top < innerHeight
    if (covered.value[i] === undefined) covered.value[i] = !inView
    else if (inView) covered.value[i] = false
  })
})
</script>

<template>
  <section id="multi" ref="el" class="multi">
    <div class="pin">
      <header>
        <h2>Multi-trade</h2>
        <span>{{ pad(projects.length) }} projects · {{ tools }}</span>
      </header>
      <div ref="track" class="track" :style="{ transform: `translateX(${tx}px)` }">
        <article v-for="(p, i) in projects" :key="p.slug" ref="panels" class="panel" :class="{ covered: covered[i] }">
          <NuxtLink :to="`/multi-trade/${p.slug}/`" class="ph">
            <MediaImg
              kind="projects"
              :id="p.slug"
              :name="kebab(p.hero)"
              :alt="`${p.title} — render`"
              sizes="(max-width: 760px) 100vw, 62vw"
            />
            <span class="curtain" aria-hidden="true" />
          </NuxtLink>
          <div class="cap">
            <span class="n">{{ pad(i + 1) }}</span>
            <h3><NuxtLink :to="`/multi-trade/${p.slug}/`">{{ p.title }} <em>— {{ p.type.toLowerCase() }}</em></NuxtLink></h3>
            <span class="t">{{ p.trades.join(' · ') }}</span>
          </div>
        </article>
        <div class="panel end">
          <NuxtLink to="/multi-trade/">All projects →</NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.multi { height: 340vh; position: relative; }
.pin { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
header { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 0 4vw 4vh; }
header h2 { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; margin: 0; line-height: .9; }
header span { font-size: 13px; color: var(--mute); }
.track { display: flex; gap: 3vw; padding-left: 4vw; will-change: transform; }
.panel { flex: 0 0 62vw; }
.ph { display: block; height: 56vh; overflow: hidden; position: relative; background: var(--soft); }
.ph > :deep(*) { width: 100%; height: 100%; }
.ph :deep(.media img) {
  width: 100%; height: 100%; object-fit: cover;
  transform: scale(1.08); transition: transform 1.2s cubic-bezier(.2, .7, .2, 1);
}
.ph:hover :deep(.media img) { transform: scale(1); }
.curtain {
  position: absolute; inset: 0; background: var(--paper);
  transform: scaleX(0); transform-origin: right; transition: transform 1s cubic-bezier(.7, 0, .2, 1);
}
.panel.covered .curtain { transform: scaleX(1); transition: none; }
.cap { display: grid; grid-template-columns: 70px 1fr auto; gap: 12px; padding-top: 18px; font-size: 14px; align-items: baseline; }
.cap .n { color: var(--mute); font-size: 12px; }
.cap h3 { margin: 0; font-weight: 300; font-size: 26px; letter-spacing: -.01em; }
.cap h3 em { font-style: normal; color: var(--accent); }
.cap .t { color: var(--mute); font-size: 13px; }
.panel.end { flex-basis: 30vw; display: flex; align-items: center; }
.panel.end a { font-size: 30px; font-weight: 300; border-bottom: 1px solid var(--ink); padding-bottom: 6px; }

/* Stacked layout: narrow screens, reduced motion, and no-JS (html:not(.js)). Reduced motion gets no pin,
   no horizontal track and no curtain, so every panel and "All projects" are reachable by plain scrolling. */
@media (max-width: 760px) {
  .multi { height: auto; padding: 12vh 0 4vh; }
  .pin { position: static; height: auto; overflow: visible; }
  header { flex-direction: column; gap: 10px; padding: 0 16px 28px; }
  .track { flex-direction: column; gap: 40px; padding: 0 16px; transform: none !important; }
  .panel, .panel.end { flex: none; width: 100%; }
  .ph { height: auto; aspect-ratio: 4 / 3; }
  .cap { grid-template-columns: 34px 1fr; }
  .cap .t { grid-column: 2; }
  .cap h3 { font-size: 22px; }
  .panel.end a { font-size: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .multi { height: auto; padding: 12vh 0 4vh; }
  .pin { position: static; height: auto; overflow: visible; }
  header { flex-direction: column; gap: 10px; padding: 0 16px 28px; }
  .track { flex-direction: column; gap: 40px; padding: 0 16px; transform: none !important; }
  .panel, .panel.end { flex: none; width: 100%; }
  .ph { height: auto; aspect-ratio: 4 / 3; }
  .cap { grid-template-columns: 34px 1fr; }
  .cap .t { grid-column: 2; }
  .cap h3 { font-size: 22px; }
  .panel.end a { font-size: 24px; }
  .curtain { display: none; }
}

/* No JS: same stacked layout. */
:global(html:not(.js)) .multi { height: auto; padding: 12vh 0 4vh; }
  :global(html:not(.js)) .pin { position: static; height: auto; overflow: visible; }
  :global(html:not(.js)) header { flex-direction: column; gap: 10px; padding: 0 16px 28px; }
  :global(html:not(.js)) .track { flex-direction: column; gap: 40px; padding: 0 16px; transform: none !important; }
  :global(html:not(.js)) .panel, :global(html:not(.js)) .panel.end { flex: none; width: 100%; }
  :global(html:not(.js)) .ph { height: auto; aspect-ratio: 4 / 3; }
  :global(html:not(.js)) .cap { grid-template-columns: 34px 1fr; }
  :global(html:not(.js)) .cap .t { grid-column: 2; }
  :global(html:not(.js)) .cap h3 { font-size: 22px; }
  :global(html:not(.js)) .panel.end a { font-size: 24px; }
</style>
