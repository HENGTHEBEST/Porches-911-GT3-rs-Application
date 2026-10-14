# QA inventory and evidence

## Requirement mapping
- Cinematic provided video: local H.264/AAC, hero poster, actual play/pause/mute tested; desktop/mobile hero screenshots.
- Supplied visual references: graphite/silver/red, italic display, technical visual, car photography; full-page desktop/mobile screenshots.
- Motion: hero intro, scroll parallax, animated counters, SVG airflow/DRS wing, moving typography; reduced-motion and pause tests.
- Performance and content: official Porsche 992 GT3 RS source linked in footer; correct PS rather than incorrectly labelled horsepower.
- Responsive: 1440x900 and 390x844 with zero horizontal overflow; mobile navigation open/close and target hash tested.
- Gallery: view, next, keyboard navigation, Escape and focus restoration tested.
- Error/off-happy path: aborted video keeps poster and retry control. OS reduced motion pauses film until explicit play.
- Production: `npm run build` passed. Eight tests passed, including real failed-video recovery and primary-action contrast in normal and hover states. Runtime `pageerror` collection empty.

## Capture validity
Full-page images from document top. All non-dialog images decoded, font loading awaited, reduced-motion preference settles animations. Supplemental aero and gallery captures use real viewport captures after scrolling; element captures were replaced because Chromium temporarily composited offscreen fixed elements inside those tall screenshot clips.

## Design detector
One warning: navigation underline width transition. Changed to transform scaleX. No other findings in detector output. Detector not repeated per skill's bounded-pass instruction.

## Limits
No physical phone/Safari validation or public deployment. SVG airflow is visibly labelled illustrative.

## Final review and correction
Independent finish review: fidelity and composition pass. Required primary-button contrast correction resolved: normal 5.14:1, hover 6.60:1. Verdict SHIP for the listed fix. A real recovery test then found failed autoplay can leave native video paused=false with networkState=3; retry now takes priority over pause on error. Final full suite: 8 passed. Final production build: successful. HTTP 200 verified. Original video and website copy SHA-256 match.

## 2026-10-14 supplied-image refinement
Integrated all four original user PNGs in gallery, rear-detail story and sunset closing scene. Hero title reduced from 241.92px to 169.92px at 1440px width and from 70.2px to 54.6px at 390px width. All four images decoded; no horizontal overflow at either viewport. Final eight browser tests passed with two workers; production build passed. Default test workers now two to avoid eight concurrent media-loading browsers saturating the local environment (initial unrestricted run timed out during navigation, bounded run passed). Detector reported only design-document palette/type-ramp advisories, including existing transparent overlays and responsive variants; no unrelated design-system repairs made.

### Additional motion pass
- Added one-shot headline masks, hero supporting-copy entrances, detail-image settling and closing-image movement. Existing type sizes and imagery remain unchanged.
- Wing schematic has animated directional vectors for downforce and DRS, plus pulsing photo annotations. These remain illustrative, not simulation data.
- IntersectionObserver pauses loop graphics offscreen; background tabs pause CSS animation. Reduced motion disables the new animation, and the footer pause control settles reveal content immediately.
- Verified desktop 1440px and mobile 390px screenshots (motion-1440.png / motion-390.png), no horizontal overflow, all 11 Playwright tests and production build. Physical phones and Safari not tested.

### Interactive engineering and cockpit
- Three keyboard-accessible aero selectors show matching image crops and explanations; selecting a feature scrolls its detail into view. DRS retains its animated schematic.
- Added cockpit section and navigation, with seat, control and material descriptions.
- Gallery has explanatory captions; original PNGs load only while its dialog is open.
- Responsive WebP sizes serve content images. Four full-resolution derivatives total 579,878 bytes versus 10,579,038 bytes for their original PNGs (94.5% smaller); original files preserved.
- Desktop 1440px and mobile 390px reviewed in enhanced-* screenshots. Chromium suite: 12 passed. WebKit: 10 passed, two native-media checks skipped because Windows WebKit media transport cannot be reliably intercepted or validated here. Keyboard-link focus is checked explicitly because WebKit's default tab policy differs.
- An exploratory --browser=all run also attempted uninstalled Firefox; those launch failures do not validate Firefox. Physical iOS Safari and physical phone playback remain unverified.

### Film, comparison, supplied close-ups and sharing
- Preserved three new attachments as wheel-closeup.png, wing-closeup.png and splitter-closeup.png; generated responsive WebP derivatives and replaced the old crops.
- Native film dialog includes playback, sound and browser fullscreen controls, pauses the hero, supports Escape/focus restoration, and removes its media on close.
- Added sourced 992.1 GT3/GT3 RS PDK comparison, hash-restored aero features, copy-link success/fallback, 1200x630 social-preview.jpg, OG/Twitter metadata and Vercel build settings.
- Checked desktop 1440 and mobile 390 film/comparison/feature screenshots, with no horizontal overflow. Added extra anchor offset for the dynamic header.
- Chromium tests cover actual film currentTime, comparison switching, hash Back navigation, and clipboard success/fallback. Three new interaction checks also passed WebKit; native WebKit video decoding remains outside the validated coverage on Windows.
- Production slow-mobile sample: 390x844, DPR2, 1.6 Mbps down, 150ms latency, 4x CPU; LCP 1524ms, CLS 0.00706, DOM ready 1028ms. Single local lab sample over a 10-second observation window, not field metrics or a Lighthouse score.
- Vercel metadata transform asserted against a synthetic production host. No remote deployment or real social crawler check performed. Physical iPhone/Android and Safari playback still require hardware.

### Production deployment, 2026-10-14
- Production: https://porsche-911-gt3-rs-pi.vercel.app/
- Vercel deployment dpl_A7q7YD9wYeaTZpoQztw6fk7ZKp4t, READY, production alias assigned. CLI 64.0.2, account hengthebest, scope hengthebests-projects.
- Fixed UTF-8 BOM in vercel.json so CLI can parse it. Excluded local docs, tests, environment files and duplicate root video through .vercelignore. Ignored .vercel project linkage.
- Fixed initial normal-section hash navigation; a direct cockpit URL now scrolls to rendered content. Local tests: 17 passed; production build passed.
- Public unauthenticated HTTP 200, canonical/OG point to production origin, social and WebP assets HTTP 200, MP4 byte-range request HTTP 206.
- Live desktop and mobile browser checks cover cockpit deep link, aero selection, GT3 switch, actual film currentTime, Escape cleanup, no page errors and no horizontal overflow. The first immediate mobile DOM assertion raced React's close event; retried using awaited Playwright assertions.
- Physical device and iOS Safari playback still unverified. No Git remote or automatic deployment configured.
