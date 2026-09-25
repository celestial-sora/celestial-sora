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

- Introduce Sora in the first person with cute, casual, slightly shy wording. Convey the playful femboy vibe through tone and kaomoji without explicitly labeling Sora as a femboy in visible copy; keep it readable on mobile.
- Use a small mix of expressive kaomoji and classic text faces such as `(˶>⩊<˶)`, `>///<`, `>~<`, `^^`, and `:3` to suit each line's mood. Keep long faces together when wrapping and escape angle brackets in HTML.

## Social links

- The Social section uses eight simple link cards: Instagram, TikTok, YouTube, Discord, Telegram, Roblox, Spotify, and X. Keep their shared card layout on desktop and mobile.
- Spotify links to the public profile at `https://open.spotify.com/user/313t4w53kejr4fj7f3i5kysvwx7u`; X links to `https://x.com/Sorachan67`. These are outbound links, with no player or account integration.

## Selected work

- The first Work card presents **Oonchai** (development codename **Sekaira**) as an AI roleplay platform, linking to `https://oonchai.vercel.app/`. Its banner is `public/oonchai-banner.svg`, drawn at `551 × 260` and used at the shared `551:260` ratio on desktop and mobile.
- The second Work card presents Vivian, linking to the public GitHub project. Vivian's private live URL must stay off the portfolio.
