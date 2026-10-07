import { gsap } from "gsap";
import { projects } from "./projects.js";
const $ = (id) => document.getElementById(id);
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
let galaxy = null,
  stop = 0,
  selected = -1,
  returnFocus = null,
  sound = null,
  soundEnabled = false;
const abort = new AbortController();
const listen = (el, event, fn) =>
  el.addEventListener(event, fn, { signal: abort.signal });
const dialog = $("project-dialog");
function tone(index = 0) {
  if (!soundEnabled || !sound) return;
  const now = sound.currentTime;
  const oscillator = sound.createOscillator(),
    gain = sound.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(
    [220, 261.63, 329.63, 392, 440][index % 5],
    now,
  );
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.025, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
  oscillator.connect(gain);
  gain.connect(sound.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.7);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
}
function selectProject(index) {
  selected = index;
  const p = projects[index];
  if (!dialog.open)
    returnFocus = $("catalog").open
      ? $("index-toggle")
      : document.activeElement;
  $("catalog").close();
  $("about-dialog").close();
  $("index-toggle").setAttribute("aria-expanded", "false");
  $("detail-number").textContent = `WORLD 0${index + 1} / THE CONSTELLATION`;
  $("detail-category").textContent = p.category;
  $("detail-title").textContent = p.name;
  $("detail-title").classList.toggle("meme-title", p.titleFont === "meme");
  $("detail-title").classList.toggle("sora-title", p.titleFont === "sweetbliss");
  $("detail-tagline").textContent = p.tagline;
  $("detail-description").textContent = p.description;
  $("detail-field").textContent = p.field;
  $("detail-status").textContent = p.status;
  $("detail-count").textContent = `0${index + 1} / 05`;
  $("detail-tags").replaceChildren(
    ...p.tags.map((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      return span;
    }),
  );
  $("detail-link").hidden = !p.href;
  if (p.href) $("detail-link").href = p.href;
  else $("detail-link").removeAttribute("href");
  $("detail-link-label").textContent = p.linkLabel || "Explore the project";
  $("detail-socials").hidden = !p.social;
  dialog.classList.toggle("personal-world", !!p.social);
  $("detail-links").replaceChildren(
    ...(p.links || []).map((link) => {
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = link.label;
      return anchor;
    }),
  );
  dialog.style.setProperty("--detail-color", p.color);
  document.body.classList.add("focused");
  document.querySelectorAll("[data-project]").forEach((el, i) => {
    el.classList.toggle("selected", index === i);
    el.setAttribute("aria-pressed", String(index === i));
  });
  if (!dialog.open) dialog.showModal();
  galaxy?.select(index);
  dialog.scrollTop = 0;
  gsap.fromTo(
    dialog,
    { opacity: 0, y: reduced() ? 0 : 16 },
    {
      opacity: 1,
      y: 0,
      duration: reduced() ? 0 : 0.65,
      delay: reduced() ? 0 : 0.35,
      ease: "power2.out",
      overwrite: true,
    },
  );
  $("announcement").textContent = `Exploring ${p.name}. ${p.status}.`;
  tone(index);
}
function closeProject() {
  if (dialog.open) dialog.close();
}
listen(dialog, "close", () => {
  gsap.killTweensOf(dialog);
  document.body.classList.remove("focused");
  document.querySelectorAll("[data-project]").forEach((el) => {
    el.classList.remove("selected");
    el.setAttribute("aria-pressed", "false");
  });
  galaxy?.reset();
  selected = -1;
  returnFocus?.focus({ preventScroll: true });
});
listen($("close-project"), "click", closeProject);
listen($("previous-project"), "click", () => selectProject((selected + 4) % 5));
listen($("next-project"), "click", () => selectProject((selected + 1) % 5));
document
  .querySelectorAll("[data-project],[data-planet],[data-catalog-project]")
  .forEach((button) => {
    const index = Number(
      button.dataset.project ??
        button.dataset.planet ??
        button.dataset.catalogProject,
    );
    listen(button, "click", () => selectProject(index));
    listen(button, "pointerenter", () => galaxy?.hover(index));
    listen(button, "pointerleave", () => galaxy?.hover(-1));
    listen(button, "focus", () => galaxy?.hover(index));
    listen(button, "blur", () => galaxy?.hover(-1));
  });
listen($("universe-nav"), "click", () => {
  closeProject();
  $("about-dialog").close();
  $("catalog").close();
  travel(0);
});
listen($("about-nav"), "click", () => $("about-dialog").showModal());
listen($("connect-nav"), "click", (event) => {
  event.preventDefault();
  travel(6);
});
function travel(next) {
  const destination = Math.max(0, Math.min(6, next));
  if (destination === stop) return;
  stop = destination;
  document.body.classList.toggle("journey-copy", stop > 0);
  document.body.classList.toggle("signal-world", stop === 6);
  document.querySelectorAll("[data-stop]").forEach((el) => {
    const active = Number(el.dataset.stop) === stop;
    el.classList.toggle("active", active);
    if (active) el.setAttribute("aria-current", "step");
    else el.removeAttribute("aria-current");
  });
  const title = $("journey-title"),
    description = $("journey-description"),
    eyebrow = $("journey-eyebrow");
  title.classList.toggle("meme-title", projects[stop - 1]?.titleFont === "meme");
  title.classList.toggle("sora-title", projects[stop - 1]?.titleFont === "sweetbliss");
  if (stop === 0) {
    title.innerHTML = "Sora Astral builds<br /><em>small universes</em><br />for the web.";
    description.textContent =
      "I build AI companions, story worlds, and experiments for the web. Every world in this system is a project — travel between them, or land on one to read its story.";
    eyebrow.textContent = "00 — ORIGIN · A PERSONAL UNIVERSE";
  } else if (stop === 6) {
    title.innerHTML = "The next world<br /><em>starts with hello.</em>";
    description.textContent =
      "A good conversation can be the beginning of something wonderful. Come find me, share an idea, or see what I’m making next.";
    eyebrow.textContent = "06 — SIGNAL · LET’S CONNECT";
  } else {
    const p = projects[stop - 1];
    title.textContent = p.title || p.name;
    description.textContent = p.tagline;
    eyebrow.textContent = `0${stop} — ${p.category} · ${p.status.toUpperCase()}`;
  }
  $("journey-cta").hidden = stop === 0;
  $("journey-cta").firstChild.textContent =
    stop === 6 ? "Find me around the web " : "Discover this world ";
  document.body.classList.toggle("model-world", stop === 3);
  $("journey-contact").hidden = stop !== 6;
  $("coordinate-ra").textContent =
    `${String(stop * 3).padStart(2, "0")}h ${String(stop * 7).padStart(2, "0")}m`;
  $("coordinate-dec").textContent =
    `+${String(stop * 9).padStart(2, "0")}° ${String(stop * 4).padStart(2, "0")}′`;
  gsap.fromTo(
    $("journey-copy"),
    { opacity: 0, y: reduced() ? 0 : 14 },
    {
      opacity: 1,
      y: 0,
      duration: reduced() ? 0 : 0.8,
      delay: reduced() ? 0 : 0.25,
      ease: "power2.out",
      overwrite: true,
    },
  );
  galaxy?.travel(stop);
  $("announcement").textContent =
    stop === 0
      ? "Origin: the full constellation"
      : stop === 6
        ? "Signal: connect with Sora"
        : `Orbiting ${projects[stop - 1].name}. Choose Discover this world to read its story.`;
  if (stop > 0 && stop < 6) tone(stop - 1);
}
document
  .querySelectorAll("[data-stop]")
  .forEach((button) =>
    listen(button, "click", () => travel(Number(button.dataset.stop))),
  );
listen($("journey-cta"), "click", () => {
  if (stop > 0 && stop < 6) selectProject(stop - 1);
  else if (stop === 6) $("about-dialog").showModal();
});
function openIndex() {
  if ($("catalog").open) {
    $("catalog").close();
    return;
  }
  closeProject();
  $("about-dialog").close();
  $("index-toggle").setAttribute("aria-expanded", "true");
  $("catalog").showModal();
}
listen($("index-toggle"), "click", openIndex);
listen($("catalog"), "close", () =>
  $("index-toggle").setAttribute("aria-expanded", "false"),
);
document
  .querySelectorAll("[data-close]")
  .forEach((button) =>
    listen(button, "click", () => $(button.dataset.close).close()),
  );
document.querySelectorAll("dialog").forEach((el) =>
  listen(el, "click", (e) => {
    if (e.target !== el) return;
    const r = el.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      el.close();
  }),
);
listen(document, "keydown", (e) => {
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.altKey ||
    e.target.closest("input,textarea,select")
  )
    return;
  if (e.key.toLowerCase() === "i" && !document.querySelector("dialog[open]")) {
    e.preventDefault();
    openIndex();
  }
  if (
    !document.querySelector("dialog[open]") &&
    ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(
      e.key,
    )
  ) {
    e.preventDefault();
    travel(
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? 6
          : stop + (["ArrowDown", "PageDown"].includes(e.key) ? 1 : -1),
    );
  }
  if (dialog.open && ["ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    selectProject((selected + (e.key === "ArrowRight" ? 1 : 4)) % 5);
  }
});
listen($("sound-toggle"), "click", async () => {
  try {
    if (!sound)
      sound = new (window.AudioContext || window.webkitAudioContext)();
    await sound.resume();
    soundEnabled = !soundEnabled;
    $("sound-toggle").setAttribute("aria-pressed", String(soundEnabled));
    $("sound-toggle").setAttribute(
      "aria-label",
      soundEnabled ? "Disable interaction sound" : "Enable interaction sound",
    );
    $("sound-label").textContent = soundEnabled ? "SOUND ON" : "SOUND OFF";
    tone();
  } catch {
    $("sound-label").textContent = "SOUND UNAVAILABLE";
    $("sound-toggle").disabled = true;
  }
});
function fitFallback() {
  const copy = $("journey-copy");
  $("galaxy-stage").style.setProperty(
    "--fallback-top",
    `${copy.offsetTop + copy.offsetHeight + 40}px`,
  );
}
listen(window, "resize", () => {
  if (!galaxy) fitFallback();
});
function fallback() {
  fitFallback();
  document.querySelectorAll("[data-planet]").forEach((el) => {
    el.style.left = "";
    el.style.top = "";
    el.style.transform = "";
    el.style.opacity = "";
    el.style.pointerEvents = "";
    el.removeAttribute("aria-hidden");
    el.tabIndex = 0;
  });
  document.body.classList.remove("webgl-ready");
  $("fallback-notice").hidden = false;
  $("explore-hint").hidden = true;
  $("loading").hidden = true;
  galaxy = null;
}
async function init() {
  fitFallback();
  document.fonts.ready.then(() => { if (!galaxy) fitFallback(); });
  $("loading").hidden = false;
  const progress = (value) => {
    $("loading-progress").setAttribute("aria-valuenow", String(value));
    $("loading-bar").style.width = `${value}%`;
    $("loading-number").textContent = `${String(value).padStart(2, "0")} / 100`;
  };
  progress(5);
  // Never trap the portfolio behind a failed or stalled graphics module.
  const timeout = setTimeout(() => {
    $("loading").hidden = true;
  }, 8000);
  try {
    const { GalaxyScene } = await import("./GalaxyScene.js");
    galaxy = new GalaxyScene(
      $("galaxy-stage"),
      selectProject,
      progress,
      fallback,
      (direction) => travel(stop + direction),
    );
    // Let the browser present the first rendered WebGL frame under the
    // fallback layer before starting the canvas crossfade.
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    if (!galaxy) return;
    document.body.classList.add("webgl-ready");
    // The rendered view replaces full fallback names with compact code labels.
    galaxy.resize(true);
    if (stop > 0) galaxy.travel(stop);
    if (selected >= 0) galaxy.select(selected);
    gsap.to($("loading"), {
      opacity: 0,
      duration: reduced() ? 0 : 0.65,
      delay: reduced() ? 0 : 0.25,
      onComplete: () => {
        $("loading").hidden = true;
      },
    });
  } catch (error) {
    console.warn(
      "The 3D view is unavailable; using the accessible project view.",
      error,
    );
    fallback();
  } finally {
    clearTimeout(timeout);
  }
}
init();
function dispose() {
  abort.abort();
  galaxy?.dispose();
  gsap.killTweensOf(dialog);
  gsap.killTweensOf($("loading"));
  gsap.killTweensOf($("journey-copy"));
  sound?.close();
}
listen(window, "pagehide", (e) => {
  if (!e.persisted) dispose();
});
if (import.meta.hot) import.meta.hot.dispose(dispose);
