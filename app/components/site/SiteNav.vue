<template>
  <nav class="nav" aria-label="Main">
    <NuxtLink to="/" class="logo">Cabulao.</NuxtLink>
    <div class="mid">
      <NuxtLink to="/single-trade/">work</NuxtLink>
      <NuxtLink to="/services/">services</NuxtLink>
      <NuxtLink to="/about/">about</NuxtLink>
    </div>
    <NuxtLink to="/contact/">send drawings →</NuxtLink>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  display: flex; justify-content: space-between; align-items: center;
  padding: 26px max(16px, 4vw);
  font-size: 13px;
  mix-blend-mode: difference;
  color: #fff;
}
.logo { font-weight: 500; }
.mid a { margin: 0 16px; }
@media (max-width: 760px) {
  .mid { display: none; }
}
</style>
