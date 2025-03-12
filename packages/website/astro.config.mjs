import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
// @ts-check
import { defineConfig } from 'astro/config'
import starlightThemeRapide from 'starlight-theme-rapide'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    starlight({
      plugins: [starlightThemeRapide()],
      title: {
        en: 'Documentation',
        es: 'Documentación'
      },
      logo: {
        src: 'public/logo.webp'
      },
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
      customCss: ['src/assets/docs.css'],
      sidebar: [
        {
          label: 'Getting Started',
          translations: {
            en: 'Getting Started',
            es: 'Empezando'
          },
          items: ['home']
        },
        {
          label: 'Guides',
          translations: {
            en: 'Guides',
            es: 'Guías'
          },
          autogenerate: { directory: 'guides' }
        },
        {
          label: 'Building Canvas',
          translations: {
            en: 'Building Canvas',
            es: 'Creando Canvas'
          },
          autogenerate: { directory: 'build-canvas' }
        },
        {
          label: 'Modules',
          translations: {
            en: 'Modules',
            es: 'Módulos'
          },
          autogenerate: { directory: 'modules' }
        },
        {
          label: 'About Me',
          translations: {
            en: 'About Me',
            es: 'Sobre mi'
          },
          autogenerate: { directory: 'about-me' }
        }
      ]
    })
  ]
})
