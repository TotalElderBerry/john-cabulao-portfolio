import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Live `prefers-reduced-motion: reduce`. False during SSR and hydration, then follows the media query. */
export function useReducedMotion(): Ref<boolean> {
  const reduced = ref(false)
  let mq: MediaQueryList | null = null
  const update = () => { reduced.value = !!mq?.matches }
  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mq.addEventListener('change', update)
  })
  onBeforeUnmount(() => mq?.removeEventListener('change', update))
  return reduced
}
