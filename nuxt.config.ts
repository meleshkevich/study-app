import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  ssr: false,

  modules: ['@vite-pwa/nuxt'],

  css: ['~/assets/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Zubní lékařství testy',
      short_name: 'Zubní testy',
      description: 'Procvičování otázek ke zkoušce ze zubního lékařství',
      theme_color: '#0d9488',
      background_color: '#f8fafc',
      display: 'standalone',
      start_url: '/',
      lang: 'cs',
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
      navigateFallback: '/',
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})
