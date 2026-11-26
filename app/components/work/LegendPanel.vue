<script setup lang="ts">
import { formatQty } from '~~/shared/jobs'
import type { LegendItem } from '~~/shared/schemas'

defineProps<{ items: LegendItem[] }>()
</script>

<template>
  <aside class="legend" aria-labelledby="legend-title">
    <template v-if="items.length">
      <h2 id="legend-title">Take-off legend</h2>
      <ul>
        <li v-for="(it, i) in items" :key="i">
          <span><i :style="{ background: it.color }" aria-hidden="true" />{{ it.label }}</span>
          <b class="num">{{ formatQty(it.qty, it.unit) }}</b>
        </li>
      </ul>
    </template>
    <div v-if="$slots.default" class="dl"><slot /></div>
  </aside>
</template>

<style scoped>
h2 { font-weight: 400; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); margin: 0 0 10px; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; padding: 9px 0; border-top: 1px solid #dcdcd8; }
li i { display: inline-block; width: 9px; height: 9px; margin-right: 9px; }
li b { font-weight: 400; white-space: nowrap; }
.dl { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; font-size: 14px; }
.dl :deep(a) { border-bottom: 1px solid var(--ink); padding-bottom: 6px; display: flex; justify-content: space-between; }
</style>
