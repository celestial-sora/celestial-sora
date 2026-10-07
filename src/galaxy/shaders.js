export const planetVertex = /* glsl */ `
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vView;
void main(){
 vPosition=position;
 vNormal=normalize(normalMatrix*normal);
 vec4 mv=modelViewMatrix*vec4(position,1.0);
 vView=-mv.xyz;
 gl_Position=projectionMatrix*mv;
}`;
export const planetFragment = /* glsl */ `
uniform vec3 uDark; uniform vec3 uMid; uniform vec3 uLight;
uniform float uTime; uniform float uKind; uniform float uHover; uniform float uPresence;
varying vec3 vPosition; varying vec3 vNormal; varying vec3 vView;
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,v=0.;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+vec3(5.7);a*=.5;}return v;}
void main(){
 vec3 p=normalize(vPosition); float n=fbm(p*5.0+vec3(uTime*.012,0.,0.));
 float detail=fbm(p*20.0+n*3.0);
 float pattern;
 if(uKind<.5){pattern=.5+.28*sin(p.y*24.+n*10.)+.22*detail;}
 else if(uKind<1.5){pattern=fbm(p*3.+n*3.)*.8+detail*.4;}
 else if(uKind<2.5){pattern=.5+.22*sin(p.y*32.+n*12.)+.2*detail;}
 else if(uKind<3.5){pattern=smoothstep(.24,.8,n)*.6+detail*.5;}
 else{pattern=smoothstep(.35,.66,n)*.65+detail*.3;}
 vec3 color=mix(uDark,uMid,smoothstep(.12,.58,pattern));
 color=mix(color,uLight,smoothstep(.58,.95,pattern)*.8);
 vec3 normal=normalize(vNormal); vec3 viewDir=normalize(vView);
 float diffuse=max(0.,dot(normal,normalize(vec3(-.8,.55,-.3))));
 float rim=pow(1.-max(0.,dot(normal,viewDir)),3.5);
 color*=.025+diffuse*1.1;
 // Light scatters at the horizon; the dark hemisphere keeps its volume.
 float flow=.5+.5*sin(p.y*9.+n*7.-uTime*.32);
 color+=uLight*rim*(.5+uHover*.65)*( .85+flow*.15 );
 if(uKind>1.5&&uKind<2.5){color+=uMid*pow(1.-abs(p.y),5.)*rim*flow*.32;}
 if(uKind>3.5){float aurora=pow(max(0.,sin(p.y*13.+n*6.-uTime*.35)),8.);color+=uMid*aurora*rim*(.4+uHover*.35);}
 if(uKind>2.5&&uKind<3.5){float veins=pow(1.-smoothstep(0.,.065,abs(n-.5)),3.);color+=uLight*veins*(.12+.07*sin(uTime*.45+n*9.));}
 gl_FragColor=vec4(color*uPresence,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const atmosphereFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uTime; uniform float uHover; uniform float uKind; uniform float uPresence;
varying vec3 vNormal; varying vec3 vView; varying vec3 vPosition;
void main(){
 float facing=abs(dot(normalize(vNormal),normalize(vView)));
 float rim=pow(1.-facing,2.6);
 vec3 p=normalize(vPosition);
 float current=.85+.15*sin(p.y*12.+p.x*5.-uTime*.4+uKind);
 float lit=.65+.35*max(0.,dot(normalize(vNormal),normalize(vec3(-.8,.55,.45))));
 gl_FragColor=vec4(uColor*1.8,rim*current*lit*(.52+uHover*.28)*uPresence);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const auraVertex = /* glsl */ `
varying vec2 vUv; uniform float uRadius;
void main(){
 vUv=uv;
 vec4 center=modelViewMatrix*vec4(0.,0.,0.,1.);
 center.xy+=position.xy*uRadius*2.8;
 center.z-=uRadius*.12;
 gl_Position=projectionMatrix*center;
}`;
export const auraFragment = /* glsl */ `
varying vec2 vUv;
uniform vec3 uColor; uniform float uTime; uniform float uHover; uniform float uKind; uniform float uPresence;
void main(){
 vec2 p=(vUv-.5)*2.;
 float r=length(p)*2.8;
 float angle=atan(p.y,p.x);
 float drift=uTime*.13;
 float wisps=sin(angle*3.+drift+uKind)*sin(angle*5.-drift*.7+r*3.);
 float reach=1.+wisps*.07;
 float distanceFromEdge=max(0.,r-reach);
 float halo=exp(-distanceFromEdge*6.0)*.38+exp(-distanceFromEdge*2.8)*.075;
 float corona=exp(-pow((r-1.055)*16.,2.))*.28;
 float outside=smoothstep(.91,1.025,r);
 float edge=1.-smoothstep(2.2,2.75,r);
 float breathing=.94+.06*sin(uTime*.55+uKind*1.8);
 float lightSide=.75+.25*dot(normalize(p+vec2(.001)),normalize(vec2(-.8,.6)));
 vec3 tint=mix(uColor,uColor*.6+vec3(.4),corona*.7);
 gl_FragColor=vec4(tint*1.6,(halo+corona)*outside*edge*lightSide*breathing*(1.+uHover*.6)*uPresence);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const ringVertex = /* glsl */ `
varying vec3 vPosition;void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
export const ringFragment = /* glsl */ `
uniform vec3 uColor; uniform float uRadius; uniform float uTime; uniform float uHover; uniform float uPresence; varying vec3 vPosition;
void main(){
 float r=length(vPosition.xy)/uRadius,a=atan(vPosition.y,vPosition.x);
 float bands=.36+.16*sin(r*125.)+.1*sin(r*263.)+.08*sin(r*57.);
 float edge=smoothstep(1.25,1.3,r)*(1.-smoothstep(1.84,1.9,r));
 float gap=smoothstep(0.,.015,abs(r-1.63));
 float glint=pow(max(0.,cos(a-uTime*.13)),24.);
 vec3 color=uColor*(.6+bands*.5)+uColor*glint*(.5+uHover*.6);
 gl_FragColor=vec4(color,bands*edge*mix(.2,1.,gap)*1.35*uPresence);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export const starVertex = /* glsl */ `
attribute float aSize; attribute float aPhase; varying float vAlpha;
uniform float uTime; uniform float uPixelRatio;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uPixelRatio*15./-mv.z,.7,3.5*uPixelRatio);vAlpha=.07+.035*sin(aPhase+uTime*.12);}`;
export const starFragment = /* glsl */ `
varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d);gl_FragColor=vec4(vec3(.76,.76,.86),a*vAlpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
