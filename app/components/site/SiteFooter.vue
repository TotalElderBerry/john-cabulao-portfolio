<script setup lang="ts">
const { data: site } = await useAsyncData('site', () => queryCollection('site').first())
</script>

<template>
  <footer v-if="site" class="foot gutter">
    <div class="col">
      <div class="label">Contact</div>
      <a :href="`mailto:${site.email}`">{{ site.email }}</a>
      <div>{{ site.location }}</div>
    </div>
    <div class="col">
      <div class="label">Software</div>
      <div>{{ site.software.join(', ') }}</div>
    </div>
    <div class="col">
      <div class="label">Credentials</div>
      <div>{{ site.credentials[0] }}</div>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
  padding-block: 64px 48px; margin-top: 96px;
  border-top: 1px solid var(--line);
  font-size: 13px; line-height: 1.7;
}
.label { color: var(--mute); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 6px; }
@media (max-width: 760px) {
  .foot { grid-template-columns: 1fr; gap: 24px; }
}
</style>
