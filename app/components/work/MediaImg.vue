<script setup lang="ts">
import { mediaFor, srcset } from '~~/shared/media'

const props = withDefaults(
  defineProps<{
    kind: 'jobs' | 'projects'
    id: string
    name?: string
    page?: number
    sizes?: string
    alt: string
    priority?: boolean
    /**
     * Below-the-fold images: render the <picture> only once the box is within 300px of the viewport.
     * Native lazy loading fetches anything within ~1250-2500px, which competes with the LCP image.
     */
    defer?: boolean
  }>(),
  { page: 1, sizes: '100vw', priority: false, defer: false },
)

const DEFAULT_RATIO = 1.414
const WIDTHS = { jobs: [640, 1600, 3200], projects: [800, 1600, 2400] } as const

const entry = computed(() => mediaFor(useManifest(), props.kind, props.id, props.name))
const ratio = computed(() => entry.value?.ratio ?? DEFAULT_RATIO)
const widths = computed(() => [...WIDTHS[props.kind]])
const base = computed(() =>
  props.kind === 'jobs'
    ? `/media/jobs/${props.id}/p${props.page}`
    : `/media/projects/${props.id}/${props.name}`,
)
const width = 1600

const near = ref(!props.defer)
const box = ref<HTMLElement | null>(null)
let io: IntersectionObserver | undefined
onMounted(() => {
  if (near.value || !box.value) return
  if (typeof IntersectionObserver === 'undefined') { near.value = true; return }
  io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { near.value = true; io?.disconnect() }
  }, { rootMargin: '300px 0px' })
  io.observe(box.value)
})
onBeforeUnmount(() => io?.disconnect())
const height = computed(() => Math.round(width / ratio.value))
</script>

<template>
  <div v-if="entry && !near" ref="box" class="media-pending" :style="{ aspectRatio: String(ratio) }" />
  <picture v-else-if="entry" class="media">
    <source type="image/webp" :srcset="srcset(base, widths, 'webp')" :sizes="sizes">
    <source type="image/jpeg" :srcset="srcset(base, widths, 'jpg')" :sizes="sizes">
    <img
      :src="`${base}-${widths[1]}.jpg`"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
    >
  </picture>
  <div
    v-else
    class="media-placeholder"
    role="img"
    :aria-label="alt"
    :style="{ aspectRatio: String(ratio) }"
  >
    <span>Drawing available on request</span>
  </div>
</template>

<style scoped>
.media { display: block; }
.media img { display: block; width: 100%; height: auto; }
.media-pending { width: 100%; background: var(--soft); }
.media-placeholder {
  display: grid; place-items: center; width: 100%;
  background: var(--soft); color: var(--mute);
  font-size: 13px; letter-spacing: .04em; text-align: center; padding: 16px;
}
</style>
