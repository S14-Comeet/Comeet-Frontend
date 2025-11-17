<template>
  <header class="header">
    <img src="/favicon.svg" alt="Comeet logo" class="logo" />
    <div>
      <p class="title">Comeet Frontend</p>
      <p class="subtitle">Vue 3 + Vite 기본 구조</p>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e1e7ef;
}

.logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}
</style>

