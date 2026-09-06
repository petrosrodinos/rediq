<!-- SEED: established with the user before implementation; re-run a design audit once there's real built UI to capture the actual tokens and components. -->

---
name: Rediq
description: A calm, evidence-first knowledge layer over Reddit discussions
colors:
  primary: "#E4572E"
  primary-deep: "#C2431F"
  neutral-bg: "#FAFAF8"
  neutral-surface: "#FFFFFF"
  neutral-border: "#E7E4DF"
  ink: "#1C1B1A"
  ink-muted: "#6B675F"
  success: "#2F9E60"
  danger: "#CC3333"
  chart-1: "#3B6E8F"
  chart-2: "#2F9E60"
  chart-3: "#8A6BB0"
  chart-4: "#B8862B"
  chart-5: "#5C6670"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
---

# Design System: Rediq

## Overview

**Creative North Star: "The Evidence Desk"**

Rediq turns thousands of Reddit comments into something a researcher can actually trust and act on, so the UI should feel like a calm, well-lit desk for reviewing evidence — not a chat toy and not a busy analytics dashboard. Neutrals carry almost every screen: warm off-white backgrounds, quiet borders instead of heavy shadows, and generous whitespace so dense report content (topics, statistics, citations) stays scannable rather than overwhelming.

A single accent — a confident, Reddit-adjacent orange — is used deliberately and sparingly: it marks what you can *act* on (primary buttons, links) and what is *evidence* (citation badges, source references). It never fills large surfaces or competes with itself; its rarity is what makes it legible as a signal. This is a conscious echo of Reddit's own energy, since the product's whole value is sourced *from* Reddit — but the exact shade and its restrained usage keep Rediq visually its own product, not a Reddit reskin.

Typography is a single modern sans (Inter) across every role, chosen for legibility at high information density rather than personality — this is a tool for reading and trusting numbers and claims, not a brand showcase.

**Key Characteristics:**
- Neutral-first: orange appears only on actions and evidence, never as decoration.
- Flat by default; depth is earned only by temporary, overlay UI.
- Every citation looks and behaves the same everywhere it appears.
- Numbers (scores, counts, statistics) stay visually stable and aligned.

## Colors

The palette is intentionally narrow: warm neutrals do the heavy lifting, one orange accent marks action and evidence, and two muted semantic colors carry agreement/disagreement — nothing else competes for attention.

### Primary
- **Ember Orange** (`#E4572E`): The one accent color. Primary buttons, links, active nav/tab states, and — most importantly — citation badges and "View on Reddit" actions. A confident, Reddit-adjacent orange (deliberately not Reddit's exact `#FF4500`, and never paired with Reddit's logo/mascot) that signals "this is sourced" or "you can act here."
- **Ember Orange, Deep** (`#C2431F`): Hover/active/pressed state for anything using Ember Orange.

### Neutral
- **Paper** (`#FAFAF8`): App background. Warm, not stark white — reduces glare across long report-reading sessions.
- **Surface** (`#FFFFFF`): Cards, panels, and the AI Assistant panel sit one step lighter than Paper so structure is visible without a shadow.
- **Warm Ash** (`#E7E4DF`): Borders, dividers, and table rules. Structure is drawn with hairlines, not shadows.
- **Ink** (`#1C1B1A`): Primary text. A soft, warm near-black rather than pure `#000` — less harsh across long-form report reading.
- **Ink, Muted** (`#6B675F`): Secondary text — timestamps, author names, helper copy, comment scores.

### Semantic
- **Consensus Green** (`#2F9E60`): Used only where the product itself names agreement — the Consensus section, "supported by N discussions" indicators.
- **Contradiction Red** (`#CC3333`): Used only where the product names disagreement or failure — the Disagreements & Contradictions section, form/validation errors, failed analysis jobs. Kept clearly cooler/redder than Ember Orange so the two are never confused at a glance.

### Named Rules
**The Evidence-Only Rule.** Ember Orange is reserved for two things: things the user can *do* (primary actions, links) and things that are *evidence* (citations, source badges, "View on Reddit"). If a use case is neither, it doesn't get the accent color.

## Typography

**Display/Body/Label Font:** Inter (fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`)

**Character:** One typeface, weight and size doing all the differentiating work. Nothing decorative — this is a reading and reviewing tool, and every extra typographic voice is one more thing competing with the actual Reddit-sourced content and citations on screen.

### Hierarchy
- **Display** (600, `clamp(1.75rem, 3vw, 2.5rem)`, 1.15): Research project titles, the knowledge report's Executive Summary heading.
- **Headline** (600, 1.5rem, 1.25): Section headings within a report (Key Insights, Topics, Problems, etc.).
- **Title** (600, 1.125rem, 1.3): Card titles, topic names, individual insight headings.
- **Body** (400, 0.9375rem, 1.6): Report prose, comment/post excerpts, AI agent answers. Cap prose measure at ~70ch so long report sections stay readable.
- **Label** (500, 0.75rem, 1.4, +0.02em, uppercase where used for eyebrows): Metadata — scores, dates, source type tags, status badges.

### Named Rules
**The Tabular Numerals Rule.** Every score, comment count, upvote count, and statistic uses `font-variant-numeric: tabular-nums`, so numbers in tables and side-by-side comparisons stay aligned instead of jittering as digits change width.

## Layout

A calm, moderately dense dashboard grid: a persistent sidebar (Dashboard, New Analysis, My Research, Saved Insights, Search, AI Assistant, Settings) at a fixed width, with report/research content in a centered column capped around 1120–1280px so multi-column stat/topic grids stay legible without stretching to ultrawide widths. Spacing follows a 4px base scale (`4 / 8 / 16 / 24 / 40`) — tight enough for data-dense tables and source lists, generous enough that report prose doesn't feel cramped. The AI Assistant is a persistent right-hand panel on wide viewports and collapses to a full-screen tab on narrow ones, so it's always reachable without displacing the report content.

## Elevation & Depth

Flat by default. Structure between surfaces (cards, the sidebar, table rows) is drawn with a 1px Warm Ash border, not a shadow — this keeps a report full of cards and citation chips from feeling visually noisy. Shadows are reserved for genuinely temporary, floating UI: dropdowns, popovers, dialogs, and toasts, where a soft shadow communicates "this is above the page and will go away."

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 8px 24px rgba(28, 27, 26, 0.12)`): Popovers, dropdown menus, command palette.
- **Modal** (`box-shadow: 0 16px 48px rgba(28, 27, 26, 0.18)`): Dialogs and confirmation modals.

### Named Rules
**The Flat-At-Rest Rule.** Nothing that sits permanently on the page (cards, panels, sidebar, table rows) carries a shadow. Shadows only appear on UI that is temporarily floating above the page.

## Shapes

Corners are quietly rounded, never sharp and never bubbly: `10px` as the default radius for cards, inputs, and buttons (`6px` for small/compact controls like table action buttons, `14px` for large containers like modals and the report panel). Citation badges and source-reference chips are the one fully-pill (`999px`) shape in the system — a deliberate, repeatable silhouette so "this is a piece of evidence" is recognizable at a glance anywhere in the product, distinct from ordinary rounded buttons and tags.

## Do's and Don'ts

### Do:
- **Do** reserve Ember Orange for actions and evidence (buttons, links, citation badges, "View on Reddit") — see the Evidence-Only Rule.
- **Do** let Paper and Surface neutrals carry the vast majority of every screen; the report content and citations are what should stand out, not the chrome.
- **Do** give every citation/source-reference the same pill shape and orange-on-neutral treatment wherever it appears (report, search results, AI agent answers, source explorer).
- **Do** use tabular numerals for every score, count, and statistic.
- **Do** keep cards and panels flat (border only); reserve shadows for overlay/temporary UI.

### Don't:
- **Don't** use Reddit's exact orange (`#FF4500`) or Reddit's logo/Snoo mascot anywhere — Ember Orange should feel adjacent, not identical, so Rediq never reads as an official Reddit product.
- **Don't** introduce a second bright accent color for "extra" emphasis; agreement/disagreement states use only Consensus Green and Contradiction Red.
- **Don't** add drop shadows to cards, tables, or the sidebar at rest.
- **Don't** mix in a second typeface for "personality" (a serif for headlines, a display font for marketing, etc.) — the single Inter family is deliberate.
