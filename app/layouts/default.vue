<template>
  <div class="shell">
    <a href="#main" class="skip">Skip to content</a>
    <SiteNav />
    <main id="main" tabindex="-1"><slot /></main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }
main:focus { outline: none; }
.skip {
  position: fixed; left: 16px; top: 8px; z-index: 100; padding: 8px 12px;
  background: var(--ink); color: var(--paper); font-size: 13px;
  transform: translateY(-200%);
}
.skip:focus { transform: none; }
</style>
