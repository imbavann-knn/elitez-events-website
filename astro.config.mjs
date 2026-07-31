import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  site: 'https://events.elitez.ai',
  trailingSlash: 'never',
  // Emit flat files (pages/services.html) not directories (pages/services/index.html)
  // so Cloudflare serves clean no-trailing-slash URLs matching the sitemap + canonicals,
  // eliminating the redirect hops that Search Console flagged as "Redirect error".
  build: { format: 'file' },
});
