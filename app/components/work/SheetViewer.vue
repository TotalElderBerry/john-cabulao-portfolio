<script setup lang="ts">
import MediaImg from '~/components/work/MediaImg.vue'
import MagnifierLoupe from '~/components/work/MagnifierLoupe.vue'
import { mediaFor } from '~~/shared/media'

const props = withDefaults(
  defineProps<{ jobId: string; pages?: number; ratio?: number; alt?: string }>(),
  { pages: 1, ratio: 1.414, alt: 'Marked-up take-off sheet' },
)
const page = defineModel<number>('page', { default: 1 })

const sheet = ref<HTMLElement | null>(null)
const dialog = ref<HTMLDialogElement | null>(null)
const pan = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const canHover = ref(false)

// No media → MediaImg shows its placeholder, and there is nothing to magnify or enlarge.
const hasMedia = computed(() => mediaFor(useManifest(), 'jobs', props.jobId) !== null)
const base = computed(() => `/media/jobs/${props.jobId}/p${page.value}`)
const big = computed(() => ({ webp: `${base.value}-3200.webp`, jpg: `${base.value}-3200.jpg` }))

let mq: MediaQueryList | null = null
const syncHover = () => { canHover.value = !!mq?.matches }
onMounted(() => {
  mq = window.matchMedia('(hover: hover)')
  syncHover()
  mq.addEventListener('change', syncHover)
})
onBeforeUnmount(() => {
  mq?.removeEventListener('change', syncHover)
  document.documentElement.style.overflow = ''
})

function open() {
  if (!hasMedia.value || !dialog.value || isOpen.value) return
  isOpen.value = true
  document.documentElement.style.overflow = 'hidden'
  dialog.value.showModal()
}
function close() { dialog.value?.close() }
function onClosed() {
  isOpen.value = false
  document.documentElement.style.overflow = ''
  sheet.value?.focus()
}
function centre() {
  const p = pan.value
  if (p) { p.scrollLeft = (p.scrollWidth - p.clientWidth) / 2; p.scrollTop = (p.scrollHeight - p.clientHeight) / 2 }
}

defineExpose({ sheet })
</script>

<template>
  <div class="viewer">
    <div
      ref="sheet"
      class="sheet"
      :class="{ live: hasMedia, hover: hasMedia && canHover }"
      :tabindex="hasMedia ? 0 : undefined"
      :role="hasMedia ? 'button' : undefined"
      :aria-label="hasMedia ? `${alt}, sheet ${page} of ${pages}. Press Enter to enlarge.` : undefined"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.space.prevent="open"
    >
      <MediaImg :key="page" kind="jobs" :id="jobId" :page="page" :alt="alt" sizes="(max-width: 760px) 100vw, 70vw" priority />
      <slot name="overlay" :el="sheet" :page="page" />
      <MagnifierLoupe v-if="hasMedia && canHover" :src="big.webp" :zoom="3" :size="230" />
    </div>

    <div v-if="pages > 1" class="pager" role="group" aria-label="Sheets">
      <button
        v-for="p in pages"
        :key="p"
        type="button"
        class="num"
        :aria-pressed="p === page"
        @click="page = p"
      >Sheet {{ String(p).padStart(2, '0') }}</button>
    </div>

    <dialog
      v-if="hasMedia"
      ref="dialog"
      class="enlarged"
      aria-label="Enlarged sheet"
      @close="onClosed"
    >
      <button type="button" class="close" @click="close">Close <span aria-hidden="true">×</span></button>
      <div ref="pan" class="pan">
        <picture v-if="isOpen">
          <source type="image/webp" :srcset="big.webp">
          <img :src="big.jpg" :alt="`${alt}, enlarged`" @load="centre">
        </picture>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.sheet { position: relative; background: #fff; outline: 1px solid var(--line); }
.sheet.live { cursor: zoom-in; }
.sheet.hover { cursor: none; }
.sheet:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.pager { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 14px; font-size: 13px; }
.pager button {
  background: none; border: 0; padding: 4px 0; font: inherit; color: var(--mute); cursor: pointer;
  border-bottom: 1px solid transparent;
}
.pager button[aria-pressed='true'] { color: var(--ink); border-bottom-color: var(--ink); }

.enlarged {
  width: 100vw; height: 100dvh; max-width: none; max-height: none;
  margin: 0; padding: 0; border: 0; background: var(--paper); overflow: hidden;
}
.enlarged::backdrop { background: rgba(18, 18, 18, .6); }
.pan {
  width: 100%; height: 100%; overflow: auto; overscroll-behavior: contain;
  touch-action: pan-x pan-y pinch-zoom; -webkit-overflow-scrolling: touch;
}
.pan img { display: block; width: max(100%, 1800px); max-width: none; height: auto; }
.close {
  position: fixed; top: max(12px, env(safe-area-inset-top, 0px)); right: 16px; z-index: 1;
  min-height: 44px; padding: 0 16px; font: inherit; font-size: 14px;
  background: var(--ink); color: #fff; border: 0; cursor: pointer;
}
.close:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
</style>
