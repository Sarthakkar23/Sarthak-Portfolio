---
name: Sarthak Kar
description: A private dossier for an AI / ML engineer. Noir ground, ivory type, one oxblood seal.
colors:
  ink: "#0d0b0a"
  ink-2: "#15120f"
  ink-3: "#1e1a16"
  ivory: "#efe6d8"
  ivory-2: "#cfc6b8"
  ivory-3: "#a39b8f"
  seal: "#8a1c2b"
  seal-deep: "#5c0f1b"
  seal-ink: "#d9727f"
  line: "rgba(239, 230, 216, 0.12)"
  line-strong: "rgba(239, 230, 216, 0.28)"
  paper: "#e9dfcf"
  paper-ink: "#2a2420"
  verified: "#9cc3a5"
typography:
  display:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(4.2rem, 13.5vw, 13rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.035em"
    fontVariation: "\"opsz\" 96"
  headline:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(2.5rem, 5.2vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "\"opsz\" 96"
  project-title:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(2.6rem, 5.4vw, 4.8rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "\"opsz\" 96"
  lede:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(1.9rem, 3.6vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Didot, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.2vw, 1.95rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  figure:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Didot, Georgia, serif"
    fontSize: "1.45rem"
    fontWeight: 400
    fontFeature: "\"lnum\""
  body:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "\"ss01\", \"cv11\""
  label:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.014rem"
    fontWeight: 600
    letterSpacing: "0.08em"
    fontFeature: "\"smcp\", \"c2sc\""
  caption:
    fontFamily: "Hanken Grotesk Variable, Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.55
  hand:
    fontFamily: "Homemade Apple, cursive"
    fontSize: "clamp(0.6rem, 0.82vw, 0.8rem)"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  none: "0"
  square: "2px"
  round: "50%"
  pill: "999px"
spacing:
  gutter-mobile: "16px"
  gutter: "24px"
  hero-gutter: "clamp(20px, 4vw, 56px)"
  heading-gap: "56px"
  section-mobile: "88px"
  section: "120px"
  panel: "clamp(56px, 8vw, 104px)"
  container: "1240px"
components:
  button-seal:
    backgroundColor: "{colors.seal}"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
  button-seal-hover:
    backgroundColor: "{colors.seal-deep}"
    textColor: "{colors.ivory}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
  button-ghost-hover:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
  button-ivory:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
  button-ivory-hover:
    backgroundColor: "{colors.ivory-2}"
    textColor: "{colors.ink}"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  nav-capsule:
    backgroundColor: "rgba(13, 11, 10, 0.55)"
    textColor: "{colors.ivory-3}"
    rounded: "{rounded.pill}"
    padding: "6px 6px 6px 8px"
  middot-run:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-2}"
    rounded: "{rounded.none}"
    padding: "0"
  project-panel:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel} 0"
---

# Design System: Sarthak Kar

## Overview

**Creative North Star: "The Private Dossier"**

The site reads like a sealed file handed across a dark desk: a warm noir ground with a brown undertone, ivory type in three tiers, and a single oxblood seal that marks the one thing that matters in each viewport. A high-contrast didone carries every name, heading and number; a quiet grotesque carries the reading; labels drop into true small caps. The work leads; the chrome recedes.

Structure comes from hairline ivory rules, not boxes. Sections are editorial rows separated by 1px lines, projects are full-width panels that alternate text and illustration, lists are indexes that indent on hover. Metadata runs as middot-separated small-caps sequences rather than chips. Results are written as sentences or as italic didone numerals inline, never as a stat strip. Illustrations are code-drawn, framed by a single strong hairline, and always captioned as illustrations or synthetic samples.

Motion is ease-out only, slow enough to feel deliberate (0.3s to 0.6s), and every animated surface honours reduced motion with a static end state.

**Key Characteristics:**
- Warm noir ground, never pure black; ivory text tiers all at or above 4.5:1.
- One oxblood seal per viewport: the primary action, the hero stamp, or a reading-progress rule.
- Didone for names, headings and figures; grotesque for prose; small caps for labels and actions.
- Hairlines instead of cards; square (2px) corners on every rectangle.
- Middot runs instead of chips; sentences instead of stat strips.
- Ease-out motion; reduced motion respected; illustrations labelled as illustrations.

## Colors

A near-monochrome noir and ivory palette with one oxblood accent held in reserve.

### Primary
- **Oxblood Seal** (seal): the primary action button, the wax seal that stamps the hero record, text selection, the Notes reading-progress rule, and the scan line in the hero field. Also tints the single warm light pool behind the hero.
- **Dried Oxblood** (seal-deep): hover state of the seal button only.
- **Seal Ink** (seal-ink): the readable oxblood for text on noir, used for form errors and failure states in illustrations. Never for decoration.

### Neutral
- **Noir** (ink): the page ground, html background and scrollbar track.
- **Noir Raised** (ink-2): rare raised grounds such as the case-study diagram plate and the twin panel.
- **Noir Lifted** (ink-3): the lighter stop in illustration and portrait gradients.
- **Ivory** (ivory): headings, names, primary text, focus outline, the inverted ghost-button hover.
- **Bone** (ivory-2): body copy, ledes, summaries.
- **Ash** (ivory-3): captions, metadata, middots, secondary links.
- **Hairline** (line): default section and row dividers.
- **Strong Hairline** (line-strong): ghost-button borders, input underlines, illustration frames, link underlines.

### Illustration materials
- **Prescription Paper** (paper) and **Paper Ink** (paper-ink): the synthetic prescription sheet in the AMRIP illustration; the only light ground in the system.
- **Verified Sage** (verified): a FHIR field confirmed by the verifier inside the AMRIP illustration. Illustration-only.

### Named Rules
**The One Seal Rule.** Oxblood appears at most once per viewport as a solid. If a second seal-coloured element enters the frame, one of them becomes ivory or ghost.

**The Never Black Rule.** The ground is the warm noir, never #000; shadows may use black, surfaces may not.

## Typography

**Display Font:** Bodoni Moda Variable (with Didot, Georgia, serif), optical size pinned to 96 for display and headings
**Body Font:** Hanken Grotesk Variable (with system-ui), stylistic sets ss01 and cv11
**Label Font:** Hanken Grotesk in all-small-caps
**Illustration Font:** Homemade Apple, only for handwriting inside the synthetic prescription

**Character:** A fashion-house didone against an engineer's grotesque: the serif says luxury and authorship, the sans keeps the evidence plain and legible.

### Hierarchy
- **Display** (400, clamp(4.2rem, 13.5vw, 13rem), 0.86): the hero name only, stacked on two lines with the surname set italic and indented. The footer echoes it as a 13.4vw full-bleed wordmark.
- **Headline** (400, clamp(2.5rem, 5.2vw, 4.6rem), 1.02): section headings, balanced wrap. A larger variant runs to 6rem.
- **Project title** (400, clamp(2.6rem, 5.4vw, 4.8rem), 0.98): project panel names; the link draws a 1px ivory underline on hover.
- **Lede** (400, clamp(1.9rem, 3.6vw, 3.4rem), 1.16): results written as a sentence in Bone, with italic Ivory emphasis; max 21em.
- **Title** (400, clamp(1.5rem, 2.2vw, 1.95rem)): service rows, FAQ questions, pager links, note titles.
- **Figure** (italic 400, 1.45rem to 2.1rem, lining numerals): every measured result, inline beside its Ash label.
- **Body** (400, 1.05rem, 1.7): prose in Bone, max 34em to 40em.
- **Label** (600, 1.014rem, 0.08em, all-small-caps): buttons, nav action, middot runs, illustration tags.
- **Caption** (400, 0.76rem to 0.8rem, 1.55): figure captions and the hero sample note, in Ash.

### Named Rules
**The Italic Numeral Rule.** Numbers that prove something are set in italic didone at title size beside a small Ash label; they never get their own tile.

**The Small Caps Rule.** Labels and actions use true all-small-caps with 0.08em tracking, not uppercase.

## Layout

A single 1240px container with 24px gutters (16px under 640px), sections opening 120px apart (88px under 900px), headings sitting 56px above their content. The hero is the exception: full-bleed, at least 100svh, copy anchored bottom-left with clamp(20px, 4vw, 56px) gutters over a WebGL field, a 1.15fr / 0.85fr name-and-meta split that collapses to one column at 900px.

Projects are full-width two-column panels (0.92fr / 1.08fr) separated by hairlines, alternating text and illustration sides; under 900px the illustration always stacks first. Auto-synced repositories follow as a quiet four-column index (name, description, meta, arrow). Asymmetric two-column splits (0.85fr / 1.15fr, 1.4fr / 1fr) carry About, services and FAQ, with the shorter column sticky at 120px on desktop.

Breakpoints: 900px (columns collapse), 760px (nav folds), 640px (mobile gutters, single-column grids).

## Elevation & Depth

The system is flat and tonal. Depth comes from the noir ladder (ink, ink-2, ink-3), from soft radial light pools, and from hairlines; there is no shadow on sections, rows or text blocks. Shadows exist only under things that physically sit on the desk: the seal button, the wax seal, the prescription paper, and the floating chrome (nav when scrolled, twin launcher). They are deep, diffuse and negative-spread, never offset hard shadows.

### Shadow Vocabulary
- **Desk shadow** (`box-shadow: 0 18px 40px -22px rgba(0, 0, 0, 0.9)`): under the seal button and twin launcher.
- **Paper shadow** (`box-shadow: 0 30px 50px -30px rgba(0, 0, 0, 0.9)`): under the synthetic prescription sheet.
- **Seal drop** (`filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.6))`): under the wax seal stamp.
- **Floating chrome** (`box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.6)`): the nav once the page scrolls.

### Named Rules
**The Objects Only Rule.** A shadow means an object lying on the dossier. Layout containers never get one.

## Shapes

Every rectangle is square: buttons and portraits at 2px, rows, panels, inputs and illustration frames at 0. Circles are reserved for objects that are round in the world: the wax seal, the italic monogram, social marks and status dots. The nav capsule is the one pill shape, a floating instrument rather than content. Illustration frames are a single 1px strong hairline around a radial noir gradient; the prescription sheet is rotated -1.4deg.

## Components

### Buttons
Square, small-caps, deliberate.
- **Shape:** squared corners (2px).
- **Seal (primary):** Oxblood with Ivory label, 14px 24px, desk shadow. One per viewport.
- **Ghost:** transparent with a Strong Hairline border; inverts to Ivory with Noir text on hover.
- **Ivory:** solid Ivory with Noir label; hover drops to Bone.
- **Hover / Focus:** colour transitions only, 0.35s ease-out, no lift. Focus is a 1px Ivory outline offset 3px site-wide.
- **Text link:** Ivory text over a Strong Hairline underline with 6px clearance; the underline brightens to Ivory on hover.

### Middot runs
- **Style:** small-caps Bone text at 0.92rem, 0.06em tracking, no background, border or radius; items separated by an Ash middot with 0.6em margins. A separator may end a line but never start one (items do not wrap internally).

### Project panels (in place of cards)
- **Corner Style:** none.
- **Background:** transparent on Noir.
- **Border:** a hairline beneath each panel; the stack opens with a hairline above.
- **Internal Padding:** clamp(56px, 8vw, 104px) vertical.
- **Content:** project title, Ash subtitle, Bone summary, results as italic figures, small Ash tag line, links. The illustration sits opposite with its caption below.

### Index rows
Notes, synced repos, services and FAQ items are rows ruled with hairlines. Hover indents the row 10px to 18px over 0.5s ease-out; nothing lifts or scales.

### Inputs / Fields
- **Style:** transparent, no box, a single Strong Hairline underline, 12px vertical padding, body type; labels in Ash caption above.
- **Focus:** the underline brightens to Ivory; no glow.
- **Error:** message in Seal Ink.

### Navigation
A fixed, centred glass capsule (Noir at 55% with 10px blur, hairline border) holding the italic didone monogram in a circle, Ash links that turn Ivory, and a small-caps ghost action that inverts on hover. On scroll it darkens to 85% and gains the floating-chrome shadow. Under 760px it widens to the viewport, rounds to 24px and folds links behind a toggle.

### Prescription hero (signature)
A full-bleed WebGL field of ivory ink particles that forms a synthetic handwritten prescription; an oxblood scan line reads it, fields lock, and the ink re-forms as a crisp FHIR record that the wax seal stamps (scale 1.5 to 1, rotate -18deg to -12deg). The pointer disturbs the ink. A caption top-left names the current phase in italic didone and labels the sample synthetic with a link to the case study. Reduced motion shows the finished record; a radial fallback replaces WebGL when unavailable.

### Illustrations
Code-drawn figures for each project inside a strong-hairline frame, captioned in Ash as illustrations. States step in with 0.45s to 0.5s ease-out opacity and colour changes; the AMRIP figure boxes handwritten fields in oxblood hairlines and lights verified JSON lines in Verified Sage.

## Do's and Don'ts

### Do:
- **Do** keep the ground at Noir and step up through ink-2 and ink-3 for any raised plate.
- **Do** give each viewport at most one solid oxblood element.
- **Do** separate sections, rows and panels with 1px hairlines (line or line-strong) instead of boxes.
- **Do** set actions and labels in all-small-caps Hanken Grotesk, 600, 0.08em tracking, on 2px-cornered rectangles.
- **Do** write results as sentences or italic didone numerals beside Ash labels.
- **Do** run metadata as middot-separated small caps.
- **Do** use cubic-bezier(0.16, 1, 0.3, 1) for every transition and provide a static end state under prefers-reduced-motion.
- **Do** caption every illustration as an illustration or synthetic sample.

### Don't:
- **Don't** use cards, nested cards, or side-stripe borders to group content.
- **Don't** add eyebrows, kickers or section numbers above headings.
- **Don't** build stat strips or metric tiles.
- **Don't** use rounded chips or pill tags for metadata; use a middot run.
- **Don't** lift, scale or bounce on hover; shift colour, underline or indent instead.
- **Don't** add gradient orbs or decorative blurred blobs; light comes from one radial pool behind the hero.
- **Don't** use pure black (#000) surfaces or uppercase labels.
- **Don't** present an illustration as a screenshot or real result.
