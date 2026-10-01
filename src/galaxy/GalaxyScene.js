import * as THREE from "three";
import { Nebula } from "./Nebula.js";
import { Planet } from "./Planet.js";
import { Starfield } from "./Starfield.js";
import { CameraRig } from "./CameraRig.js";
import { GalaxyRenderer } from "./Renderer.js";
import { Interaction } from "./Interaction.js";
import { projects } from "./projects.js";
export class GalaxyScene {
  constructor(stage, onSelect, onProgress, onError, onTravel) {
    this.stage = stage;
    this.width = stage.clientWidth;
    this.height = stage.clientHeight;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.mobile =
      stage.clientWidth < 700 || matchMedia("(pointer: coarse)").matches;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2("#07080c", 0.008);
    this.disposed = false;
    this.visible = true;
    this.elapsed = 0;
    this.last = 0;
    this.dirty = true;
    this.abort = new AbortController();
    this.onError = onError;
    this.frame = 0;
    this.rig = new CameraRig(
      stage.clientWidth,
      stage.clientHeight,
      this.reduced,
    );
    onProgress(15);
    try {
      this.output = new GalaxyRenderer(
        stage.querySelector("canvas"),
        this.scene,
        this.rig.camera,
        stage.clientWidth,
        stage.clientHeight,
        this.mobile,
      );
      onProgress(35);
      this.planets = projects.map((p, i) => {
        const planet = new Planet(p, i, this.mobile);
        this.scene.add(planet.group);
        return planet;
      });
      this.layoutPlanets();
      this.stars = new Starfield(this.mobile, this.output.pixelRatio);
      this.scene.add(this.stars.points);
      this.nebula = new Nebula(this.mobile);
      this.nebula.layout(this.mobile);
      this.scene.add(this.nebula.group);
      this.addOrbits();
      onProgress(65);
      this.labels = [...document.querySelectorAll("[data-planet]")];
      this.labelWidths = this.labels.map((label) => label.offsetWidth);
      this.labelHeights = this.labels.map((label) => label.offsetHeight);
      this.projection = new THREE.Vector3();
      this.interaction = new Interaction(stage, this, onSelect, onTravel);
      this.resizeObserver = new ResizeObserver(() => {
        // Resize clears the drawing buffer. Apply it immediately before drawing,
        // rather than leaving an empty canvas until a later animation frame.
        this.resizePending = true;
        this.invalidate();
      });
      this.resizeObserver.observe(stage);
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          this.visible = entries[0].isIntersecting;
          this.invalidate();
        },
        { threshold: 0 },
      );
      this.intersectionObserver.observe(stage);
      document.addEventListener(
        "visibilitychange",
        () => {
          this.last = 0;
          this.invalidate();
        },
        { signal: this.abort.signal },
      );
      this.motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
      this.motionQuery.addEventListener(
        "change",
        (e) => {
          this.reduced = e.matches;
          this.rig.reduced = e.matches;
          this.invalidate();
        },
        { signal: this.abort.signal },
      );
      stage.querySelector("canvas").addEventListener(
        "webglcontextlost",
        (e) => {
          e.preventDefault();
          this.dispose();
          onError();
        },
        { signal: this.abort.signal },
      );
      this.rig.update(1 / 60);
      this.output.renderer.compile(this.scene, this.rig.camera);
      this.output.render(1 / 60);
      onProgress(100);
      this.loop(0);
    } catch (error) {
      this.dispose();
      throw error;
    }
  }
  layoutPlanets() {
    const mobile = this.stage.clientWidth < 700;
    const locations = [
      [-0.1, 0.6, 1],
      [-2.55, 3, 0],
      [2.6, 3.2, -1],
      [-2.2, -1.9, 1],
      [2.7, -1.4, 0],
    ];
    this.planets.forEach((p, i) => {
      p.group.position.fromArray(mobile ? locations[i] : projects[i].position);
      p.baseY = p.group.position.y;
    });
  }
  addOrbits() {
    this.orbits = new THREE.Group();
    for (let j = 0; j < 3; j++) {
      const points = [];
      for (let i = 0; i <= 180; i++) {
        const a = (i / 180) * Math.PI * 2;
        const r = 3.2 + j * 2.3;
        points.push(
          new THREE.Vector3(
            Math.cos(a) * r,
            Math.sin(a) * r * 0.28 - 0.45,
            Math.sin(a) * r * 0.35 - 1,
          ),
        );
      }
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: "#786081",
          transparent: true,
          opacity: j === 0 ? 0.12 : 0.075,
        }),
      );
      line.rotation.z = -0.14;
      this.orbits.add(line);
    }
    this.orbits.position.x = 3;
    this.orbits.visible = false;
    this.scene.add(this.orbits);
  }
  resize() {
    if (this.disposed) return;
    const w = this.stage.clientWidth,
      h = this.stage.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    if (!w || !h || (
      w === this.width && h === this.height && pixelRatio === this.devicePixelRatio
    )) return;
    this.width = w;
    this.height = h;
    this.devicePixelRatio = pixelRatio;
    this.labelWidths = this.labels.map((label) => label.offsetWidth);
    this.labelHeights = this.labels.map((label) => label.offsetHeight);
    this.output.resize(w, h);
    this.layoutPlanets();
    this.nebula.layout(w < 700);
    this.rig.resize(w, h);
    if (this.rig.selected >= 0)
      this.rig.focus(this.planets[this.rig.selected], this.framingBounds(true), true);
    else
      this.rig.reset(true, this.framingBounds());
    this.invalidate();
  }
  framingBounds(focused = false) {
    const w = this.stage.clientWidth,
      h = this.stage.clientHeight;
    const mobile = w < 700;
    const gap = mobile ? 12 : 24;
    const inset = w * (mobile ? 0.06 : 0.04);
    const header = document.querySelector(".masthead");
    const copy = document.getElementById("journey-copy");
    const dialog = document.getElementById("project-dialog");
    const bounds = {
      left: inset,
      right: w - inset,
      top: header.offsetHeight + gap,
      bottom: h - (mobile ? 112 : 72),
    };
    if (focused && dialog.open) {
      const rect = dialog.getBoundingClientRect();
      if (mobile) bounds.bottom = rect.top - gap;
      else {
        bounds.right = rect.left - gap;
        bounds.bottom = h - gap;
      }
    } else if (this.rig.stop > 0 && this.rig.stop < 6) {
      bounds.top = copy.offsetTop + copy.offsetHeight + gap;
    }
    return bounds;
  }
  hover(index) {
    this.planets?.forEach((p, i) => {
      p.targetHover = i === index ? 1 : 0;
      this.labels?.[i]?.classList.toggle("is-hovered", i === index);
    });
    this.invalidate();
  }
  select(index) {
    this.setFocus(index);
    this.rig.focus(this.planets[index], this.framingBounds(true));
    this.interaction.clear();
    this.invalidate();
  }
  reset() {
    this.setFocus(
      this.rig.stop > 0 && this.rig.stop < 6 ? this.rig.stop - 1 : -1,
    );
    this.rig.reset(false, this.framingBounds());
    this.invalidate();
  }
  travel(stop) {
    this.setFocus(stop > 0 && stop < 6 ? stop - 1 : -1);
    // Set the chapter before measuring its reserved text area.
    this.rig.stop = stop;
    this.rig.travel(
      stop,
      stop > 0 && stop < 6 ? this.planets[stop - 1] : null,
      false,
      this.framingBounds(),
    );
    this.invalidate();
  }
  setFocus(index) {
    this.planets.forEach((planet, i) => {
      planet.targetFocus = Number(i === index);
      planet.targetPresence = index < 0 || i === index ? 1 : 0.06;
    });
  }
  invalidate() {
    this.dirty = true;
  }
  loop(now) {
    if (this.disposed) return;
    this.frame = requestAnimationFrame((t) => this.loop(t));
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 1 / 60;
    this.last = now;
    if (document.hidden || !this.visible) return;
    if (this.resizePending) {
      this.resizePending = false;
      this.resize();
    }
    if (this.reduced && !this.dirty) return;
    this.dirty = false;
    if (!this.reduced) this.elapsed += dt;
    this.rig.update(dt);
    this.planets.forEach((p) => p.update(this.elapsed, dt, this.reduced));
    this.stars.material.uniforms.uPixelRatio.value = this.output.pixelRatio;
    this.stars.update(this.reduced ? 0 : this.elapsed);
    this.nebula.update(this.reduced ? 0 : this.elapsed);
    this.planets.forEach((p, i) => {
      this.projection.copy(p.group.position);
      this.projection.y += p.project.radius * 1.15;
      this.projection.project(this.rig.camera);
      const x = (this.projection.x * 0.5 + 0.5) * this.stage.clientWidth,
        y = (-this.projection.y * 0.5 + 0.5) * this.stage.clientHeight;
      const label = this.labels[i];
      const labelWidth = this.labelWidths[i];
      label.style.left = "0";
      label.style.top = "0";
      label.style.transform = `translate3d(${Math.min(this.stage.clientWidth - labelWidth - 8, Math.max(8, x - labelWidth * 0.5))}px,${Math.max(80, y - this.labelHeights[i] - 8)}px,0)`;
      const visible =
        this.projection.z < 1 &&
        Math.abs(this.projection.x) < 0.97 &&
        Math.abs(this.projection.y) < 0.9 &&
        this.rig.stop === 0;
      label.style.opacity = visible ? "1" : "0";
      label.style.pointerEvents = visible ? "auto" : "none";
      label.tabIndex = visible ? 0 : -1;
      label.setAttribute("aria-hidden", String(!visible));
    });
    this.output.render(dt);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.abort.abort();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.interaction?.dispose();
    this.planets?.forEach((p) => p.dispose());
    this.stars?.dispose();
    this.nebula?.dispose();
    this.orbits?.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
    this.output?.dispose();
    this.rig.dispose();
  }
}
