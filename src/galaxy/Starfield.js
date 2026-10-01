import * as THREE from 'three';
import { starVertex,starFragment } from './shaders.js';
export class Starfield {
 constructor(mobile,pixelRatio){
  const count=mobile?1100:2800;const position=new Float32Array(count*3),size=new Float32Array(count),phase=new Float32Array(count);
  for(let i=0;i<count;i++){position.set([(Math.random()-.5)*65,(Math.random()-.5)*44,-6-Math.random()*38],i*3);size[i]=.7+Math.pow(Math.random(),4)*3;phase[i]=Math.random()*6.28;}
  this.geometry=new THREE.BufferGeometry();this.geometry.setAttribute('position',new THREE.BufferAttribute(position,3));this.geometry.setAttribute('aSize',new THREE.BufferAttribute(size,1));this.geometry.setAttribute('aPhase',new THREE.BufferAttribute(phase,1));
  this.material=new THREE.ShaderMaterial({vertexShader:starVertex,fragmentShader:starFragment,uniforms:{uTime:{value:0},uPixelRatio:{value:pixelRatio}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});this.points=new THREE.Points(this.geometry,this.material);
 }
 update(time){this.material.uniforms.uTime.value=time;}
 dispose(){this.geometry.dispose();this.material.dispose();}
}
