# Threadline design system

Threadline is a Reddit research workspace: warm, editorial, evidence-first. This replaces any
previous "Material Design 3" default — the tokens below are what `index.css` actually defines.

## Tokens (`src/index.css`)

All colors are exposed as shadcn semantic tokens (so every existing `components/ui/*` primitive
picks them up automatically) plus a small set of brand tokens for states that shadcn's default
palette doesn't cover (moss/sea/amber success-info-warning tones, flame as the brand accent).

| Semantic token | Light value | Meaning |
| --- | --- | --- |
| `background` / `foreground` | paper `#F6F5F3` / ink `#16161A` | page canvas + body text |
| `card` / `card-foreground` | white / ink | raised surfaces |
| `primary` / `primary-foreground` | flame `#FF4500` / white | brand action color (buttons, links, active tab underline) |
| `secondary` | paper2 `#EFEEEB` | subtle fills (chips, hover rows) |
| `muted` / `muted-foreground` | paper2 / `#71716E` | de-emphasized surfaces/text |
| `border` / `input` | line `#E7E6E2` | hairlines, field borders |
| `destructive` | rose `#E5484D` | delete/error |
| `sidebar` / `sidebar-foreground` | night `#141416` / white | the app sidebar is **always dark**, independent of light/dark mode — set once in `:root`, not gated behind `.dark` |
| `chart-1..5` | flame / moss / sea / amber / rose | consistent categorical palette for any chart/bar |

Brand accent tokens (`--color-flame`, `--color-moss`, `--color-sea`, `--color-amber`, `--color-rose`,
each with a `-soft` background pair) exist for status chips that need a color the shadcn semantic set
doesn't have a slot for (e.g. "Running" = sea, "Ready" = moss, "Needs attention" = rose, in addition to
`destructive`). Defined once in `index.css` `@theme inline`, used via `bg-moss-soft text-moss` etc.

Dark mode (`.dark`, toggled by `use-theme.ts`) keeps the same relationships (ink-on-paper flips to
paper-on-ink) — the sidebar does not change, since it's already dark in both modes.

## Typography

- **Display / headings** (`font-display`): "Instrument Sans" — loaded in `index.html`, falls back to Inter.
- **Body / UI** (`font-sans`, the default): "Inter".
- **Numeric / technical** (`font-mono`): "JetBrains Mono" — used for counts, timestamps, ids, money,
  percentages, anything tabular. Pair with `tabular-nums`.

Headings use a tight tracking (`tracking-tight` / `-0.02em`), consistent with the mockup's editorial feel.

## Status color mapping

Every enum that renders as a colored chip resolves its color from a `Record<Enum, ChipColor>` map
co-located with the chip component (per `AGENTS.md` rule — text labels live in
`config/constants/dropdowns/`, only the *color* mapping stays with the component). Canonical mapping:

| Concept | moss (success) | sea (info/running) | amber (warning) | rose (danger) |
| --- | --- | --- | --- | --- |
| `AnalysisStatus` | `COMPLETED` | `COLLECTING_DATA`/`FILTERING`/`PROCESSING`/`GENERATING_EMBEDDINGS`/`EXTRACTING_KNOWLEDGE`/`AWAITING_BATCH_COMPLETION`/`SYNTHESIZING` | — | `FAILED` (also `PENDING` = neutral/muted) |
| Job/system severity | — | `INFO` | `WARNING` | `ERROR` |
| Sentiment | `POSITIVE` | — | `NEUTRAL` (muted) | `NEGATIVE` |

## Components

- Reuse shadcn primitives from `components/ui/` everywhere; only extend when the mockup needs a
  shape shadcn doesn't ship (added this pass: `slider`, `toggle-group`).
- Cross-section presentational primitives added to `components/ui/` for this build: `source-card.tsx`
  (renders a Post/Comment as a citation-backed card — Sources, Search, Project overview all reuse it),
  `citation-chip.tsx` (the small numbered "① Reddit comment · 342 points" button that opens the
  citation drawer), `stat-tile.tsx`, `mini-bar-chart.tsx` (plain CSS bars — no charting library needed
  for the simple bar/donut visuals in the mockup), `empty-state.tsx`.
- The citation drawer (mockup's right-side source-preview sheet) is a single app-wide singleton:
  `components/providers/citation-drawer-provider.tsx` exposes `useCitationDrawer().open({ postId })`
  or `.open({ commentId })`; any citation chip anywhere in the app can trigger it without prop-drilling.
- Loading states always use `Skeleton` shaped to the final layout — never spinner-only or "Loading…" text.

## Layout shell

- The main app shell (`pages/console/layout.tsx`) reuses the existing `AppSidebar` +
  `SidebarProvider`/`SidebarInset` + `Header` composition already used by `/admin` — same primitives,
  restyled tokens, not a rewrite.
- Sidebar nav groups: Console (Dashboard, New analysis, My research, Saved insights, Search, AI
  assistant), a dynamic "Active project" group (Project, Sources — populated from the
  `active-project` store, hidden until a project has been opened at least once), Settings, and the
  existing role-gated Admin group.
