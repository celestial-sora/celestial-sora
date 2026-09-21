# Celestial Sora — Handoff

## Project

- Repository: `https://github.com/celestial-sora/celestial-sora`
- Stack: Astro static site with Astro components and global CSS
- Hosting: Vercel, connected to the `main` branch
- Current production domain: `https://celestial-sora.vercel.app`
- Working directory: `/workspace/scratch/3653820ba324/celestial-sora`

## Current state

The portfolio has been redesigned into an English, Claude-inspired interface with a warm ivory/charcoal palette, frosted glass surfaces, and raspberry-pink highlights.

The latest social section includes six cards:

- Instagram
- TikTok
- YouTube
- Discord
- Telegram — `https://t.me/sorastra`
- Roblox — the Profile Share URL supplied by Sora

Social cards use inline SVG icons. Do not replace them with emoji or unnecessary image assets.

Latest GitHub commit:

- `f1c5dfd` — `feat: add Telegram and Roblox social links`

## Design direction

- English UI throughout.
- Claude-like palette:
  - Light background: `#FAF9F5`
  - Light surface: `#F0EEE6`
  - Dark background: warm charcoal
  - Primary text: near-black in light mode, ivory in dark mode
  - Clay accent: `#D97757`
  - Raspberry highlight: `#D14F73`
  - Sky accent: `#6A9BCC`
  - Olive accent: `#788C5D`
- Use refined glassmorphism with restrained blur and soft borders.
- No loading animations.
- No hero entrance animations.
- No emoji. Use inline SVG icons instead.
- Keep motion subtle and spring-like for buttons, theme toggle, and navigation interactions.
- Prefer accessibility-friendly semantic links, buttons, labels, and visible focus states.

## Navigation

The navbar intentionally uses a file-explorer style rather than a conventional navigation menu:

`/home / sora / work / social`

These path segments are clickable section navigation links. Do not add a second conventional nav row unless Sora explicitly requests it. The navbar is frosted glass and should remain compact.

## Main files

- `src/pages/index.astro` — page composition
- `src/layouts/Layout.astro` — document shell, metadata, global imports
- `src/components/Navbar.astro` — file-explorer navbar and section navigation
- `src/components/MobileMenu.astro` — mobile navigation drawer
- `src/components/ThemeToggle.astro` — light/dark mode toggle
- `src/components/AboutSection.astro` — profile/about section and GitHub link
- `src/components/ProjectsSection.astro` — project cards
- `src/components/SocialSection.astro` — donations and six social cards
- `src/components/Footer.astro` — footer
- `src/components/ScrollToTop.astro` — scroll-to-top control
- `src/styles/global.css` — palette, layout, cards, responsive rules, motion
- `public/sora-profile.jpg` — profile image

## Development

```bash
npm install
npm run dev
npm run build
```

Run before handoff or push:

```bash
npm run build
git diff --check
```

## Git and deployment workflow

Push changes to GitHub `main`. Vercel is connected to the repository and deploys automatically. Avoid repeated manual Vercel deployments because the account can hit deployment limits.

Before changing files:

1. Check the current `main` commit on GitHub.
2. Preserve unrelated user changes.
3. Make the smallest scoped change possible.
4. Run the build and whitespace check.
5. Push to GitHub and report the commit URL.

## Important notes for the next agent

- The user prefers concise Thai communication and should be addressed as “คุณหนู”.
- The user wants implementation without unnecessary clarification unless there is a critical security issue.
- Do not reintroduce deleted 3D assets, loading video, hero animation, or unused background assets.
- Do not change the navbar concept or add emoji.
- If adding social channels, use inline SVG icons and preserve the two-column desktop / one-column mobile grid.
- The local workspace may contain a stale untracked `src/components/CubeHero.astro` left over from an older version. The current `main` branch does not use it; do not re-add it.
