<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import RenderSlider from '~/components/work/RenderSlider.vue'
import { kebab, mediaFor } from '~~/shared/media'

const slug = String(useRoute().params.slug)
const [project, projects, site] = await Promise.all([useProject(slug), useProjects(), useSite()])
if (!project) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const i = projects.findIndex((p) => p.slug === project.slug)
const prev = i > 0 ? projects[i - 1] : null
const next = i >= 0 && i < projects.length - 1 ? projects[i + 1] : null
const meta = [
  { k: 'Project type', v: project.type },
  { k: 'Measured in', v: project.tool },
  { k: 'Trades', v: project.trades.join(' · ') },
]
usePageSeo({
  title: `${project.title} · Cabulao`,
  description: clip(`${project.blurb ?? `${project.type} measured across ${project.trades.join(', ').toLowerCase()} packages.`} Measured in ${project.tool}.`),
  image: mediaFor(useManifest(), 'projects', project.slug, kebab(project.hero)) ? `/media/projects/${project.slug}/${kebab(project.hero)}-1600.jpg` : undefined,
})
</script>

<template>
  <div>
    <section class="proj">
      <nav class="crumb" aria-label="Breadcrumb">
        <NuxtLink to="/multi-trade/">Multi-trade</NuxtLink> / <b aria-current="page">{{ project.title }}</b>
      </nav>
      <h1>{{ project.title }}</h1>
      <dl class="meta">
        <div v-for="m in meta" :key="m.k"><dt>{{ m.k }}</dt><dd>{{ m.v }}</dd></div>
      </dl>
      <p v-if="project.blurb" class="blurb">{{ project.blurb }}</p>

      <RenderSlider
        :slug="project.slug"
        :render="project.slider.render"
        :takeoff="project.slider.takeoff"
        :render-name="kebab(project.slider.render)"
        :takeoff-name="kebab(project.slider.takeoff)"
      />
      <p class="hint">Drag the divider, or use the arrow keys, to compare the render with the take-off.</p>

      <div class="gallery">
        <figure v-for="g in project.gallery" :key="g.file">
          <MediaImg kind="projects" :id="project.slug" :name="kebab(g.file)" :alt="g.caption" sizes="(max-width: 760px) 100vw, 46vw" defer />
          <figcaption>{{ g.caption }}</figcaption>
        </figure>
      </div>

      <nav class="pn" aria-label="Other projects">
        <NuxtLink v-if="prev" :to="`/multi-trade/${prev.slug}/`" class="prev"><small>← Prev</small> {{ prev.title }}</NuxtLink>
        <NuxtLink v-if="next" :to="`/multi-trade/${next.slug}/`" class="next"><small>Next →</small> {{ next.title }}</NuxtLink>
      </nav>
    </section>
    <LazySiteContactBand hydrate-on-visible :site="site" />
  </div>
</template>

<style scoped>
.proj { padding: 14vh max(16px, 4vw) 10vh; }
.crumb { font-size: 12px; color: var(--mute); margin-bottom: 18px; }
.crumb a:hover, .crumb a:focus-visible { color: var(--ink); }
.crumb b { color: var(--ink); font-weight: 400; }
h1 { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; line-height: .9; margin: 0; }
.meta { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--ink); margin: 5vh 0 4vh; }
.meta div { padding: 14px 16px 14px 0; font-size: 13px; color: var(--mute); }
.meta dd { margin: 4px 0 0; color: var(--ink); font-size: 17px; }
.blurb { font-size: clamp(20px, 2.2vw, 30px); font-weight: 300; line-height: 1.3; letter-spacing: -.01em; max-width: 900px; margin: 0 0 6vh; }
.hint { font-size: 12px; color: var(--mute); margin: 12px 0 0; }
.gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4vh 3vw; margin-top: 10vh; }
figure { margin: 0; }
figure > :deep(*:first-child) { aspect-ratio: 4 / 3; width: 100%; background: var(--soft); }
figure :deep(.media img) { width: 100%; height: 100%; object-fit: contain; }
figure :deep(.media-placeholder) { aspect-ratio: 4 / 3 !important; }
figcaption { font-size: 13px; color: var(--mute); padding-top: 10px; }
.pn { display: flex; justify-content: space-between; gap: 24px; margin-top: 10vh; border-top: 1px solid var(--ink); padding-top: 18px; font-size: 17px; }
.pn small { display: block; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); margin-bottom: 4px; }
.pn .next { margin-left: auto; text-align: right; }
.pn a:hover, .pn a:focus-visible { color: var(--accent); }
@media (max-width: 760px) {
  .proj { padding: 12vh 16px 8vh; }
  .meta { grid-template-columns: 1fr; }
  .gallery { grid-template-columns: minmax(0, 1fr); }
}
</style>
