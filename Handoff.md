# Sora Astral — Three.js portfolio handoff

## Active project

- Repository: https://github.com/celestial-sora/celestial-sora
- Production branch: `main`
- Production URL: https://celestial-sora.vercel.app
- Stack: Astro static HTML, Three.js procedural WebGL, GSAP camera transitions, global CSS.
- This is the miniature universe portfolio. The older file explorer portfolio lives in `celestial-sora.github.io`; do not use that implementation for this project.
- This document supersedes the former file explorer handoff. `DEVELOPMENT.md` describes the current scene lifecycle, interaction and performance budgets.

## Current visual direction

The homepage follows the reference image supplied on 2026-10-07:

- Deep black space inside a thin warm border with generous rounded corners.
- Small Sora Astral wordmark at top left and opt-in sound at top right.
- Large Instrument Serif headline at lower left: “Sora Astral builds / small universes / for the web.” The middle line is italic champagne.
- A soft warm galaxy nucleus offset to the right of the orbital center, blue-grey spiral clouds, sparse dust, and faint background stars.
- Five small project planets in one tilted orbital plane. Vivian is the largest, with gold rings; Oonchai is dark red, the Qwen model ice blue, Larp LLM muted violet, and Sora teal.
- Planet codes remain visible; project names appear on hover or keyboard focus. Accessible names and the project index stay available.
- A numbered rail provides Origin, five project worlds, and Signal. Coordinates and a travel hint sit at the bottom.
- On mobile, the introduction sits above the galaxy and the rail becomes horizontal. Keep text and controls outside the scene's measured reserved areas.

## Existing behavior to preserve

- Clicking a planet, label or project index item flies to its world and opens its story.
- Scroll, swipe, the numbered rail, and navigation keys travel through seven stops.
- Native dialogs preserve keyboard focus; Escape returns to the galaxy; left/right keys switch project stories.
- The project index, About/Sora information, eight public social links, and optional synthesized interaction sound remain usable.
- Reduced motion stops continuous motion and makes camera changes immediate.
- Hidden/offscreen rendering pauses. Mobile has lower geometry and particle counts and no bloom; sustained slow frames lower quality.
- WebKit uses the existing direct rendering path and retained buffer. Do not reintroduce compositor fading into that path.
- WebGL failure/context loss falls back to CSS planets and the same project controls. No-JavaScript HTML still contains project information and public links.
- Vivian's private deployment URL must never appear in this public portfolio.
- Keep the local Permanent Marker title for Larp LLM and Sweetbliss title for Sora in journey headings, stories, the index and labels.

## Main files

- `src/pages/index.astro`: semantic page, labels, navigation and dialogs.
- `src/galaxy/projects.js`: project metadata, palettes, orbital angles and radii.
- `src/galaxy/OrbitLayout.js`: shared responsive tilted orbital plane.
- `src/galaxy/GalaxyScene.js`: lifecycle, measured framing bounds, rendering and label projection.
- `src/galaxy/CameraRig.js`: GSAP transitions, perspective fitting and pointer parallax. Rings use the planet's radius for fitting.
- `src/galaxy/Planet.js`, `shaders.js`: surfaces, atmosphere, proportional rings and orbiting dust.
- `src/galaxy/Nebula.js`, `Starfield.js`: procedural galaxy nucleus, clouds, dust and background stars.
- `src/galaxy/Renderer.js`: adaptive quality, bloom and WebKit direct rendering.
- `src/galaxy/Interaction.js`: raycasting, scrolling and touch.
- `src/galaxy/app.js`: travel copy, dialogs, focus, loading, optional sound and fallback.
- `src/styles/galaxy.css`: active visual system and responsive layout.
- `src/components/GalaxySocials.astro`, `src/galaxy/socials.js`: eight public social destinations.

Legacy components and `global.css` may still exist; they are not the active homepage composition. Do not restore the previous file explorer hero or its device mockups.

## Required workflow

Follow the owner's explicit workflow to avoid exhausting Vercel deployment limits:

1. Fetch/pull the latest code before editing. Check for relevant work in existing branches and preserve it.
2. Edit the related files in reviewable batches. Local `git add` and commits are allowed during the work.
3. Complete all code, responsive fixes and documentation before any remote push.
4. Verify the production build, `git diff --check`, and the affected browser flows.
5. **Push `main` exactly once after the entire task is ready. Never push after each file or commit.** Include documentation commits in the same push.
6. Use the resulting Git SHA to inspect the automatic Vercel production deployment. Do not trigger a second CLI deployment for the same change.
7. Report deployment Ready only after it is observed for that SHA. Do not force push or make unrelated repository changes.

Use repository-local identity `celestial-sora` / `suphloeksangko@gmail.com` before committing.

## Verification

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run build
git diff --check
```

Browser verification must include desktop, tablet, 390px mobile and 320px compact widths; all five stories; all seven stops; keyboard navigation; optional sound; reduced motion; and forced WebGL context loss. Check both shader/runtime errors and horizontal overflow. Headless software rendering verifies correctness, not actual-device 60fps performance.

The orbital layout branch `codex/orbit-layout-2026-10-07` was incorporated locally by fast-forward before this reference-design work. Its responsive camera fitting and fallback fixes are preserved. Only the final complete `main` should be pushed.
