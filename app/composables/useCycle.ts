import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'

/** Index 0..length-1 advancing every `ms` after an initial `offset`; paused under reduced motion. */
export function useCycle(length: number, ms: number, offset = 0): Ref<number> {
  const index = ref(0)
  const reduced = useReducedMotion()
  let timeout: ReturnType<typeof setTimeout> | undefined
  let interval: ReturnType<typeof setInterval> | undefined

  const stop = () => {
    clearTimeout(timeout)
    clearInterval(interval)
    timeout = interval = undefined
  }
  const start = () => {
    stop()
    if (length < 2 || reduced.value) return
    timeout = setTimeout(() => {
      interval = setInterval(() => { index.value = (index.value + 1) % length }, ms)
    }, offset)
  }

  onMounted(start)
  watch(reduced, start)
  onBeforeUnmount(stop)
  return index
}
