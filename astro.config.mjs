// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://knitly.io',
  server: { port: 4001 },
  integrations: [
    starlight({
      title: 'Knitly Docs',
      description:
        'Documentation for installing, configuring, deploying, and extending Knitly.',
      favicon: '/favicon.svg',
      customCss: ['/src/styles/starlight.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: '',
          },
        },
        {
          tag: 'link',
          attrs: {
            href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&display=swap',
            rel: 'stylesheet',
          },
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/knitly-app/knitly',
        },
      ],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Overview', slug: 'docs' },
            { label: 'Getting Started', slug: 'docs/getting-started' },
          ],
        },
        {
          label: 'Operate Knitly',
          items: [
            { label: 'Configuration', slug: 'docs/configuration' },
            { label: 'Deployment', slug: 'docs/deployment' },
          ],
        },
        {
          label: 'Develop',
          items: [
            { label: 'Architecture', slug: 'docs/architecture' },
            { label: 'API Reference', slug: 'docs/api' },
            { label: 'Custom Extensions', slug: 'docs/custom-extensions' },
            { label: 'Contributing', slug: 'docs/contributing' },
          ],
        },
      ],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});