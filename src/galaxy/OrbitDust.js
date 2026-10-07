import * as THREE from "three";
import { orbitPosition } from "./OrbitLayout.js";
import { starFragment } from "./shaders.js";

export class OrbitDust {
  constructor(mobile, pixelRatio) {
    const count = mobile ? 225 : 500;
    this.samples = Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      scale: 0.78 + Math.random() * 0.44,
      lift: (Math.random() - 0.5) * 0.7,
    }));
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    this.geometry.setAttribute("aSize", new THREE.BufferAttribute(Float32Array.from(this.samples, () => 0.7 + Math.random() * 2.4), 1));
    this.geometry.setAttribute("aPhase", new THREE.BufferAttribute(Float32Array.from(this.samples, () => Math.random() * Math.PI * 2), 1));
    this.material = new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        attribute float aSize; attribute float aPhase; varying float vAlpha;
        uniform float uTime; uniform float uPixelRatio;
        void main() {
          vec3 p = position;
          p += vec3(sin(aPhase + uTime * .12), cos(aPhase + uTime * .09), sin(aPhase + uTime * .08)) * .07;
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(aSize * uPixelRatio * 15. / -mv.z, .7, 3. * uPixelRatio);
          vAlpha = .25 + .12 * sin(aPhase + uTime * .3);
        }`,
      fragmentShader: starFragment,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.name = "orbital-particles";
  }

  layout(mobile) {
    const positions = this.geometry.attributes.position;
    this.samples.forEach((sample, i) => {
      const [x, y, z] = orbitPosition(sample.angle, mobile, sample.scale);
      positions.setXYZ(i, x, y + sample.lift, z);
    });
    positions.needsUpdate = true;
    this.geometry.computeBoundingSphere();
  }

  update(time, pixelRatio) {
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uPixelRatio.value = pixelRatio;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
