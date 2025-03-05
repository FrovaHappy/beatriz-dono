// @ts-check
import { defineConfig } from 'astro/config'
import starlightThemeRapide from 'starlight-theme-rapide'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    starlight({
      plugins: [starlightThemeRapide()],
      title: 'Beatriz Dono',
      favicon: 'public/favicon.jpg',
      lastUpdated: true,
      social: {
        github: 'https://github.com/FrovaHappy/beatriz-dono',
        discord: 'https://discord.gg/JRpHsGC8YQ'
      },
      locales: {
        root: {
          label: 'Español',
          lang: 'es'
        },
        en: {
          label: 'English',
          lang: 'en'
        }
      },
      disable404Route: true,
      editLink: { baseUrl: 'https://github.com/FrovaHappy/beatriz-dono/tree/main/packages/website/' },
      customCss: ['src/assets/docs.css']
    })
  ]
})
