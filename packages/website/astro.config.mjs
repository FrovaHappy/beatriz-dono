// @ts-check
import { defineConfig } from 'astro/config'

import starlight from '@astrojs/starlight'

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), starlight({
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
    editLink: { baseUrl: 'https://github.com/FrovaHappy/beatriz-dono/tree/main/packages/website/' },
    customCss: [
      'src/assets/docs.css'
    ]
  })]
})