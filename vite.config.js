import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { SITE_URL } = loadEnv(mode, process.cwd(), 'SITE_');
  const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VITE_VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.VITE_VERCEL_URL;
  const site = SITE_URL ? new URL(SITE_URL) : deploymentHost ? new URL(`https://${deploymentHost}`) : null;
  if (site && !['https:', 'http:'].includes(site.protocol)) throw new Error('SITE_URL must be an HTTP(S) URL');
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  return { plugins: [{ name: 'sharing-metadata', transformIndexHtml(html) {
    const image = site ? new URL('/social-preview.jpg', site).href : '/social-preview.jpg';
    const canonical = site ? `<link rel="canonical" href="${escape(site.href)}" /><meta property="og:url" content="${escape(site.href)}" />` : '';
    return html.replace('<!-- PUBLIC_URL_METADATA -->', `${canonical}<meta property="og:image" content="${escape(image)}" /><meta name="twitter:image" content="${escape(image)}" />`);
  } }] };
});
