<script setup lang="ts">
defineProps<{ error: { statusCode?: number; statusMessage?: string; message?: string } }>()
useHead({ title: 'Not found — John Louis Cabulao', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <NuxtLayout>
    <section class="nf">
      <p class="code num">404</p>
      <h1>Not found</h1>
      <p>That page does not exist, or the job has not been published.</p>
      <NuxtLink to="/">Back to home →</NuxtLink>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.nf { padding: 16vh max(16px, 4vw); }
.code { font-size: 13px; color: var(--mute); margin: 0 0 12px; }
h1 { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; margin: 0 0 24px; line-height: .9; }
p { font-size: 14px; color: #555; }
a { display: inline-block; margin-top: 16px; font-size: 14px; box-shadow: inset 0 -1px 0 var(--accent); }
</style>
