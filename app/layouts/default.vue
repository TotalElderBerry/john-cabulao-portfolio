<template>
  <div class="shell">
    <SiteNav />
    <main><slot /></main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }
</style>
