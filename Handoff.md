# Active homepage — updated 2026-10-08

The owner replaced the Galaxy homepage with the Kage-derived Sora landing page. This direction supersedes the galaxy homepage instructions below, which are retained as historical reference.

- `/` renders `public/sora-preview/sora.html` through `src/pages/index.astro`.
- Preserve Sora’s adapted portfolio content, Kage-derived scene, chapter layout and bundled Three.js runtime.
- Content comes from the archived Galaxy metadata: Sora’s introduction, Vivian, Oonchai, Larp LLM, Vivian Qwen3 8B v0.4 and eight public social accounts. Vivian links only to its public GitHub repository.
- Keep the original interactive fabric treatment on project cards, including the new image assets. The fabric cards feature Vivian, Oonchai and Larp LLM. Keep Qwen in the five-entry project information grid.
- Use Sora’s profile, the supplied Vivian banner (`public/sora-art/vivian.jpg`), the supplied Sekaira image (`public/sora-art/sekaira.png`) and `public/sora-art/larp-llm.png` in place of the original temple stills. Keep the moon and its light pastel pink.
- Remove the decorative HTML foreground overlays (branches, leaves, lanterns, walls and grass) from all chapters; keep the live Three.js scene visible without these cut-outs.
- Asset URLs at `/` resolve under `/sora-preview/sora-world-assets/`. The original preview URL remains available.
- Show the Alya profile artwork at its original aspect ratio without cropping, including the hero preview and footer avatar.
- Do not restore the Galaxy homepage unless the owner explicitly requests it.
- Validate the production build, asset loading, chapter navigation and desktop/mobile overflow before pushing `main` once.

---

# Sora Astral — Three.js portfolio handoff

## Active project

- Repository: https://github.com/celestial-sora/celestial-sora
- Production branch: `main`
- Production URL: https://celestial-sora.vercel.app
- Stack: Astro static HTML, Three.js procedural WebGL, GSAP camera transitions, global CSS.
- This is the miniature universe portfolio. The older file explorer portfolio lives in `celestial-sora.github.io`; do not use that implementation for this project.
- This document supersedes the former file explorer handoff. `DEVELOPMENT.md` describes the current scene lifecycle, interaction and performance budgets.

## Current visual direction

The owner clarified on 2026-10-07 that the reference image is an example of **planet arrangement only**. Preserve the established fullscreen UI and background colors; use the latest PX world mapping below. Do not add an outer frame, rewrite the homepage copy, or redesign navigation based on that image.

- Fullscreen space with the existing Sora Astral wordmark, opt-in sound and original navigation.
- Original Instrument Serif headline: “A little curiosity. / Entire worlds.” Preserve its typography, position and introduction copy.
- Keep the pink nebula, established star brightness and surface lighting. Current world palettes: Sora violet with rings, Vivian red, Oonchai sage green, Larp LLM warm amber, and Qwen ice blue.
- Keep the newer tilted orbital arrangement, current smaller planet radii, ring orientation and proportional rings/camera fitting. Keep the visual slots' orbital angles and Larp LLM's inner-orbit scale; the latest owner request assigns the violet ringed slot to Sora, red slot to Vivian and green slot to Oonchai.
- Restore visible project names and category labels, including their existing title fonts. Keep their hit areas separate and the project index available.
- Preserve the numbered rail, coordinates and travel hint. Mobile retains the existing responsive UI, with the scene fitted below the introduction.

The required content/travel order is **PX-01 Sora → PX-02 Vivian → PX-03 Oonchai → PX-04 Larp LLM → PX-05 Qwen**. Visual mapping: PX-01 Sora is the violet Saturn-like world with rings, PX-02 Vivian is the small red world, PX-03 Oonchai is green, PX-04 Larp LLM stays amber, and PX-05 Qwen stays ice blue. Preserve the existing physical arrangement by assigning those identities to the corresponding visual slots. Replace the large orbital line with dispersed particles; keep Sora’s planetary rings. Use stable project IDs for fallback styles and model-specific behavior; never tie those to array indices.

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
- `src/galaxy/OrbitDust.js`: soft dispersed orbital particles (500 desktop / 225 mobile), responsive layout and shader drift; replaces the large orbital line. CSS fallback uses scattered dots with no orbital outline.
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

The orbital layout branch `codex/orbit-layout-2026-10-07` was incorporated locally by fast-forward before this layout work. Its responsive camera fitting and fallback fixes are preserved. Only the final complete `main` should be pushed.
