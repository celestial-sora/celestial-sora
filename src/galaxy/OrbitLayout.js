// The worlds and their dispersed dust share one tilted orbital plane.
const layouts = {
  desktop: { center: [3.1, 0.8, -1], width: 4.5, depth: 3.8, tilt: 0.75, roll: 0.3 },
  mobile: { center: [0, -0.6, -1], width: 2.65, depth: 3.2, tilt: 0.62, roll: -0.12 },
};

export function orbitPosition(angle, mobile = false, scale = 1) {
  const layout = layouts[mobile ? "mobile" : "desktop"];
  const x = Math.cos(angle) * layout.width * scale;
  const depth = Math.sin(angle) * layout.depth * scale;
  const y = -depth * Math.sin(layout.tilt);
  const cos = Math.cos(layout.roll), sin = Math.sin(layout.roll);
  return [
    layout.center[0] + x * cos - y * sin,
    layout.center[1] + x * sin + y * cos,
    layout.center[2] + depth * Math.cos(layout.tilt),
  ];
}
