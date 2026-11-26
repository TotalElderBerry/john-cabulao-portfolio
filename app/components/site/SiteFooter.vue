<script setup lang="ts">
const site = await useSite()
</script>

<template>
  <footer class="foot">
    <nav class="pages" aria-label="Pages">
      <NuxtLink to="/single-trade/">work</NuxtLink>
      <NuxtLink to="/services/">services</NuxtLink>
      <NuxtLink to="/about/">about</NuxtLink>
      <NuxtLink to="/contact/">contact</NuxtLink>
    </nav>
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
  padding: 64px max(16px, 4vw) 48px; margin-top: 96px;
  border-top: 1px solid var(--line);
  font-size: 13px; line-height: 1.7;
}
.pages { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 6px 24px; padding-bottom: 24px; border-bottom: 1px solid var(--line); }
.label { color: var(--mute); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 6px; }
@media (max-width: 760px) {
  .foot { grid-template-columns: 1fr; gap: 24px; }
}
</style>
