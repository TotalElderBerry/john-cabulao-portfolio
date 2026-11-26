<script setup lang="ts">
import { loupeStyle } from '~~/shared/loupe'

// Desktop-only magnifier. Mount it inside a positioned element; it tracks the pointer over its parent.
const props = withDefaults(defineProps<{ src: string; zoom?: number; size?: number }>(), { zoom: 3, size: 230 })

const el = ref<HTMLElement | null>(null)
const on = ref(false)
let host: HTMLElement | null = null

function move(e: PointerEvent) {
  if (!host || !el.value || e.pointerType === 'touch') return
  const r = host.getBoundingClientRect()
  Object.assign(el.value.style, loupeStyle(r, e.clientX - r.left, e.clientY - r.top, props.zoom, props.size))
}
function enter(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  // Set the 3200w background on first use only, so the large file never competes with page load.
  if (el.value && !el.value.style.backgroundImage) el.value.style.backgroundImage = `url("${props.src}")`
  on.value = true
  move(e)
}
function leave() { on.value = false }

watch(() => props.src, (src) => {
  if (el.value?.style.backgroundImage) el.value.style.backgroundImage = `url("${src}")`
})

onMounted(() => {
  host = el.value?.parentElement ?? null
  host?.addEventListener('pointerenter', enter)
  host?.addEventListener('pointermove', move)
  host?.addEventListener('pointerleave', leave)
})
onBeforeUnmount(() => {
  host?.removeEventListener('pointerenter', enter)
  host?.removeEventListener('pointermove', move)
  host?.removeEventListener('pointerleave', leave)
})
</script>

<template>
  <div
    ref="el"
    class="loupe"
    :class="{ on }"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :data-zoom="`${zoom}×`"
    aria-hidden="true"
  />
</template>

<style scoped>
.loupe {
  position: absolute; left: 0; top: 0; z-index: 2;
  border-radius: 50%; pointer-events: none;
  border: 1px solid var(--ink);
  box-shadow: 0 12px 40px rgba(0, 0, 0, .25);
  background-repeat: no-repeat; background-color: #fff;
  opacity: 0; visibility: hidden;
  transform: translate(-50%, -50%) scale(.7);
  transition: opacity .2s, transform .25s cubic-bezier(.2, .7, .2, 1), visibility 0s linear .25s;
}
.loupe.on {
  opacity: 1; visibility: visible;
  transform: translate(-50%, -50%) scale(1);
  transition: opacity .2s, transform .25s cubic-bezier(.2, .7, .2, 1), visibility 0s;
}
.loupe::after {
  content: attr(data-zoom); position: absolute; right: 22px; bottom: 20px;
  font-size: 10px; background: var(--ink); color: #fff; padding: 2px 5px;
}
</style>
