<script setup lang="ts">
import type { Site } from '~~/shared/schemas'

defineProps<{ site: Site }>()
</script>

<template>
  <section id="contact" class="contact">
    <small>Have a set of drawings?</small>
    <NuxtLink class="big" to="/contact/">Send them over →</NuxtLink>
    <div class="foot">
      <div><b>Email</b><a :href="`mailto:${site.email}`">{{ site.email }}</a></div>
      <div><b>Based in</b>{{ site.location }}</div>
      <div><b>Software</b>{{ site.software.slice(0, 3).join(' · ') }}</div>
      <div><b>Credentials</b>{{ site.credentials[0] }}</div>
    </div>
  </section>
</template>

<style scoped>
.contact { background: var(--ink); color: #fff; padding: 18vh 4vw 6vh; }
small { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: #8f8f8f; }
.big {
  display: block; position: relative; width: max-content; max-width: 100%;
  font-size: clamp(54px, 11vw, 190px); font-weight: 200; letter-spacing: -.06em; line-height: .9;
  margin: 4vh 0 6vh;
}
.big::after {
  content: ''; position: absolute; left: 0; bottom: -12px; height: 3px; width: 100%;
  background: var(--accent); transform: scaleX(.12); transform-origin: left;
  transition: transform .8s cubic-bezier(.2, .7, .2, 1);
}
.big:hover::after, .big:focus-visible::after { transform: scaleX(1); }
.foot {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 2vw;
  border-top: 1px solid #2c2c2c; padding-top: 3vh; font-size: 13px; line-height: 1.6; color: #a9a9a9;
}
.foot b { display: block; color: #fff; font-weight: 400; margin-bottom: 6px; }
.foot a { overflow-wrap: anywhere; }
@media (max-width: 760px) {
  .contact { padding: 12vh 16px 6vh; }
  .big { font-size: clamp(40px, 13vw, 64px); white-space: normal; width: auto; }
  .foot { grid-template-columns: 1fr 1fr; gap: 24px 16px; }
  .foot > :first-child { grid-column: 1 / -1; }
}
</style>
