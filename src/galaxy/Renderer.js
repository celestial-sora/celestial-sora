import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
export class GalaxyRenderer {
  constructor(canvas, scene, camera, width, height, mobile) {
    // WebKit can discard/present empty WebGL buffers during DOM compositing.
    // iOS browsers also use WebKit, even when branded Chrome or Firefox.
    this.direct = /AppleWebKit/i.test(navigator.userAgent) &&
      !/Chrome|Chromium|Edg|OPR|Android/i.test(navigator.userAgent);
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
    this.mobile = mobile;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: this.direct,
      powerPreference: "high-performance",
    });
    this.pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      mobile || this.direct ? 1.35 : 1.75,
    );
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(width, height, false);
    this.renderer.setClearColor("#000000");
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    if (this.direct) {
      canvas.classList.add("stable-webgl");
    } else {
      this.composer = new EffectComposer(this.renderer);
      this.renderPass = new RenderPass(scene, camera);
      this.composer.addPass(this.renderPass);
      this.bloom = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.36,
        0.65,
        0.85,
      );
      this.bloom.enabled = !mobile;
      this.composer.addPass(this.bloom);
      this.output = new OutputPass();
      this.composer.addPass(this.output);
    }
    this.slowFrames = 0;
    this.samples = 0;
    this.reducedQuality = false;
  }
  resize(w, h) {
    this.pixelRatio = this.reducedQuality
      ? 1
      : Math.min(
          window.devicePixelRatio || 1,
          this.mobile || w < 700 || this.direct ? 1.35 : 1.75,
        );
    this.renderer.setPixelRatio(this.pixelRatio);
    this.composer?.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(w, h, false);
    this.composer?.setSize(w, h);
    if (this.bloom)
      this.bloom.enabled = w >= 700 && !this.mobile && !this.reducedQuality;
  }
  render(dt) {
    if (dt > 0.025 && dt < 0.1) this.slowFrames++;
    this.samples++;
    if (this.samples === 180) {
      if (this.slowFrames > 100 && !this.reducedQuality) {
        this.reducedQuality = true;
        this.pixelRatio = 1;
        this.renderer.setPixelRatio(1);
        this.composer?.setPixelRatio(1);
        if (this.bloom) this.bloom.enabled = false;
      }
      this.samples = 0;
      this.slowFrames = 0;
    }
    // Resolution changes clear the canvas; draw after them in the same frame.
    if (this.direct) this.renderer.render(this.scene, this.camera);
    else this.composer.render();
  }
  dispose() {
    this.canvas.classList.remove("stable-webgl");
    this.bloom?.dispose();
    this.output?.dispose();
    this.renderPass?.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
  }
}
