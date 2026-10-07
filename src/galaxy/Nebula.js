import * as THREE from "three";
// One soft procedural cloud and a sparse spiral. No downloaded textures.
export class Nebula {
  constructor(mobile) {
    this.group = new THREE.Group();
    this.group.position.set(3.2, 0.5, -5);
    this.cloud = new THREE.Mesh(
      new THREE.PlaneGeometry(19, 19),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
 varying vec2 vUv;uniform float uTime;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
 void main(){vec2 p=(vUv-.5)*2.;p.x*=1.3;float r=length(p);float n=noise(p*8.)*.5+noise(p*19.)*.27+noise(p*47.)*.12;float a=atan(p.y,p.x);float arm=pow(.5+.5*sin(a*2.+r*14.+n*4.),3.);float cloud=exp(-r*r*5.)*arm*n*.15;float core=exp(-r*r*120.)*.2;vec3 color=mix(vec3(.38,.10,.23),vec3(.76,.32,.46),exp(-r*r*18.));gl_FragColor=vec4(color,cloud+core);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`,
      }),
    );
    this.group.add(this.cloud);
    const count = mobile ? 600 : 1400,
      positions = new Float32Array(count * 3),
      colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.6) * 6.5,
        a = r * 1.2 + (i % 2) * Math.PI + (Math.random() - 0.5) * 0.75;
      positions.set(
        [Math.cos(a) * r, (Math.random() - 0.5) * 0.4, Math.sin(a) * r],
        i * 3,
      );
      color.setHSL(0.94 - r * 0.008, 0.22, 0.18 + Math.random() * 0.2);
      colors.set([color.r, color.g, color.b], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.dust = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.018,
        transparent: true,
        opacity: 0.44,
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.dust.rotation.set(0.85, 0.2, 0.55);
    this.group.add(this.dust);
  }
  update(time) {
    this.dust.rotation.y = 0.2 + time * 0.006;
  }
  layout(mobile) {
    this.group.position.set(mobile ? 0 : 3.2, mobile ? -0.2 : 0.5, -5);
    this.group.scale.setScalar(mobile ? 0.7 : 1);
  }
  dispose() {
    this.group.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
  }
}
