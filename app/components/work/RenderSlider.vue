<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import { mediaFor } from '~~/shared/media'

const props = defineProps<{ slug: string; render: string; takeoff: string; renderName: string; takeoffName: string }>()

const pos = ref(50)
const box = ref<HTMLElement | null>(null)
const clamp = (v: number) => Math.min(100, Math.max(0, v))
const ratio = computed(() => mediaFor(useManifest(), 'projects', props.slug, props.renderName)?.ratio ?? 1.414)

function setFromX(clientX: number) {
  const r = box.value?.getBoundingClientRect()
  if (!r || !r.width) return
  pos.value = clamp(Math.round(((clientX - r.left) / r.width) * 100))
}
let dragging = false
function down(e: PointerEvent) {
  dragging = true
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  setFromX(e.clientX)
}
function move(e: PointerEvent) { if (dragging) setFromX(e.clientX) }
function up(e: PointerEvent) {
  dragging = false
  ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
}
function key(e: KeyboardEvent) {
  const map: Record<string, () => number> = {
    ArrowLeft: () => pos.value - 5, ArrowDown: () => pos.value - 5,
    ArrowRight: () => pos.value + 5, ArrowUp: () => pos.value + 5,
    Home: () => 0, End: () => 100,
  }
  const f = map[e.key]
  if (!f) return
  e.preventDefault()
  pos.value = clamp(f())
}
</script>

<template>
  <div
    ref="box"
    class="rs"
    :style="{ aspectRatio: String(ratio) }"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
  >
    <div class="layer"><MediaImg kind="projects" :id="slug" :name="renderName" :alt="`${slug} render`" sizes="(max-width: 760px) 100vw, 92vw" priority /></div>
    <div class="layer top" :style="{ clipPath: `inset(0 0 0 ${pos}%)` }">
      <MediaImg kind="projects" :id="slug" :name="takeoffName" :alt="`${slug} take-off`" sizes="(max-width: 760px) 100vw, 92vw" />
    </div>
    <span class="lab l">Render</span>
    <span class="lab r">Take-off</span>
    <div
      class="handle"
      role="slider"
      tabindex="0"
      aria-label="Compare render and take-off"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="pos"
      :style="{ left: `${pos}%` }"
      @keydown="key"
    ><i aria-hidden="true" /></div>
  </div>
</template>

<style scoped>
.rs { position: relative; width: 100%; overflow: hidden; background: var(--soft); touch-action: pan-y; user-select: none; cursor: ew-resize; }
.layer { position: absolute; inset: 0; background: var(--soft); }
.layer.top { background: var(--paper); }
.layer > :deep(*) { width: 100%; height: 100%; }
.layer :deep(.media img) { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.lab { position: absolute; top: 14px; font-size: 11px; background: var(--paper); padding: 5px 9px; letter-spacing: .04em; pointer-events: none; }
.lab.l { left: 14px; } .lab.r { right: 14px; }
.handle { position: absolute; top: 0; bottom: 0; width: 44px; margin-left: -22px; display: grid; place-items: center; outline: none; }
.handle i { width: 1px; height: 100%; background: var(--ink); position: relative; }
.handle i::after { content: ''; position: absolute; left: -9px; top: 50%; width: 19px; height: 19px; margin-top: -9px; background: var(--paper); border: 1px solid var(--ink); }
.handle:focus-visible i::after { background: var(--accent); border-color: var(--accent); }
</style>
