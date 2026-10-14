---
name: 911 GT3 RS showcase
description: A moving motorsport editorial in graphite, silver-white, and red.
colors:
  bg: "#0c0d0f"
  panel: "#141518"
  white: "#f4f3ef"
  muted: "#b4b4b8"
  red: "#ee2937"
  line: "#343538"
  headline-muted: "#9b9ba1"
  cta: "#c91c2a"
  cta-hover: "#aa1824"
typography:
  display:
    fontFamily: "Barlow, sans-serif"
    fontSize: "clamp(84px,11.8vw,190px)"
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Barlow, sans-serif"
    fontSize: "clamp(46px,5.3vw,80px)"
    fontWeight: 900
    lineHeight: 0.99
    letterSpacing: "-.02em"
  numerical:
    fontFamily: "Barlow, sans-serif"
    fontSize: "clamp(76px,8vw,122px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-.02em"
  body:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "12px"
    lineHeight: 1.8
  navigation:
    fontFamily: "Manrope, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
rounded:
  square: "0"
  circle: "50%"
spacing:
  section-gutter: "clamp(24px,5vw,88px)"
  gallery-gap: "16px"
  gallery-gap-mobile: "10px"
components:
  button-primary:
    backgroundColor: "{colors.cta}"
    textColor: "{colors.white}"
    typography: "{typography.navigation}"
    rounded: "{rounded.square}"
    padding: "19px 25px"
  button-primary-hover:
    backgroundColor: "{colors.cta-hover}"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  button-icon-hover:
    backgroundColor: "{colors.red}"
  gallery-frame:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    padding: "0"
---

# Design System: 911 GT3 RS showcase

## Overview

**Creative North Star: "A moving motorsport editorial"**

Silver car photography and film carry the atmosphere. Graphite surfaces, oversized italic lettering, red technical accents, and restrained body copy make the experience feel fast and precise. Large photographic blocks alternate with quieter information and fine dividers.

**Key Characteristics:**
- Graphite and silver-white with purposeful red accents.
- Condensed italic display type paired with compact, clear body text.
- Square photography, thin rules, and outlined circular controls.
- Airflow and wing movement as the signature interaction, with pause and reduced-motion support.

## Colors

The palette takes its contrast from the silver car and graphite setting; red marks performance and interaction.

### Primary
- **Motorsport Red** (`red`): RS lettering, units, aerodynamic highlights, progress, hover states, and focus indicators.
- **Action Red** (`cta`) and **Deep Action Red** (`cta-hover`): filled official-model call to action and its hover state. The darker fill supports contrast for its small silver-white label.

### Neutral
- **Graphite Black** (`bg`): page, mobile navigation, and gallery viewer.
- **Raised Graphite** (`panel`): aerodynamic chapter and image placeholders.
- **Silver White** (`white`): principal text and airflow traces.
- **Technical Grey** (`muted`): supporting copy, captions, and specifications.
- **Headline Grey** (`headline-muted`): secondary phrases in section headings.
- **Graphite Rule** (`line`): dividers, statistical grid, and mode selector baseline.

**The Red Roles Rule.** Keep display red for emphasis and technical states; keep the darker action red for the filled small-text CTA.

## Typography

**Display Font:** locally hosted Barlow Condensed BlackItalic, exposed as `Barlow`, with sans-serif fallback.

**Numerical Font:** locally hosted Barlow Condensed SemiBold, exposed as `Barlow`, normal style.

**Body Font:** locally hosted Manrope variable, with Arial and sans-serif fallback.

Display and headlines are uppercase, italic, and tightly spaced. Numbers use upright condensed type and tabular figures; body and controls stay compact and upright.

### Hierarchy
- **Display:** model identity; desktop size and tracking are defined in frontmatter. It becomes viewport-scaled on tablet and mobile.
- **Headline:** section statements with short, deliberate line breaks. Mobile headings use 48px, with local story and closing variants.
- **Numerical:** large performance values; units switch to smaller red Manrope. Mobile values use 62px, then 52px below 370px.
- **Body:** explanatory copy generally uses 12px; section introductions use 13px. Text blocks stay narrow, typically 300–520px.
- **Navigation and labels:** semibold Manrope; small uppercase technical labels use expanded tracking. The final mobile rules raise small captions and supporting text to 8–10px.

## Layout

Full-width media alternates with inset editorial content. Shared horizontal gutters use the frontmatter value; beyond 1700px, inset content centers around a 1550px span. The hero uses viewport height with explicit minimum and maximum heights so its controls remain legible.

Desktop performance uses three equal columns with vertical rules. Story content pairs a tall photograph with copy. Gallery uses an asymmetric three-column composition, with selected images spanning two columns; its gap contracts on mobile.

At 1000px, spacing and typography tighten and the header's external model link hides. At 650px, navigation becomes a disclosure menu, section introductions stack, the story becomes one column, aerodynamic controls stack, and gallery becomes two columns. Footer actions stack at the right; legal text and source link stack below the divider. At 370px, selected headings and numbers shrink further.

## Elevation & Depth

Surfaces remain flat without card shadows. Depth comes from photographic cropping, graphite tonal layers, dark gradients behind text, and a dark gallery backdrop. The hero display has a restrained drop shadow (`0 5px 18px #0003`) for separation from the footage.

## Shapes

Photography, filled buttons, dialog, and content regions have square corners. Thin dividers describe structure. Circular outlines distinguish playback, directional, and viewer controls; tiny solid circles indicate motion and aerodynamic annotations. Avoid applying rounded card geometry to the photographic blocks.

## Components

### Buttons

The filled CTA is square, with an arrow and generous horizontal separation. It uses action red, deepens on hover, and contracts to 17px 20px padding on mobile. Icon buttons use thin translucent-white circular borders; hover changes both fill and border to display red. Text links use a thin underline and turn red on hover.

All links and buttons receive a red focus-visible outline (2px, offset 6px). Preserve accessible names on icon-only controls.

### Navigation

The desktop header overlays footage, with a fine translucent divider and red underline reveal on link hover. The mobile menu opens on graphite, shows larger vertical links, exposes expanded state, closes after selection, and supports Escape. The footer repeats the spaced wordmark, motion control, back-to-top action, and fine divider language.

### Photography and Gallery Viewer

Square image buttons carry bottom captions over dark gradients. Hover gently scales and brightens photography. The native modal viewer uses graphite, a dark backdrop, contained photography, circular previous/next controls, and a tabular image count. Escape closes it; arrow keys change images; closing restores focus to the image trigger.

### Airflow and DRS

Thin animated SVG traces move across subdued photography. Downforce uses silver-white airflow; drag reduction switches traces to red and accelerates them. Pressed-state mode controls use a red underline, update explanatory text, and flatten the wing schematic with an eased transition. The visualization is explicitly illustrative.

### Motion and Media Controls

Hero film has independent playback and sound controls; audio starts muted and media failure exposes a retry message. The footer pauses CSS animations and resets hero parallax. Reduced-motion preference stops CSS animation and transitions, removes parallax, shows static airflow, avoids counter animation, and prevents automatic film playback. Film pause remains a separate control.

## Do's and Don'ts

### Do:
- **Do** lead with the supplied silver/red car imagery and preserve room for the car beneath oversized lettering.
- **Do** pair italic display type with upright condensed numbers and Manrope body text.
- **Do** keep square photographic blocks, fine dividers, visible focus, and circular utility controls.
- **Do** preserve independent film controls, the animation pause action, and reduced-motion alternatives.

### Don't:
- **Don't** replace the darker filled CTA colors with display red.
- **Don't** turn the editorial layout into a uniform rounded-card grid.
- **Don't** introduce ornamental shadows or unrelated accent colors into the graphite/silver/red world.
- **Don't** remove descriptive captions, accessible control names, or keyboard gallery behavior.
