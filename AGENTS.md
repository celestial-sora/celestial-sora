# Repository

- Repository: `https://github.com/celestial-sora/celestial-sora.git`
- Production: `https://celestial-sora.vercel.app`, branch `main`.
- Use repository-local Git identity `celestial-sora` / `suphloeksangko@gmail.com`.
- The previous full project is retained in `archive/pre-html-cleanup-2026-10-08`. Do not restore archived code unless the owner requests it.

# Current website

- The root `index.html` is the complete active page: HTML, inline CSS and client JavaScript. There is no build step, package installation or framework.
- `assets/fonts.css` and `assets/three.min.js` are the bundled runtime assets. `fonts/`, `icons/`, `sora-art/` and the root icons/manifest contain the current artwork and fonts. Keep their URLs valid from `/`.
- Preserve the Kage-derived scene, chapter navigation, interactive fabric project cards and pastel pink moon. Retain the upstream MIT notice in `LICENSE` and the bundled Three.js license header.
- Do not restore the decorative HTML foreground cut-outs or the floating Alya hero preview.
- Preserve the vertical hero inscription `空の道`, Sweetbliss for Sora, and Permanent Marker for Larp LLM.
- Keep the fabric card proportions: Vivian `912:1136`, Sekaira `1983:793`, and Larp LLM `1586:992`. Show the entire artwork without padding/cropping; labels stay outside the fabric.
- The project information grid contains Sora, Vivian, Oonchai, Larp LLM and Qwen. Preserve the eight public social accounts and the separate footer logo. Vivian links only to its public GitHub repository; its private deployment URL must not appear here.
- Use the moon S emblem for the favicon, loader, header, Apple touch icons and manifest icons. Its original source is `sora-art/moon-s-emblem.png`.
- On `celestial-sora.vercel.app` only, render FPS below 13 continuously for more than 6 foreground seconds starts a visible 5-second countdown to `https://celestial-sora.github.io`. FPS >= 13 cancels and resets both phases. Hidden tabs pause both phases and resume with a fresh timestamp; loading and hidden time never count.
- `vercel.json` serves the repository root directly without install/build commands and redirects the former `/sora-preview/sora.html` URL to `/`. Do not reintroduce a build wrapper.

# Workflow and checks

1. Fetch/pull latest before editing and preserve existing work.
2. Finish all related code, documentation and validation before updating `main` exactly once. Local commits may save complete batches; never push per file or per commit.
3. Check asset references and JavaScript syntax, chapter navigation, fabric artwork, reduced motion, WebGL fallback, responsive overflow, and FPS timing when affected. Run `git diff --check`.
4. Use a plain HTTP server locally, for example `python3 -m http.server 4321 --bind 127.0.0.1` from the repository root. No dependencies or build command are required.
5. Verify the automatic Git deployment is Ready for the final commit before reporting it live. Never trigger a second CLI deployment or force push.
