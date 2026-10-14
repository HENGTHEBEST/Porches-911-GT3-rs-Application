# Approved GT3 RS showcase design

The user approved a single-page React + Vite website in this folder on 2026-10-14. The supplied references govern the visual direction: graphite, silver, red, oversized italic typography, cinematic images and technical editorial detail.

## Experience
Full-screen film hero with model name, accessible mute/pause controls, navigation and exploration link. Performance section with correctly labelled 525 PS, 3.2 seconds and 296 km/h figures. Aerodynamics section combines a video still with animated SVG airflow, explorable aero features and DRS graphic states (illustrative, not a simulation). Gallery presents extracted film stills with a keyboard-accessible native dialog viewer. Closing scene links to the official Porsche model page.

## Implementation
React root component owns simple UI state. CSS provides responsive composition, scroll-linked progressive enhancement and motion. Native video, dialog, IntersectionObserver and SVG keep dependencies minimal. Static assets and local fonts ship in public. No backend, accounts, forms or fake integrations.

## Failure and accessibility
Posters remain if video cannot play. Failed playback offers retry. Audio starts muted. Reduced-motion disables autoplay and continuous effects while retaining all content. Gallery dialog supports Escape, arrow keys, explicit close and focus restoration. Mobile navigation uses real anchor links.

## Verification
Build production bundle. Browser tests cover navigation, playback, sound, feature selection, gallery arrows and dialog dismissal, mobile navigation, overflow and reduced motion. Inspect desktop and mobile screenshots in one batch; fix observed defects together. Official content source is linked in the footer.
