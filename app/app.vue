<template>
  <div class="min-h-screen bg-slate-50">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: '%s – Zubní lékařství testy',
  htmlAttrs: { lang: 'cs' },
  link: [{ rel: 'icon', href: '/icons/icon-192.png', type: 'image/png' }],
})
</script>
