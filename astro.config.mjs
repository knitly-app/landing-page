// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://knitly.io',
  server: { port: 4001 },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});