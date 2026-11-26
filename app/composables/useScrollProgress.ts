import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const clamp = (v: number) => Math.min(Math.max(v, 0), 1)

/** 0 when the section's top reaches the viewport top, 1 once it has scrolled `height - vh` further. */
export function progressFor(top: number, height: number, vh: number): number {
  const run = height - vh
  if (run <= 0) return top <= 0 ? 1 : 0
  return clamp(-top / run)
}

/** Run `cb` at most once per animation frame on scroll and resize (and once on mount); cleaned up on unmount. */
export function useScrollFrame(cb: () => void): void {
  let frame = 0
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; cb() })
  }
  onMounted(() => {
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule, { passive: true })
    cb()
  })
  onBeforeUnmount(() => {
    removeEventListener('scroll', schedule)
    removeEventListener('resize', schedule)
    if (frame) cancelAnimationFrame(frame)
  })
}

/** Scroll progress 0→1 through a pinned section (over `el.height - innerHeight`), rAF-throttled. */
export function useScrollProgress(el: Ref<HTMLElement | null>): Ref<number> {
  const progress = ref(0)
  useScrollFrame(() => {
    if (!el.value) return
    const r = el.value.getBoundingClientRect()
    progress.value = progressFor(r.top, r.height, innerHeight)
  })
  return progress
}
