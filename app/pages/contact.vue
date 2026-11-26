<script setup lang="ts">
import ContactForm from '~/components/contact/ContactForm.vue'

const site = await useSite()
const id = useRuntimeConfig().public.formspreeId as string
const endpoint = id ? `https://formspree.io/f/${id}` : ''
useHead({ title: 'Contact · Cabulao' })
</script>

<template>
  <section class="pg">
    <h1>Send drawings</h1>
    <p class="sub">Tell John what you need priced.</p>
    <ContactForm :endpoint="endpoint" :email="site.email" :phone="site.phone" :success="site.formSuccess" />
  </section>
</template>

<style scoped>
.pg { padding: 14vh max(16px, 4vw) 10vh; }
h1 { font-size: clamp(44px, 7vw, 110px); font-weight: 200; letter-spacing: -.05em; line-height: .9; margin: 0; }
.sub { font-size: 13px; color: var(--mute); margin: 18px 0 6vh; }
@media (max-width: 760px) { .pg { padding: 12vh 16px 8vh; } }
</style>
