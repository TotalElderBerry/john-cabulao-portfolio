<script setup lang="ts">
import { splitStatement } from '~~/shared/text'

const props = defineProps<{ statement: string }>()
const words = computed(() => splitStatement(props.statement))

// Every word is lit in the prerendered HTML; once mounted (and only with motion allowed) the words
// light up one by one as the paragraph scrolls through the viewport.
const reduced = useReducedMotion()
const mounted = ref(false)
const el = ref<HTMLElement | null>(null)
const progress = ref(1)
onMounted(() => { mounted.value = true })
useScrollFrame(() => {
  if (!el.value) return
  const r = el.value.getBoundingClientRect()
  progress.value = Math.min(Math.max((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.4), 0), 1)
})
const lit = computed(() => (mounted.value && !reduced.value ? progress.value : 1))
const isOn = (i: number) => lit.value >= 1 || i / words.value.length < lit.value
</script>

<template>
  <section class="statement">
    <p ref="el"><template v-for="(w, i) in words" :key="i"><span :class="{ hl: w.hl, on: isOn(i) }">{{ w.text }}</span>{{ i < words.length - 1 ? ' ' : '' }}</template></p>
  </section>
</template>

<style scoped>
.statement { padding: 22vh 4vw 18vh; }
.statement p {
  font-size: clamp(30px, 4.6vw, 68px); font-weight: 300; line-height: 1.12; letter-spacing: -.02em;
  margin: 0; max-width: 1300px;
}
.statement span { color: #949494; transition: color .3s; }
.statement span.on { color: var(--ink); }
.statement span.hl.on { color: var(--accent); }
@media (max-width: 760px) {
  .statement { padding: 14vh 16px 12vh; }
}
</style>
