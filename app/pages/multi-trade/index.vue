<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import ContactBand from '~/components/site/ContactBand.vue'
import { kebab } from '~~/shared/media'

const [projects, site] = await Promise.all([useProjects(), useSite()])
const pad = (n: number) => String(n).padStart(2, '0')
usePageSeo({
  title: 'Multi-trade projects · Cabulao',
  description: `${projects.length} multi-trade projects measured across every package: ${projects.map((p) => p.title.toLowerCase()).join(', ')}.`,
})
</script>

<template>
  <div>
    <section class="idx">
      <h1>Multi-trade</h1>
      <p class="sub">{{ pad(projects.length) }} projects, measured end to end</p>
      <NuxtLink v-for="(p, i) in projects" :key="p.slug" :to="`/multi-trade/${p.slug}/`" class="project">
        <span class="n">{{ pad(i + 1) }}</span>
        <span class="tx">
          <b>{{ p.title }}</b>
          <em>{{ p.type }} · {{ p.tool }}</em>
          <span class="tr">{{ p.trades.join(' · ') }}</span>
        </span>
        <span class="th">
          <MediaImg kind="projects" :id="p.slug" :name="kebab(p.hero)" :alt="`${p.title} render`" sizes="(max-width: 760px) 100vw, 30vw" />
        </span>
        <span class="ar" aria-hidden="true">→</span>
      </NuxtLink>
    </section>
    <ContactBand :site="site" />
  </div>
</template>

<style scoped>
.idx { padding: 14vh max(16px, 4vw) 10vh; }
h1 { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; line-height: .9; margin: 0; }
.sub { font-size: 13px; color: var(--mute); margin: 18px 0 6vh; }
.project { display: grid; grid-template-columns: 70px minmax(0, 1fr) minmax(0, 30vw) 24px; gap: 24px; align-items: center; padding: 28px 0; border-top: 1px solid var(--line); }
.project:first-of-type { border-top-color: var(--ink); }
.project:last-of-type { border-bottom: 1px solid var(--line); }
.n { font-size: 12px; color: var(--mute); font-variant-numeric: tabular-nums; }
.tx b { display: block; font-weight: 300; font-size: clamp(28px, 4vw, 60px); letter-spacing: -.03em; line-height: 1; }
.tx em { display: block; font-style: normal; font-size: 14px; color: var(--accent); margin-top: 12px; }
.tx .tr { display: block; font-size: 13px; color: var(--mute); margin-top: 4px; }
.th { display: block; aspect-ratio: 4 / 3; overflow: hidden; background: var(--soft); }
.th > :deep(*) { width: 100%; height: 100%; }
.th :deep(.media img) { width: 100%; height: 100%; object-fit: cover; }
.ar { font-size: 20px; transition: transform .35s cubic-bezier(.2, .7, .2, 1); }
.project:hover .ar, .project:focus-visible .ar { transform: translateX(6px); color: var(--accent); }
.project:hover .tx b, .project:focus-visible .tx b { color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .ar { transition: none; } }
@media (max-width: 760px) {
  .idx { padding: 12vh 16px 8vh; }
  .project { grid-template-columns: minmax(0, 1fr) 24px; gap: 14px; }
  .n { display: none; }
  .th { grid-column: 1 / -1; order: 3; }
  .ar { grid-column: 2; grid-row: 1; }
}
</style>
