<script setup lang="ts">
import ContactBand from '~/components/site/ContactBand.vue'

const site = await useSite()
usePageSeo({ title: 'About · Cabulao', description: clip(site.bio) })
</script>

<template>
  <div>
    <section class="pg">
      <h1>About</h1>
      <p class="sub">{{ site.name }} · {{ site.location }}</p>
      <p class="bio">{{ site.bio }}</p>

      <h2 class="big">Experience</h2>
      <div class="list">
        <article v-for="e in site.experience" :key="e.org" class="item">
          <span class="when">{{ e.period }}</span>
          <div>
            <h3>{{ e.role }}</h3>
            <p class="org">{{ e.org }}</p>
            <ul><li v-for="p in e.points" :key="p">{{ p }}</li></ul>
          </div>
        </article>
      </div>

      <h2 class="big">Education</h2>
      <div class="list">
        <article v-for="e in site.education" :key="e.degree" class="item">
          <span class="when">{{ e.period }}</span>
          <div><h3>{{ e.degree }}</h3><p class="org">{{ e.school }}</p></div>
        </article>
      </div>

      <h2 class="big">Software</h2>
      <p class="sw">{{ site.software.join(' · ') }}</p>
      <p class="reg">Registered Civil Engineer</p>
    </section>
    <ContactBand :site="site" />
  </div>
</template>

<style scoped>
.pg { padding: 14vh max(16px, 4vw) 10vh; }
h1, .big { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; line-height: .9; margin: 0; }
.big { margin-top: 12vh; }
.sub { font-size: 13px; color: var(--mute); margin: 18px 0 6vh; }
.bio { font-size: clamp(20px, 2.2vw, 30px); font-weight: 300; line-height: 1.45; letter-spacing: -.01em; max-width: 34em; margin: 0; }
.list { margin-top: 6vh; border-top: 1px solid var(--ink); }
.item { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 24px; padding: 28px 0; border-bottom: 1px solid var(--line); }
.when { font-size: 13px; color: var(--mute); font-variant-numeric: tabular-nums; padding-top: 8px; }
h3 { font-weight: 300; font-size: clamp(24px, 3vw, 44px); letter-spacing: -.03em; line-height: 1.05; margin: 0; }
.org { color: var(--accent); font-size: 14px; margin: 10px 0 0; }
ul { margin: 16px 0 0; padding-left: 18px; font-size: 16px; line-height: 1.6; max-width: 52ch; }
.sw { font-size: clamp(24px, 3.4vw, 52px); font-weight: 200; letter-spacing: -.03em; margin: 5vh 0 0; }
.reg { font-size: 14px; color: var(--mute); margin: 18px 0 0; }
@media (max-width: 760px) {
  .pg { padding: 12vh 16px 8vh; }
  .item { grid-template-columns: minmax(0, 1fr); gap: 6px; }
}
</style>
