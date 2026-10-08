# Active homepage — updated 2026-10-08

The owner replaced the Galaxy homepage with the Kage-derived Sora landing page. This direction supersedes the galaxy homepage instructions below, which are retained as historical reference.

- `/` renders `public/sora-preview/sora.html` through `src/pages/index.astro`.
- Preserve Sora’s adapted portfolio content, Kage-derived scene, chapter layout and bundled Three.js runtime.
- Content comes from the archived Galaxy metadata: Sora’s introduction, Vivian, Oonchai, Larp LLM, Vivian Qwen3 8B v0.4 and eight public social accounts. Vivian links only to its public GitHub repository.
- Keep the original interactive fabric treatment on project cards, including the new image assets. Match fabric frames to the supplied artwork: Vivian 912:1136, Sekaira 1983:793 and Larp LLM 1586:992. Show the whole image without padding or cropping; keep labels outside the fabric. The fabric cards feature Vivian, Oonchai and Larp LLM. Keep Qwen in the five-entry project information grid.
- Use Sora’s profile, the supplied Vivian banner (`public/sora-art/vivian.jpg`), the supplied Sekaira image (`public/sora-art/sekaira.png`) and `public/sora-art/larp-llm.png` in place of the original temple stills. Keep the moon and its light pastel pink.
- Remove the decorative HTML foreground overlays (branches, leaves, lanterns, walls and grass) from all chapters; keep the live Three.js scene visible without these cut-outs.
- Asset URLs at `/` resolve under `/sora-preview/sora-world-assets/`. The original preview URL remains available.
- Show the Alya profile artwork at its original aspect ratio without cropping, including the hero preview and footer avatar.
- Do not restore the Galaxy homepage unless the owner explicitly requests it.
- Validate the production build, asset loading, chapter navigation and desktop/mobile overflow before pushing `main` once.

---

# Sora Astral: miniature universe

## Run

Requires Node.js >=22.12.0. No API keys, database, or external texture service is needed.

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run build
npm run preview -- --host 127.0.0.1
```

In a restricted agent workspace, use a writable npm cache and Astro's foreground mode:

```sh
npm ci --cache /tmp/celestial-sora-npm-cache
ASTRO_TELEMETRY_DISABLED=1 ASTRO_DEV_BACKGROUND=1 npm run dev -- --host 127.0.0.1
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

The dev server uses port 4321. The static production artifact is `dist/`.

## Edit the universe

`src/galaxy/projects.js` is the single source of truth for labels, project cards, dialogs, colors, orbital angles, and planet appearance. The five worlds use the requested visual mapping: Sora (violet ringed planet), Vivian (red), Oonchai (sage green), Larp LLM (warm amber), and Vivian Qwen3 8B v0.4 (ice blue). All destinations use verified public URLs. Vivian links only to its public source repository; never add its private deployment URL. Keep the established fullscreen interface, original headline and pink nebula. The reference supplied on 2026-10-07 informs the newer planet arrangement and smaller radii only; it does not authorize UI redesign. Rings and camera fitting remain proportional to those radii. See `Handoff.md` for the required single-push workflow.

The required content/travel order is **PX-01 Sora → PX-02 Vivian → PX-03 Oonchai → PX-04 Larp LLM → PX-05 Qwen**. Visual mapping: PX-01 Sora is the violet Saturn-like world with rings, PX-02 Vivian is the small red world, PX-03 Oonchai is green, PX-04 Larp LLM stays amber, and PX-05 Qwen stays ice blue. Preserve the existing physical arrangement by assigning those identities to the corresponding visual slots. Replace the large orbital line with dispersed particles; keep Sora’s planetary rings. Use stable project IDs for fallback styles and model-specific behavior; never tie those to array indices.

`src/galaxy/socials.js` stores the eight public social profiles, rendered by `GalaxySocials.astro` in the personal world and About dialog. The model URL is the full BF16 v0.4 repository supplied by the owner; the Larp LLM GitHub repository contains a Gemma 3 12B LoRA Colab playground.

Visible copy contains no emoji, emoticons, or kaomoji. Larp LLM sets `titleFont: "meme"`; its title uses the locally hosted Permanent Marker font supplied by the user across the journey, project details, planet label, rail, and catalog. The font license is bundled in `public/fonts/permanent-marker-LICENSE.txt`.

- `OrbitLayout.js`: shared tilted ellipse for world placement and dispersed dust; responsive dimensions preserve the front/back order. Sora occupies the ringed near-arc slot, with the remaining worlds spaced around the same path.
- `OrbitDust.js`: one particle draw call for dispersed orbital dust (500 desktop / 225 mobile), shader drift, reduced-motion support and resource disposal. CSS fallback uses 64 static dust points with no ellipse outline.
- `GalaxyScene.js`: scene lifecycle, responsive layout, render loop and HTML label projection.
- `Renderer.js`: WebGL renderer, bloom, tone mapping, resolution and adaptive quality.
- `CameraRig.js`: perspective camera, GSAP flights and damped pointer parallax.
- `Interaction.js`: raycasting, wheel drift, touch gestures and cursor feedback.
- `Planet.js`, `Starfield.js`, `shaders.js`: procedural surfaces, atmospheres, rings, gravitational dust and stars.
- `app.js`: accessible native dialogs, project navigation, loading, optional Web Audio and fallback.
- `src/styles/galaxy.css`: the visual system and responsive HTML layer.

## Interaction and accessibility

Click a planet or project index entry to fly in and open its story. Scroll or swipe to travel through seven stops: Origin, the five worlds, and Signal. The side rail and Up/Down, Page Up/Down, Home/End keys provide the same route. The camera fits the full planet and its rings below the measured chapter text, then beside the story dialog on desktop/tablet or above it on mobile. The canvas stays unmasked in both paths. Repeated travel to the same stop and unchanged resize notifications do not restart camera flights. The project index is also available with the I key. Project dialogs support left/right arrow navigation and Escape to return; native dialogs trap focus and restore it on close. The project buttons provide a complete keyboard path without interacting with the canvas.

Sound is silent until explicitly enabled, then plays brief synthesized tones only on interaction. Reduced motion disables continuous planet/star motion, parallax, cursor effects and camera flights. Offscreen and hidden-tab rendering is skipped. WebGL failure/context loss falls back to CSS planets and the same HTML project controls; without JavaScript, project descriptions and real links remain available.

## Performance budget

Desktop: 2,800 background stars, 1,400 nebula particles, 500 orbit particles, 64-segment planet spheres, DPR capped at 1.75, restrained bloom. Mobile: 1,100 background stars, 600 nebula particles, 225 orbit particles, 40-segment spheres, DPR capped at 1.35, no bloom. Each planet adds one atmosphere shell and one procedural glow billboard, which remains visible without bloom. Hover and focus increase the atmosphere and smoothly accelerate orbital dust. Sustained slow frames reduce DPR to 1 and disable bloom. The WebGL module is lazy-loaded separately from the HTML interaction layer. All geometry, materials, postprocessing resources, observers, event listeners and audio nodes are cleaned up on teardown.

Safari/WebKit uses a retained drawing buffer and renders directly to the canvas, without the composer's half-float intermediate targets or bloom. Its DPR is capped at 1.35 on desktop and mobile; the procedural atmospheres and glow remain visible. Custom fragment shaders apply Three.js tone mapping and output color conversion in this path. The canvas has a stable compositing layer and no opacity transition. This also covers other iOS browsers that use WebKit; Chromium on Android keeps the existing postprocessing path.

60fps is a target, not a hardware-independent guarantee. Profile on actual target phones and desktop GPUs before release; headless software rendering is useful for correctness, not representative GPU benchmarks.

## Verification

Run the production build and `git diff --check`. In a browser, verify:

1. Loading resolves, all five planets render, and there are no shader or JavaScript errors.
2. Direct planet click and all five project buttons open the correct title, description and status.
3. All five worlds expose the expected public destination; the model points to v0.4, Larp LLM points to GitHub, and Sora exposes all eight social accounts. Verify no private deployment URL appears in source or build output.
4. Next/previous controls wrap through the five projects; Escape closes and restores focus.
5. Project index, About and sound toggle work by keyboard and pointer.
6. At 390px and 320px widths, labels and controls remain usable without horizontal overflow.
7. Reduced motion yields a static scene and immediate camera changes.
8. Forced WebGL context loss leaves the HTML project interface working.
