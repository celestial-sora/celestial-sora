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
