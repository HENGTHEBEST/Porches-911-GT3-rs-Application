import { test, expect } from '@playwright/test';

test('hero and navigation make the showcase explorable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('911 GT3 RS');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Performance' }).click();
  await expect(page).toHaveURL(/#performance$/);
  await expect(page.locator('#performance')).toBeInViewport();
});

test('film controls change actual playback and audio', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Windows WebKit does not provide a reliable native MP4 playback pipeline.');
  await page.goto('/');
  await expect(page.locator('video')).toHaveJSProperty('paused', false);
  await page.getByRole('button', { name: 'Pause film', exact: true }).click();
  await expect(page.locator('video')).toHaveJSProperty('paused', true);
  await page.getByRole('button', { name: 'Play film', exact: true }).click();
  await expect(page.locator('video')).toHaveJSProperty('paused', false);
  await page.getByRole('button', { name: 'Enable sound' }).click();
  await expect(page.locator('video')).toHaveJSProperty('muted', false);
  await page.getByRole('button', { name: 'Mute sound' }).click();
  await expect(page.locator('video')).toHaveJSProperty('muted', true);
});

test('aero modes reveal their own content and gallery is keyboard usable', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Drag reduction' }).click();
  await expect(page.locator('#aero-description')).toContainText('DRS');
  await expect(page.getByRole('button', { name: 'Drag reduction' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'View image 1' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.viewer-count')).toHaveText('01 / 04');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.viewer-count')).toHaveText('02 / 04');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'View image 1' })).toBeFocused();
});

test('mobile menu closes after navigation without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Gallery' }).click();
  await expect(page).toHaveURL(/#gallery$/);
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('reduced motion leaves film paused and content visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('video')).toHaveJSProperty('paused', true);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('button', { name: 'Play film', exact: true }).click();
  await expect(page.locator('video')).toHaveJSProperty('paused', false);
});

test('continuous motion can be paused independently of film playback', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await expect(page.getByRole('button', { name: 'Resume animations' })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.flow-moving').first().evaluate(node => getComputedStyle(node).animationPlayState)).toBe('paused');
  await page.getByRole('button', { name: 'Resume animations' }).click();
  await page.locator('.aero-stage').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.flow-moving').first().evaluate(node => getComputedStyle(node).animationPlayState)).toBe('running');
});

test('media failure keeps the poster and provides a retry action', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Windows WebKit native media requests bypass Playwright routing.');
  await page.route('**/media/911-gt3-rs.mp4', route => route.abort());
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Film unavailable');
  await expect(page.getByRole('button', { name: 'Play film', exact: true })).toBeVisible();
  await expect(page.locator('video')).toHaveAttribute('poster', '/media/hero.jpg');
  await page.unroute('**/media/911-gt3-rs.mp4');
  await page.getByRole('button', { name: 'Play film', exact: true }).click();
  await expect(page.locator('video')).toHaveJSProperty('paused', false);
});

test('primary action text has accessible contrast at rest and on hover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const link = page.locator('.primary-link');
  const contrast = () => link.evaluate(node => {
    const luminance = value => {
      const channels = value.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    };
    const style = getComputedStyle(node);
    const a = luminance(style.color), b = luminance(style.backgroundColor);
    return (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
  });
  expect(await contrast()).toBeGreaterThanOrEqual(4.5);
  await link.hover();
  expect(await contrast()).toBeGreaterThanOrEqual(4.5);
});

for (const mobile of [false, true]) {
  test(`navigation follows scroll direction on ${mobile ? 'mobile' : 'desktop'}`, async ({ page, browserName }) => {
    if (mobile) await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const header = page.locator('.site-header');
    await expect(header).toBeInViewport();
    await page.evaluate(() => window.scrollTo(0, 650));
    await expect(header).not.toBeInViewport();
    await page.evaluate(() => window.scrollTo(0, 450));
    await expect(header).toBeInViewport();
    if (mobile) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.evaluate(() => window.scrollTo(0, 700));
      await expect(header).toBeInViewport();
      await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
      await page.keyboard.press('Escape');
      await page.locator('.menu-toggle').evaluate(node => node.blur());
    } else {
      await page.evaluate(() => window.scrollTo(0, 700));
      await expect(header).not.toBeInViewport();
      await page.keyboard.press('Tab');
      if (browserName === 'webkit') await header.locator('.wordmark').focus();
      else await page.keyboard.press('Tab');
      await expect(header).toBeInViewport();
      await expect(header.locator('.wordmark')).toBeFocused();
      await header.locator('.wordmark').evaluate(node => node.blur());
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toBeInViewport();
  });
}

test('motion graphics stop offscreen, respond to aero mode, and respect motion preferences', async ({ page }) => {
  await page.goto('/');
  const vector = page.locator('.force-vectors path').first();
  const animation = property => vector.evaluate((node, property) => getComputedStyle(node)[property], property);
  expect(await animation('animationPlayState')).toBe('paused');
  await page.locator('.aero-console').scrollIntoViewIfNeeded();
  await expect.poll(() => animation('animationPlayState')).toBe('running');
  expect(await animation('animationName')).toBe('force-down');
  await page.getByRole('button', { name: 'Drag reduction' }).click();
  expect(await animation('animationName')).toBe('force-forward');
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await page.locator('.aero-console').scrollIntoViewIfNeeded();
  expect(await animation('animationPlayState')).toBe('paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await animation('animationName')).toBe('none');
  await page.locator('.story-copy h2').scrollIntoViewIfNeeded();
  await expect(page.locator('.story-copy h2')).toBeVisible();
  expect(await page.locator('.story-copy h2').evaluate(node => getComputedStyle(node).clipPath)).toBe('none');
});

test('aero details, cockpit and full-resolution gallery work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const originals = [];
  page.on('request', request => { if (/\/media\/.*\.png$/.test(request.url())) originals.push(request.url()); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Front splitter', exact: true }).click();
  await expect(page.locator('#aero-detail h3')).toHaveText('Divide the air. Find the grip.');
  await page.getByRole('button', { name: 'Wheel-arch vents', exact: true }).click();
  await expect(page.locator('#aero-detail h3')).toHaveText('Give pressure a way out.');
  await expect(page.getByRole('button', { name: 'Wheel-arch vents', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#cockpit').scrollIntoViewIfNeeded();
  await expect(page.locator('#cockpit img')).toBeVisible();
  await expect.poll(() => page.locator('#cockpit img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.locator('#cockpit img').evaluate(img => img.currentSrc)).toContain('.webp');
  expect(originals).toHaveLength(0);
  await page.getByRole('button', { name: 'View image 3', exact: true }).click();
  await expect(page.locator('.viewer-description')).toContainText('Carbon seat shells');
  await expect(page.locator('.image-viewer>img')).toHaveAttribute('src', '/media/interior.png');
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('film viewer pauses the background and returns keyboard focus', async ({ page, browserName }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Watch the film', exact: true });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Watch the GT3 RS film' })).toBeVisible();
  await expect(page.locator('.hero-media video')).toHaveJSProperty('paused', true);
  await expect(page.locator('.film-viewer video')).toHaveAttribute('controls', '');
  if (browserName !== 'webkit') await expect.poll(() => page.locator('.film-viewer video').evaluate(video => video.currentTime)).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.film-viewer')).not.toBeVisible();
  await expect(page.locator('.film-viewer video')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('model comparison and direct aero links restore the correct content', async ({ page }) => {
  await page.goto('/#aero-splitter');
  await expect(page.locator('#aero-detail img')).toHaveAttribute('src', '/media/splitter-closeup-1280.webp');
  await expect(page.getByRole('button', { name: 'Front splitter', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Wheel-arch vents', exact: true }).click();
  await expect(page).toHaveURL(/#aero-wheel$/);
  await expect(page.locator('#aero-detail img')).toHaveAttribute('src', '/media/wheel-closeup-1280.webp');
  await page.goBack();
  await expect(page.locator('#aero-detail h3')).toHaveText('Divide the air. Find the grip.');
  await page.getByRole('button', { name: '911 GT3', exact: true }).click();
  await expect(page.locator('.comparison-specs')).toContainText('510 PS');
  await expect(page.locator('.comparison-specs')).toContainText('318 km/h');
  await page.getByRole('button', { name: '911 GT3 RS', exact: true }).click();
  await expect(page.locator('.comparison-specs')).toContainText('525 PS');
});

test('copy feature link reports success or provides a selectable fallback', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Permission denied'); } }, configurable: true }));
  await page.goto('/#aero-wing');
  await page.getByRole('button', { name: 'Copy feature link' }).click();
  await expect(page.getByRole('textbox', { name: 'Section link' })).toHaveValue(/#aero-wing$/);
  await expect(page.getByRole('status')).toHaveText('Select and copy the link below');
});

test('feature link copies the current feature URL', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Clipboard permission automation differs across browser engines.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#aero-wing');
  await page.getByRole('button', { name: 'Copy feature link' }).click();
  await expect(page.getByRole('status')).toHaveText('Link copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('http://127.0.0.1:3300/#aero-wing');
});

test('shared cockpit links open directly at the interior section', async ({ page }) => {
  await page.goto('/#cockpit');
  await expect(page.locator('#cockpit')).toBeInViewport();
  await expect.poll(() => page.locator('#cockpit img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
});
