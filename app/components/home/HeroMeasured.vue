<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import type { Job, Project, Site } from '~~/shared/schemas'
import { jobId } from '~~/shared/jobs'
import { kebab } from '~~/shared/media'

export interface HeroCounts { projects: number; jobs: number; trades: number }

const props = defineProps<{
  heroProjectSlug: string
  scanJobId: string
  counts: HeroCounts
  site: Site
  /** Published projects and jobs, for the doorway thumbnails and tool names. */
  projects: Project[]
  jobs: Job[]
}>()

interface Pic { kind: 'jobs' | 'projects'; id: string; name?: string }
interface Door {
  to: string
  label: string
  count: string
  meta: string
  thumbs: Pic[]
  alt: Pic
  tag: string
  drawing: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')
const tools = (xs: { tool: string }[]) => [...new Set(xs.map((x) => x.tool))].join(' · ')
const projectPic = (p: Project): Pic => ({ kind: 'projects', id: p.slug, name: kebab(p.hero) })
const jobPic = (j: Job): Pic => ({ kind: 'jobs', id: jobId(j) })

const heroProject = computed(() => props.projects.find((p) => p.slug === props.heroProjectSlug) ?? props.projects[0])
const scanJob = computed(() => props.jobs.find((j) => jobId(j) === props.scanJobId) ?? props.jobs[0])
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const doors = computed<Door[]>(() => {
  // One sheet per trade: the first published job of each.
  const perTrade = props.jobs.filter((j, i, all) => all.findIndex((k) => k.trade === j.trade) === i)
  const other = props.projects.find((p) => p.slug !== heroProject.value?.slug) ?? heroProject.value
  const out: Door[] = []
  if (other) {
    out.push({
      to: '/multi-trade/',
      label: 'Multi-trade',
      count: pad(props.counts.projects),
      meta: `${props.counts.projects} projects · ${tools(props.projects)}`,
      thumbs: props.projects.map(projectPic),
      alt: projectPic(other),
      tag: `Multi-trade · ${other.title}`,
      drawing: false,
    })
  }
  if (scanJob.value) {
    out.push({
      to: '/single-trade/',
      label: 'Single-trade',
      count: pad(props.counts.jobs),
      meta: `${props.counts.trades} trades · ${tools(props.jobs)}`,
      thumbs: perTrade.map(jobPic),
      alt: jobPic(scanJob.value),
      tag: `Single trade · ${capital(scanJob.value.trade)} take-off`,
      drawing: true,
    })
  }
  return out
})

// Thumbnails cycle every 2600 ms, the second doorway offset by 1300 ms (paused under reduced motion).
const cycles = [useCycle(doors.value[0]?.thumbs.length ?? 0, 2600, 0), useCycle(doors.value[1]?.thumbs.length ?? 0, 2600, 1300)]

// Hover swaps the big image (pointer devices only; on touch the doorways are plain links).
const active = ref<number | null>(null)
const canHover = ref(false)
// The hover images and the later thumbnails are only rendered once the page has loaded and gone idle,
// so they never compete with the hero image (LCP). On touch devices the hover images never load.
const armed = ref(false)
onMounted(() => {
  canHover.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const arm = () => { armed.value = true }
  const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(arm, { timeout: 2000 }) : setTimeout(arm, 200))
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
})
const enter = (i: number) => { if (canHover.value) { armed.value = true; active.value = i } }
const leave = () => { active.value = null }
const shown = computed(() => (active.value === null ? null : doors.value[active.value]))

// Parallax: the hero image drifts up at 0.12 × scroll.
const reduced = useReducedMotion()
const py = ref(0)
useScrollFrame(() => { py.value = reduced.value ? 0 : -scrollY * 0.12 })
</script>

<template>
  <section class="hero" :class="{ sw: shown?.drawing }">
    <div class="intro">
      <b>{{ site.role }}</b>{{ site.name }} — {{ site.credentials[0] }}. Bills of Quantities and cost plans for
      Australian builders, subcontractors and developers.
    </div>

    <div class="img" :class="{ swap: !!shown }" :style="{ '--py': `${py}px` }">
      <MediaImg
        v-if="heroProject"
        class="main"
        kind="projects"
        :id="heroProject.slug"
        :name="kebab(heroProject.hero)"
        :alt="`${heroProject.title}, ${heroProject.type.toLowerCase()} — render`"
        sizes="(max-width: 760px) 100vw, 58vw"
        priority
      />
      <template v-if="armed && canHover">
      <MediaImg
        v-for="(d, i) in doors"
        :key="d.to"
        class="alt"
        :class="{ on: active === i }"
        :kind="d.alt.kind"
        :id="d.alt.id"
        :name="d.alt.name"
        alt=""
        sizes="(max-width: 760px) 100vw, 58vw"
      />
      </template>
      <span class="tag" aria-hidden="true">{{ shown?.tag }}</span>
    </div>

    <h1 class="word">Measured.</h1>
    <div class="clip" aria-hidden="true"><span class="word">Measured.</span></div>

    <nav class="doors" aria-label="Start exploring">
      <small class="k">Start exploring</small>
      <NuxtLink
        v-for="(d, i) in doors"
        :key="d.to"
        :to="d.to"
        class="door"
        @mouseenter="enter(i)"
        @mouseleave="leave"
        @focus="enter(i)"
        @blur="leave"
      >
        <span class="th">
          <template v-for="(t, k) in d.thumbs" :key="t.id + (t.name ?? '')">
          <MediaImg
            v-if="k === 0 || armed"
            :class="{ on: k === cycles[i]?.value }"
            :kind="t.kind"
            :id="t.id"
            :name="t.name"
            alt=""
            sizes="84px"
          />
          </template>
        </span>
        <span class="tx"><b>{{ d.label }}<sup>{{ d.count }}</sup></b><em>{{ d.meta }}</em></span>
        <span class="ar" aria-hidden="true">→</span>
      </NuxtLink>
    </nav>
  </section>
</template>

<style scoped>
.hero { position: relative; height: 100vh; min-height: 620px; overflow: hidden; }

.img { position: absolute; left: 38%; right: 4vw; top: 14vh; bottom: 9vh; overflow: hidden; background: var(--soft); }
.img > :deep(*) {
  position: absolute; left: 0; top: 0; width: 100%; height: 120%;
  transform: translateY(var(--py, 0));
  transition: opacity .6s ease;
}
.img :deep(.media img) { width: 100%; height: 100%; object-fit: cover; }
.img > :deep(.media-placeholder) { height: 100%; }
.img > :deep(.alt) { opacity: 0; }
.img > :deep(.alt.on) { opacity: 1; }
.img .tag {
  position: absolute; right: 14px; top: 14px; left: auto; width: auto; height: auto; z-index: 2;
  font-size: 11px; background: var(--paper); padding: 5px 9px;
  opacity: 0; transform: translateY(-6px); transition: .35s;
}
.img.swap .tag { opacity: 1; transform: none; }

.word {
  position: absolute; left: 3vw; bottom: 4vh; margin: 0;
  font-size: 21vw; font-weight: 200; letter-spacing: -.06em; line-height: .8; white-space: nowrap;
}
.clip { position: absolute; inset: 0; clip-path: inset(14vh 4vw 9vh 38%); pointer-events: none; }
.clip .word { color: #fff; transition: color .6s; }
.hero.sw .clip .word { color: var(--accent); }

.intro { position: absolute; left: 4vw; top: 20vh; max-width: 28vw; font-size: 15px; line-height: 1.55; }
.intro b {
  display: block; font-weight: 500; font-size: 12px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 12px;
}

.doors {
  position: absolute; left: 4vw; top: calc(20vh + 175px); width: calc(38% - 4vw - 28px); z-index: 5;
  border-top: 1px solid var(--ink);
}
.doors .k { display: block; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--mute); padding: 12px 0 4px; }
.door {
  display: grid; grid-template-columns: 84px 1fr 18px; gap: 14px; align-items: center;
  padding: 12px 0; border-bottom: 1px solid var(--line);
}
.door .th { position: relative; width: 84px; height: 58px; overflow: hidden; background: var(--soft); }
.door .th > :deep(*) {
  position: absolute; inset: 0; width: 100%; height: 100%;
  opacity: 0; transform: scale(1.08); transition: opacity .8s, transform 1.2s;
}
.door .th > :deep(.on) { opacity: 1; transform: scale(1); }
.door .th :deep(.media img) { width: 100%; height: 100%; object-fit: cover; }
.door .th :deep(.media-placeholder span) { display: none; }
.door .tx b { display: block; font-weight: 300; font-size: 22px; letter-spacing: -.02em; line-height: 1.1; transition: color .3s; }
.door .tx b sup { font-size: 11px; color: var(--accent); margin-left: 4px; font-weight: 500; }
.door .tx em { font-style: normal; font-size: 12px; color: var(--mute); }
.door .ar { font-size: 16px; transition: transform .35s cubic-bezier(.2, .7, .2, 1); }
.door:hover .ar, .door:focus-visible .ar { transform: translateX(6px); color: var(--accent); }
.door:hover .tx b, .door:focus-visible .tx b { color: var(--accent); }

@media (max-width: 760px) {
  .hero {
    height: auto; min-height: 0; overflow: visible;
    display: flex; flex-direction: column;
    padding: 96px 16px 40px;
  }
  .intro, .img, .word, .doors { position: static; inset: auto; }
  .intro { max-width: none; font-size: 15px; }
  .img { position: relative; order: 1; margin-top: 28px; aspect-ratio: 4 / 3; width: 100%; }
  .img > :deep(*) { height: 100%; transform: none; }
  .word { order: 2; font-size: 22.5vw; line-height: .9; margin: 18px 0 0 -.04em; }
  .clip { display: none; }
  .doors { order: 3; width: 100%; margin-top: 28px; }
}
</style>
