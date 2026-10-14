# Porsche 911 GT3 RS showcase

Cinematic React + Vite website built around the supplied mountain-road film. Includes responsive navigation, real film playback and audio controls, animated SVG airflow with DRS mode, an accessible image-gallery dialog, and an official Porsche model link.

## Run locally

From `D:\Personal Project\Porches 911 GT3 rs Application`:

```powershell
npm install
npm run dev
```

Open http://127.0.0.1:3300. Keep the terminal running.

## Production

```powershell
npm run build
npm run preview
```

The static production website is in `dist/`. Upload that folder to a static web host. The preview command also uses port 3300: stop the dev process first.

## Checks

```powershell
npx playwright install chromium
npm test
```

Browser coverage: navigation, real playback/audio, aero modes, gallery arrows/Escape/focus, mobile menu/overflow, reduced motion, animation pause, and failed video poster/retry state.

## Assets and content

- Original MP4 is preserved at the workspace root. Website copy is `public/media/911-gt3-rs.mp4`.
- Four JPEG stills extracted at 0.4, 2, 5, and 7 seconds. Their embedded metadata records source provenance.
- Four supplied PNGs now appear in the gallery, with the rear-wheel detail repeated in the design section and the sunset driving shot in the closing scene. Original pixels are preserved; provenance is embedded as metadata.
- Self-hosted Barlow Condensed and Manrope fonts from Google Fonts; OFL licenses included in `public/fonts/`.
- Vehicle figures describe the 992-generation GT3 RS and are sourced from [Porsche Newsroom](https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html). Airflow artwork is illustrative, not a physical simulation.
- No backend or tracking service. Independent showcase, not affiliated with Porsche AG.

## Accessibility

Sound starts muted. Reduced-motion preferences disable autoplay and continuous animations. Film can be played manually. The footer pauses motion graphics independently. Gallery uses a native modal dialog with focus restoration and Escape/arrow-key controls.

## Verification limits

Automated Chromium desktop/mobile emulation and visual screenshots were checked. Physical phones, Safari and public hosting were not checked.

The showcase now includes selectable aero feature close-ups, a dedicated cockpit section, and explanatory gallery captions. Content images use responsive WebP derivatives; full-resolution PNG originals load on demand in the gallery viewer. Validate Chromium with `npm test`; optional WebKit checks require `npx playwright install webkit` and `npx playwright test --browser=webkit`. Windows WebKit native-video checks are explicitly skipped; test actual iOS Safari playback on hardware before public release.

## Deploying to Vercel
Import this repository as a Vite project. `vercel.json` specifies `npm run build` and `dist`; the site uses hash navigation, so it does not need an SPA rewrite. No secrets or database are required.

Sharing metadata uses `SITE_URL` when explicitly configured, otherwise Vercel's production domain (`VERCEL_PROJECT_PRODUCTION_URL`, including its VITE-prefixed form), then the deployment URL. Keep Vercel's automatically exposed system environment variables enabled. A custom domain can be configured later. Local builds intentionally omit a public canonical URL. Public social crawler previews can only be verified after deployment.

Feature links: `#aero-wheel`, `#aero-wing`, `#aero-splitter`, `#cockpit`, `#comparison`. Copy buttons use the current page origin and have a selectable-link fallback if clipboard permission is denied.

The comparison explicitly uses 992.1 launch specifications, PDK: 2021 GT3 versus 2022 GT3 RS. Porsche source links are shown beside the comparison. Supplied images depict the RS, including while GT3 specifications are selected.

## Production deployment
Live site: https://porsche-911-gt3-rs-pi.vercel.app/
Vercel project: hengthebests-projects/porsche-911-gt3-rs
Deployment dashboard: https://vercel.com/hengthebests-projects/porsche-911-gt3-rs

This workspace is linked through the ignored `.vercel` directory. Deploy future updates with `npx vercel deploy --prod --scope hengthebests-projects`. There is no Git repository connected, so changes do not deploy automatically.
