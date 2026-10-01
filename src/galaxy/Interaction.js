import * as THREE from 'three';
export class Interaction {
 constructor(stage,galaxy,onSelect,onTravel){
  this.stage=stage;this.galaxy=galaxy;this.onSelect=onSelect;this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2(10,10);this.abort=new AbortController();this.hovered=-1;this.wheelDelta=0;this.lastTravel=0;this.cursor=document.querySelector('#custom-cursor');this.dragStart=null;
  const opts={signal:this.abort.signal};
  stage.addEventListener('pointermove',e=>this.move(e),opts);
  document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')this.cursor.classList.remove('visible');},opts);
  stage.addEventListener('pointerleave',()=>this.clear(),opts);
  stage.addEventListener('pointerdown',e=>{this.dragStart={x:e.clientX,y:e.clientY};},opts);
  stage.addEventListener('pointerup',e=>{if(e.target.closest('button'))return;const d=this.dragStart;if(!d)return;const dy=e.clientY-d.y;const distance=Math.hypot(e.clientX-d.x,dy);if(distance<10){this.move(e);if(this.hovered>=0)this.onSelect(this.hovered);}else if(e.pointerType==='touch'&&Math.abs(dy)>35){onTravel(dy<0?1:-1);}this.dragStart=null;},opts);
  window.addEventListener('wheel',e=>{if(this.galaxy.rig.selected>=0||document.querySelector('dialog[open]')||e.ctrlKey)return;e.preventDefault();if(performance.now()-this.lastTravel<1200)return;this.wheelDelta+=e.deltaY*(e.deltaMode===1?16:1);if(Math.abs(this.wheelDelta)>65){onTravel(this.wheelDelta>0?1:-1);this.wheelDelta=0;this.lastTravel=performance.now();}}, {...opts,passive:false});
 }
 move(e){if(this.galaxy.rig.selected>=0){this.clear();return;}const rect=this.stage.getBoundingClientRect();this.pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);if(e.pointerType!=='touch')this.galaxy.rig.pointer.copy(this.pointer);this.raycaster.setFromCamera(this.pointer,this.galaxy.rig.camera);const hit=this.raycaster.intersectObjects(this.galaxy.planets.map(p=>p.mesh),false)[0];this.hovered=hit?hit.object.userData.planetIndex:-1;this.galaxy.hover(this.hovered);this.stage.style.cursor=this.hovered>=0?'pointer':'';if(e.pointerType!=='touch'&&!this.galaxy.reduced){this.cursor.style.transform=`translate(${e.clientX-20}px,${e.clientY-20}px)`;this.cursor.classList.toggle('visible',this.hovered>=0);}this.galaxy.invalidate();}
 clear(){this.hovered=-1;this.galaxy.hover(-1);this.galaxy.rig.pointer.set(0,0);this.stage.style.cursor='';this.cursor.classList.remove('visible');}
 dispose(){this.abort.abort();this.clear();}
}
