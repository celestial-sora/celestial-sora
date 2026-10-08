# Active homepage — updated 2026-10-08

The owner replaced the Galaxy homepage with the Kage-derived Sora landing page. This direction supersedes the galaxy homepage instructions below, which are retained as historical reference.

- `/` renders `public/sora-preview/sora.html` through `src/pages/index.astro`.
- Preserve Sora’s adapted portfolio content, Kage-derived scene, chapter layout and bundled Three.js runtime.
- Content comes from the archived Galaxy metadata: Sora’s introduction, Vivian, Oonchai, Larp LLM, Vivian Qwen3 8B v0.4 and eight public social accounts. Vivian links only to its public GitHub repository.
- Keep the original interactive fabric treatment on project cards, including the new image assets. Match fabric frames to the supplied artwork: Vivian 912:1136, Sekaira 1983:793 and Larp LLM 1586:992. Show the whole image without padding or cropping; keep labels outside the fabric. The fabric cards feature Vivian, Oonchai and Larp LLM. Keep Qwen in the five-entry project information grid.
- Use Sora’s profile, the supplied Vivian banner (`public/sora-art/vivian.jpg`), the supplied Sekaira image (`public/sora-art/sekaira.png`) and `public/sora-art/larp-llm.png` in place of the original temple stills. Keep the moon and its light pastel pink.
- Remove the decorative HTML foreground overlays (branches, leaves, lanterns, walls and grass) from all chapters; keep the live Three.js scene visible without these cut-outs.
- Asset URLs at `/` resolve under `/sora-preview/sora-world-assets/`. The original preview URL remains available.
- The floating Alya hero preview and caption are removed. Use the supplied Celestial-Sora logo (`public/sora-art/celestial-sora-logo.png`) in the footer, uncropped.
- Use the local Sweetbliss font for the Sora name in the project information grid.
- Preserve the vertical Japanese Sora inscription `空の道` beside the hero; do not replace it with English branding.
- Do not restore the Galaxy homepage unless the owner explicitly requests it.
- Validate the production build, asset loading, chapter navigation and desktop/mobile overflow before pushing `main` once.

---

# Active Three.js portfolio

The active homepage is Sora Astral's miniature universe, built with Astro, Three.js and GSAP. Read `Handoff.md` and `DEVELOPMENT.md` before editing. The legacy hero/banner sections below describe retained older components, not the current homepage; do not apply their file explorer/device mockup layout to this universe.

- The 2026-10-07 reference is for planet arrangement only. Keep the original fullscreen UI, “A little curiosity. / Entire worlds.” headline, pink nebula and the requested PX color mapping below. Do not add a frame or redesign the UI. Preserve the newer orbital angles, smaller planet radii and ring orientation.
- Keep project metadata in `src/galaxy/projects.js`, orbital positions in `OrbitLayout.js`, and scene bounds based on measured HTML regions. Rings and camera fitting must scale with planet radius.
- Preserve the five worlds, seven travel stops, native dialogs, accessible keyboard controls, public social destinations, reduced motion, WebKit direct rendering and WebGL fallback.
- Project names and category labels remain visible. Keep the full project index usable by keyboard and touch.
- Pull/fetch latest code before editing. Local commits may save each complete batch, but finish all code, validation and documentation before pushing `main` **once**. Never push per file or per commit, and never add a separate CLI deployment to the automatic Git deployment.
- Verify the build, whitespace, desktop/tablet/mobile layout, all world stories and navigation, and fallback. Wait for the production deployment of the final commit to be Ready before reporting it live.

The required content/travel order is **PX-01 Sora → PX-02 Vivian → PX-03 Oonchai → PX-04 Larp LLM → PX-05 Qwen**. Visual mapping: PX-01 Sora is the violet Saturn-like world with rings, PX-02 Vivian is the small red world, PX-03 Oonchai is green, PX-04 Larp LLM stays amber, and PX-05 Qwen stays ice blue. Preserve the existing physical arrangement by assigning those identities to the corresponding visual slots. Replace the large orbital line with dispersed particles; keep Sora’s planetary rings. Use stable project IDs for fallback styles and model-specific behavior; never tie those to array indices.

# Project Banner Standard

## Canonical banner size

All project banners, including Vivian and future projects, must use one shared canvas size:

- **Canvas:** `551 × 260 px`
- **Aspect ratio:** `551:260` (approximately `2.12:1`)
- **Desktop and mobile:** use the same aspect ratio and visual composition; do not create separate banner designs for different breakpoints.
- **Safe area:** keep important text, logos, and faces away from the outer 22px on every side so the banner remains readable when displayed responsively.

## Implementation rule

Keep the banner ratio in CSS with `aspect-ratio: 551 / 260`. The image may scale down with the card width, but its composition and ratio must remain unchanged on mobile and desktop.

When replacing a banner, export the artwork at exactly `551 × 260 px` or at a larger resolution with the same `551:260` ratio. Do not use a different mobile crop.

## Vivian Hero

- The homepage hero showcases Vivian as the primary subject.
- Use the established Vivian design: long pastel-pink hair, violet-blue eyes, and a navy-and-white maid outfit with a headpiece.
- Use the current full-body portrait asset in `public/vivian-character.webp`; preserve its proportions with `object-fit: contain` and do not crop or stretch the character.
- Keep the surrounding layout minimal so the character remains the focus.
- Present the homepage hero as a centered headline and actions above a responsive wide-screen Vivian preview with an overlapping Galaxy S24 Ultra phone preview. Model the S24 Ultra with a thin flat frame and centered hole-punch camera; keep both screens readable and fully contained on mobile.
- Keep the previews as illustrative Vivian UI mockups. Use clean device frames and app navigation; omit OS status bars and the device caption below the mockups.
- Keep the iPad frame in a landscape 4:3 aspect ratio at every breakpoint. Use spare, legible app UI in both light and dark themes, with the phone overlapping only a small part of the tablet.
- Vivian's live URL is private. Never link to or display it on the public portfolio; keep the hero CTA as non-interactive `Coming soon` until the user explicitly releases it.

## About Sora voice

- Introduce Sora in the first person with cute, casual, slightly shy wording. Convey the playful femboy vibe through wording without explicitly labeling Sora as a femboy in visible copy; keep it readable on mobile.
- Do not use emoji, emoticons, or kaomoji in visible copy. Use SVG icons for interface symbols.

## Larp LLM typography

- Render the Larp LLM project name in the locally hosted Permanent Marker font supplied by the user, with uppercase styling, for its planet label, journey heading, information heading, rail label, and project index entry.

## Social links

- The Social section uses eight simple link cards: Instagram, TikTok, YouTube, Discord, Telegram, Roblox, Spotify, and X. Keep their shared card layout on desktop and mobile.
- Spotify links to the public profile at `https://open.spotify.com/user/313t4w53kejr4fj7f3i5kysvwx7u`; X links to `https://x.com/Sorachan67`. These are outbound links, with no player or account integration.

## Selected work

- The first Work card presents **Oonchai** (development codename **Sekaira**) as an AI roleplay platform, linking to `https://oonchai.vercel.app/`. Its banner is `public/oonchai-banner.svg`, drawn at `551 × 260` and used at the shared `551:260` ratio on desktop and mobile.
- The second Work card presents Vivian, linking to the public GitHub project. Vivian's private live URL must stay off the portfolio.
