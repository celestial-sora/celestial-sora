# Celestial Sora — Handoff

## Project

- Repository: https://github.com/celestial-sora/celestial-sora
- Stack: Astro static site with Astro components and global CSS
- Hosting: Vercel, connected to the main branch
- Production: https://celestial-sora.vercel.app
- Scope: portfolio website for Sora

## Current state

The portfolio uses an English file-explorer-inspired interface with warm ivory/charcoal surfaces, pink accents, restrained glass effects, local SVG icons, and subtle spring motion.

Completed UI work:

- File-explorer navbar: /home / sora / work / social
- Light/dark theme toggle with local sun and moon SVG icons
- Animated hamburger menu that morphs into a close icon
- Social cards using local brand SVG assets
- Telegram and Roblox social links
- Vivian project card with the uploaded banner image
- Vivian project metadata updated for Live2D, memory, voice, and vision

Latest Git version:

- 6e59bb0 — fix: use one banner ratio across devices
- Previous banner asset refresh: b285ff9

## Project banner standard

All project banners must use the same canvas specification on desktop and mobile:

- Canvas: 551 × 260 px
- Aspect ratio: 551:260, approximately 2.12:1
- Use the same composition; do not create a separate mobile crop
- Keep important text, logos, and faces inside a 22px safe area
- Larger source files are allowed only when they preserve the same ratio

The CSS keeps the ratio with:

`aspect-ratio: 551 / 260`

Current Vivian asset:

- `public/vivian-banner-v2.jpg`
- Displayed through `ProjectsSection.astro`
- Full artwork is preserved with responsive scaling

The detailed banner rule is also documented in `agents.md`.

## Design direction

- English UI throughout.
- Warm ivory light mode and charcoal dark mode.
- Raspberry pink highlight, clay accent, sky blue accent, and olive accent.
- Refined glass surfaces with restrained blur and soft borders.
- No emoji for interface icons; use local or inline SVG.
- Keep motion subtle and spring-like.
- Preserve semantic links, buttons, labels, and visible focus states.
- Avoid unrelated redesigns when making scoped fixes.

## Navigation

The navbar intentionally uses a file-explorer style. The path segments are clickable section navigation links. Do not add a second conventional navigation row unless explicitly requested.

## Main files

- `src/pages/index.astro` — page composition
- `src/layouts/Layout.astro` — document shell and metadata
- `src/components/Navbar.astro` — file-explorer navbar
- `src/components/MobileMenu.astro` — mobile navigation drawer
- `src/components/ThemeToggle.astro` — theme toggle
- `src/components/ProjectsSection.astro` — project cards and Vivian banner
- `src/components/SocialSection.astro` — social cards
- `src/styles/global.css` — layout, responsive rules, banner ratio, and motion
- `public/icons/` — local SVG icons
- `public/vivian-banner-v2.jpg` — current Vivian banner
- `agents.md` — persistent project rules and banner standard

## Development and verification

```bash
npm install
npm run dev
npm run build
git diff --check
```

Run the build and whitespace check before delivery. Verify the directly affected feature when possible.

## Git and deployment workflow

- Work on the existing branch unless a new branch is explicitly requested.
- Make the smallest scoped change possible.
- Do not commit secrets, credentials, environment files, debug files, or unrelated changes.
- Push the completed work to GitHub.
- Vercel deploys automatically from `main`.
- If deployment is required, wait until Vercel reports `Ready` before declaring the task complete.
- Report the Git version and deployment status in plain language.

## Important notes

- Address the user as “คุณหนู” and keep communication concise.
- Do not reintroduce deleted 3D assets, loading video, hero animation, or unused background assets.
- Do not change the navbar concept or add emoji.
- Preserve the two-column desktop and one-column mobile project/social layout unless explicitly requested.
- The old `src/components/CubeHero.astro` may exist only in stale local workspaces; it is not part of the current main flow and should not be re-added.
