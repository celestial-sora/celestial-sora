# Active Three.js portfolio

The active homepage is Sora Astral's miniature universe, built with Astro, Three.js and GSAP. Read `Handoff.md` and `DEVELOPMENT.md` before editing. The legacy hero/banner sections below describe retained older components, not the current homepage; do not apply their file explorer/device mockup layout to this universe.

- Follow the 2026-10-07 reference: deep black, a thin rounded warm frame, large lower-left Instrument Serif copy, italic champagne emphasis, a warm galaxy nucleus and five smaller shaded planets on a tilted orbital plane.
- Keep project metadata in `src/galaxy/projects.js`, orbital positions in `OrbitLayout.js`, and scene bounds based on measured HTML regions. Rings and camera fitting must scale with planet radius.
- Preserve the five worlds, seven travel stops, native dialogs, accessible keyboard controls, public social destinations, reduced motion, WebKit direct rendering and WebGL fallback.
- Names appear on planet hover/focus; codes remain visible. Keep the full project index usable by keyboard and touch.
- Pull/fetch latest code before editing. Local commits may save each complete batch, but finish all code, validation and documentation before pushing `main` **once**. Never push per file or per commit, and never add a separate CLI deployment to the automatic Git deployment.
- Verify the build, whitespace, desktop/tablet/mobile layout, all world stories and navigation, and fallback. Wait for the production deployment of the final commit to be Ready before reporting it live.

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
