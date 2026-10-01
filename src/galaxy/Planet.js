import * as THREE from "three";
import {
  planetVertex,
  planetFragment,
  atmosphereFragment,
  auraVertex,
  auraFragment,
  ringVertex,
  ringFragment,
} from "./shaders.js";

export class Planet {
  constructor(project, index, mobile) {
    this.project = project;
    this.index = index;
    this.group = new THREE.Group();
    this.group.position.fromArray(project.position);
    this.baseY = this.group.position.y;
    this.targetHover = 0;
    this.targetFocus = 0;
    this.targetPresence = 1;
    this.presence = { value: 1 };
    this.interest = 0;
    // Share these uniforms so atmosphere, surface, and rings respond together.
    this.time = { value: 0 };
    this.energy = { value: 0 };
    const color = new THREE.Color(project.color);
    const uniforms = {
      uTime: this.time,
      uHover: this.energy,
      uPresence: this.presence,
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: planetVertex,
      fragmentShader: planetFragment,
      uniforms: {
        ...uniforms,
        uDark: { value: new THREE.Color(project.colors[0]) },
        uMid: { value: new THREE.Color(project.colors[1]) },
        uLight: { value: new THREE.Color(project.colors[2]) },
        uKind: { value: project.kind },
      },
    });
    const segments = mobile ? 40 : 64;
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(project.radius, segments, segments / 2),
      this.material,
    );
    this.mesh.userData.planetIndex = index;
    this.mesh.rotation.set(0, index, 0.2 + index * 0.1);
    this.group.add(this.mesh);

    this.atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(project.radius * 1.075, 32, 24),
      new THREE.ShaderMaterial({
        vertexShader: planetVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          ...uniforms,
          uColor: { value: color },
          uKind: { value: project.kind },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    );
    this.group.add(this.atmosphere);

    // A lightweight billboard supplies the wide glow even when bloom is disabled.
    this.aura = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: auraVertex,
        fragmentShader: auraFragment,
        uniforms: {
          ...uniforms,
          uColor: { value: color },
          uRadius: { value: project.radius },
          uKind: { value: project.kind },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.aura.frustumCulled = false;
    this.group.add(this.aura);

    if (project.rings) {
      this.ring = new THREE.Mesh(
        new THREE.RingGeometry(1.4, 2.1, mobile ? 112 : 160),
        new THREE.ShaderMaterial({
          vertexShader: ringVertex,
          fragmentShader: ringFragment,
          uniforms: {
            ...uniforms,
            uColor: {
              value: color.clone().lerp(new THREE.Color(project.colors[2]), 0.25),
            },
          },
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
        }),
      );
      this.ring.rotation.set(-0.95, 0.2, -0.35);
      this.group.add(this.ring);
    }

    const count = mobile ? 45 : 100;
    const positions = new Float32Array(count * 3);
    this.orbitData = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = project.radius * (1.5 + Math.random() * 0.9);
      this.orbitData.push({ angle, radius, y: (Math.random() - 0.5) * 0.18 });
      positions.set(
        [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.25,
          Math.sin(angle) * radius,
        ],
        i * 3,
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.dust = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color,
        size: mobile ? 0.018 : 0.022,
        transparent: true,
        opacity: 0.46,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.dust.rotation.z = -0.28;
    this.group.add(this.dust);
    this.orbitPhase = 0;
  }

  update(time, dt, reduced) {
    const target = Math.max(this.targetHover, this.targetFocus * 0.65);
    this.interest = reduced
      ? target
      : THREE.MathUtils.damp(this.interest, target, 4, dt);
    this.energy.value = this.interest;
    this.presence.value = reduced
      ? this.targetPresence
      : THREE.MathUtils.damp(this.presence.value, this.targetPresence, 3, dt);
    this.dust.material.opacity =
      (0.46 + this.interest * 0.22) * this.presence.value;
    if (reduced) return;

    this.time.value = time + this.index * 2.4;
    this.mesh.rotation.y = time * 0.038 + this.index;
    this.group.position.y =
      this.baseY + Math.sin(time * 0.3 + this.index) * 0.045;
    this.atmosphere.rotation.y = time * 0.055;
    if (this.ring) this.ring.rotation.z = -0.35 + Math.sin(time * 0.12) * 0.018;
    // Integrate velocity so hovering accelerates dust without jumping its phase.
    this.orbitPhase += dt * (0.095 + this.interest * 0.07);
    const attribute = this.dust.geometry.attributes.position;
    for (let i = 0; i < this.orbitData.length; i++) {
      const orbit = this.orbitData[i];
      const angle = orbit.angle + this.orbitPhase / Math.sqrt(orbit.radius);
      attribute.setXYZ(
        i,
        Math.cos(angle) * orbit.radius,
        Math.sin(angle) * orbit.radius * 0.22 + orbit.y,
        Math.sin(angle) * orbit.radius,
      );
    }
    attribute.needsUpdate = true;
  }

  dispose() {
    this.group.traverse((object) => {
      object.geometry?.dispose();
      object.material?.dispose();
    });
  }
}
