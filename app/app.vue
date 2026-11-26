<script setup lang="ts">
// Structured data for the whole site: John as a Person and his estimating practice as a
// ProfessionalService. No phone number (none is published) and no client or reference details.
const site = await useSite()
const url = String(useRuntimeConfig().public.siteUrl).replace(/\/+$/, '') + '/'
const ld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${url}#person`,
      name: site.name,
      jobTitle: site.role,
      description: site.bio.replace(/\s+/g, ' ').trim(),
      email: site.email,
      url,
      address: { '@type': 'PostalAddress', addressLocality: site.location.split(/[—,]/)[0]!.trim(), addressCountry: 'PH' },
      knowsAbout: ['Construction estimating', 'Bills of Quantities', 'Quantity take-off', ...site.software],
      hasCredential: site.credentials.map((c) => ({ '@type': 'EducationalOccupationalCredential', name: c })),
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${url}#service`,
      name: `${site.name} — ${site.role}`,
      description: site.services.map((s) => s.title).join(', '),
      url,
      email: site.email,
      founder: { '@id': `${url}#person` },
      areaServed: 'AU',
      address: { '@type': 'PostalAddress', addressLocality: site.location.split(/[—,]/)[0]!.trim(), addressCountry: 'PH' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Estimating services',
        itemListElement: site.services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.get } })),
      },
    },
  ],
}
useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(ld).replace(/</g, '\\u003c') }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
