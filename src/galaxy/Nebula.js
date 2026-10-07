import * as THREE from "three";
// One soft procedural cloud and a sparse spiral. No downloaded textures.
export class Nebula {
  constructor(mobile) {
    this.group = new THREE.Group();
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
 void main(){
 vec2 p=(vUv-.5)*2.;p=mat2(.87,-.5,.5,.87)*p;p.y*=1.35;
 float r=length(p),n=noise(p*8.)*.5+noise(p*19.)*.27+noise(p*47.)*.12;
 float a=atan(p.y,p.x),arm=pow(.5+.5*sin(a*2.+r*14.+n*4.),3.);
 float cloud=exp(-r*r*4.8)*arm*n*.45;
 vec3 color=mix(vec3(.09,.13,.29),vec3(.55,.35,.15),exp(-r*r*17.))*cloud;
 color+=vec3(.74,.5,.27)*exp(-r*r*48.)*(.19+n*.2);
 color+=vec3(2.8,2.3,1.65)*exp(-r*r*650.);
 gl_FragColor=vec4(color,1.);
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
        [Math.cos(a) * r, Math.sin(a) * r * 0.74, (Math.random() - 0.5) * 0.5],
        i * 3,
      );
      color.set(r < 2 ? "#b9a182" : "#68769f");
      color.multiplyScalar(0.55 + Math.random() * 0.65);
      colors.set([color.r, color.g, color.b], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.dust = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.025,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.dust.rotation.set(0, 0, 0.5);
    this.group.add(this.dust);
  }
  update(time) {
    this.dust.rotation.z = 0.5 + time * 0.006;
  }
  layout(mobile) {
    this.group.position.set(mobile ? 0 : 5.2, mobile ? -0.6 : 1, -3);
    this.group.scale.setScalar(mobile ? 0.7 : 1);
  }
  dispose() {
    this.group.traverse((o) => {
      o.geometry?.dispose();
      o.material?.dispose();
    });
  }
}
