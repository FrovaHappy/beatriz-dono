// @ts-check
import { defineConfig } from 'astro/config'

import preact from '@astrojs/preact'

import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact(),
    starlight({
      title: 'Beatriz Dono',
      defaultLocale: 'es',
      locales: {
        es: {
          label: 'Español',
          lang: 'es'
        },
        en: {
          label: 'English',
          lang: 'en'
        }
      },
      disable404Route: true,
      editLink: { baseUrl: 'https://github.com/FrovaHappy/beatriz-dono/tree/main/packages/new-website/' }
    })
  ]
})
