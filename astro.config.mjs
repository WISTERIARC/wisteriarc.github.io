import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import { autoNewTabExternalLinks } from './src/autoNewTabExternalLinks';

export default defineConfig({
  site: 'https://wisteriarc.com',
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  markdown: {
    rehypePlugins: [
      [autoNewTabExternalLinks, {
        domain: 'wisteriarc.com', // 必要に応じて本番ドメインや配列に変更
      }],
    ],
  },
});