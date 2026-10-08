# Celestial-Sora

Sora's personal portfolio, built with plain HTML, CSS, JavaScript and a bundled Three.js runtime. The homepage is [`index.html`](index.html) at the repository root.

## Run locally

```sh
python3 -m http.server 4321 --bind 127.0.0.1
```

Open `http://127.0.0.1:4321`. No package installation or build step is needed.

## Deploy

The `main` branch deploys automatically to [celestial-sora.vercel.app](https://celestial-sora.vercel.app). `vercel.json` serves the root as a static site. The former preview URL redirects to the homepage.

The complete previous project is preserved in [archive/pre-html-cleanup-2026-10-08](https://github.com/celestial-sora/celestial-sora/tree/archive/pre-html-cleanup-2026-10-08).

## Credits

The scene and chapter layout adapt [Meng To's ThreeUI Kage page](https://github.com/MengTo/threeui) under the MIT license in `LICENSE`. The bundled Three.js file retains its upstream license notice. Font notices are kept beside their corresponding files; the embedded font stylesheet is preserved unchanged.
