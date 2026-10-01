import * as THREE from "three";
import { gsap } from "gsap";
export class CameraRig {
  constructor(width, height, reduced) {
    this.width = width;
    this.height = height;
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.reduced = reduced;
    this.mobile = width < 700;
    this.pose = { x: 0, y: 1, z: 17, tx: 0, ty: 0.5, tz: 0 };
    this.pointer = new THREE.Vector2();
    this.offset = new THREE.Vector2();
    this.target = new THREE.Vector3();
    this.selected = -1;
    this.stop = 0;
    this.orbitPlanet = null;
    this.reset(true);
  }
  resize(w, h) {
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.mobile = w < 700;
  }
  move(values, immediate = false) {
    gsap.killTweensOf(this.pose);
    if (immediate || this.reduced) {
      gsap.set(this.pose, values);
      return;
    }
    gsap.to(this.pose, {
      ...values,
      duration: 2.2,
      ease: "power3.inOut",
    });
  }
  reset(immediate = false, bounds = null) {
    this.selected = -1;
    this.travel(this.stop, this.orbitPlanet, immediate, bounds);
  }
  home() {
    this.stop = 0;
    this.orbitPlanet = null;
    this.reset();
  }
  travel(stop, planet = null, immediate = false, bounds = null) {
    this.stop = stop;
    this.orbitPlanet = planet;
    this.selected = -1;
    if (planet) {
      this.framePlanet(planet, bounds, immediate);
    } else if (stop === 6) {
      this.move(
        {
          x: this.mobile ? 0 : 2.5,
          y: 3,
          z: this.mobile ? 26 : 23,
          tx: this.mobile ? 0 : 2.5,
          ty: 1,
          tz: -2,
        },
        immediate,
      );
    } else {
      const compactOffset = this.mobile && this.height <= 750 ? 1.1 : 0;
      this.move(
        {
          x: 0,
          y: this.mobile ? 2.7 + compactOffset : 1.3,
          z: this.mobile ? 24 : 17,
          tx: 0,
          ty: this.mobile ? 2.3 + compactOffset : 0.6,
          tz: 0,
        },
        immediate,
      );
    }
  }
  framePlanet(planet, bounds, immediate = false) {
    const p = planet.group.position;
    const frame = bounds || {
      left: 0,
      right: this.width,
      top: this.height * 0.45,
      bottom: this.height * 0.88,
    };
    // Fit the complete world, including its rings, in the space beside/below copy.
    const radius = Math.max(
      planet.project.radius * 1.12,
      planet.project.rings ? 2.1 : 0,
    );
    const tangent = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const distance = Math.max(
      this.selected >= 0 ? planet.project.radius * (this.mobile ? 7 : 5.6) : 0,
      (radius * this.height) / (Math.max(1, frame.bottom - frame.top) * tangent),
      (radius * this.width) /
        (Math.max(1, frame.right - frame.left) * tangent * this.camera.aspect),
    ) * 1.13;
    const halfHeight = distance * tangent;
    const x = p.x -
      ((frame.left + frame.right) / this.width - 1) * halfHeight * this.camera.aspect;
    const y = p.y +
      ((frame.top + frame.bottom) / this.height - 1) * halfHeight;
    this.move({ x, y, z: p.z + distance, tx: x, ty: y, tz: p.z }, immediate);
  }
  focus(planet, bounds = null, immediate = false) {
    this.selected = planet.index;
    this.framePlanet(planet, bounds, immediate);
  }
  update(dt) {
    const strength = this.reduced ? 0 : this.selected >= 0 ? 0.06 : 0.22;
    this.offset.x = THREE.MathUtils.damp(
      this.offset.x,
      this.pointer.x * strength,
      3.5,
      dt,
    );
    this.offset.y = THREE.MathUtils.damp(
      this.offset.y,
      this.pointer.y * strength,
      3.5,
      dt,
    );
    this.camera.position.set(
      this.pose.x + this.offset.x,
      this.pose.y + this.offset.y,
      this.pose.z,
    );
    this.target.set(this.pose.tx, this.pose.ty, this.pose.tz);
    this.camera.lookAt(this.target);
    this.camera.updateMatrixWorld();
  }
  dispose() {
    gsap.killTweensOf(this.pose);
  }
}
