import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

gsap.registerPlugin(ScrollTrigger);

let animFrameId: number | null = null;
let scrollTriggerInstance: ScrollTrigger | null = null;
let activeRenderer: THREE.WebGLRenderer | null = null;
let activeScene: THREE.Scene | null = null;
let themeObserverInstance: MutationObserver | null = null;

export function initCubeHeroScene(container: HTMLElement, canvas: HTMLCanvasElement) {
    disposeCubeHeroScene();

    const isMobile        = window.innerWidth < 768;
    const prefersNoMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let   w = container.clientWidth;
    let   h = container.clientHeight;

    const dismissLoading = () => {
        document.body.classList.remove('is-loading');
        const loadEl = document.getElementById('cubeLoading');
        if (loadEl) {
            gsap.to(loadEl, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => { loadEl.style.display = 'none'; }
            });
        }
    };

    const videoEl = document.getElementById('loadingVideo') as HTMLVideoElement | null;
    if (videoEl) {
        if (videoEl.ended) {
            dismissLoading();
        } else {
            videoEl.addEventListener('ended', dismissLoading, { once: true });
        }
    } else {
        dismissLoading();
    }

    // ── Direct 1-Pass Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
        canvas, antialias: true, alpha: false,
        powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    activeRenderer = renderer;

    // ── 3D Scene ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    activeScene = scene;

    const baseBgColorDark  = 0x000000; // Pure OLED Black
    const baseBgColorLight = 0xfaf9f5; // Claude.ai Sand / Warm Cream

    const getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';
    const initialTheme = getTheme();
    const initialBgHex = initialTheme === 'dark' ? baseBgColorDark : baseBgColorLight;

    scene.background = new THREE.Color(initialBgHex);
    scene.fog = new THREE.FogExp2(initialBgHex, 0.016);

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    // Environment
    const pmrem      = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
    scene.environment = envTexture;
    pmrem.dispose();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, initialTheme === 'dark' ? 0.30 : 0.60);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 6, 8); scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xC3B1E1, 1.5);
    fillLight.position.set(-5, -3, 4); scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x8EC8D8, 1.2);
    rimLight.position.set(0, 2, -8); scene.add(rimLight);

    const glowLight = new THREE.PointLight(0xC3B1E1, 4.0, 24);
    glowLight.position.set(0, 0, 2); scene.add(glowLight);

    // Starfield Dust Particles
    const pCount = isMobile ? 350 : 850;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 32;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const initialPColor = initialTheme === 'dark' ? 0xC3B1E1 : 0x8f79b5;
    const pMat = new THREE.PointsMaterial({
        color: initialPColor, size: isMobile ? 0.05 : 0.07,
        transparent: true, opacity: 0.65, depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Dynamic Theme Listener
    themeObserverInstance = new MutationObserver(() => {
        const t = getTheme();
        const bgHex = t === 'dark' ? baseBgColorDark : baseBgColorLight;
        scene.background = new THREE.Color(bgHex);
        if (scene.fog) {
            (scene.fog as THREE.FogExp2).color.setHex(bgHex);
        }
        ambientLight.intensity = t === 'dark' ? 0.30 : 0.60;
        pMat.color.setHex(t === 'dark' ? 0xC3B1E1 : 0x8f79b5);
    });
    themeObserverInstance.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });

    // ── ScrollTrigger (Zoom-In into Character Card on Scroll) ────────────
    if (!prefersNoMotion) {
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.cube-hero',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2,
                pin: '.cube-hero__pin-wrapper',
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        // Zoom Character Card into screen as user scrolls down
        scrollTl.to('#profileHeroCard', {
            scale: 3.4,
            opacity: 0,
            ease: 'power2.in',
            duration: 3,
        }, 0);

        // Zoom background "Sorachan" text with depth
        scrollTl.to('.ios-clock-depth-layer', {
            scale: 2.2,
            opacity: 0,
            ease: 'power2.in',
            duration: 2.5,
        }, 0);

        // Fade top/bottom info bars
        scrollTl.to('.hero-info-row, .hero-bottom-bar', {
            opacity: 0,
            y: -40,
            duration: 1.5,
        }, 0);

        // Move 3D camera forward into scene
        scrollTl.to(camera.position, {
            z: 2.5,
            duration: 3,
        }, 0);

        scrollTriggerInstance = scrollTl.scrollTrigger ?? null;
    }

    // ── Mouse Camera Sway ────────────────────────────────────────────────
    const targetMouse  = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
        targetMouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
        targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
        w = container.clientWidth;
        h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── Render Loop ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();

    const loop = () => {
        animFrameId = requestAnimationFrame(loop);
        const elapsed = clock.getElapsedTime();

        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.04;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.04;

        // Camera gentle drift
        camera.position.x += ( currentMouse.x * 0.35 - camera.position.x) * 0.03;
        camera.position.y += ( currentMouse.y * 0.20 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        glowLight.intensity = 3.5 + Math.sin(elapsed * 1.5) * 0.6;

        // Particles float
        const pa = pGeo.attributes.position.array as Float32Array;
        for (let i = 1; i < pa.length; i += 3) {
            pa[i] += 0.004;
            if (pa[i] > 16) pa[i] = -16;
        }
        pGeo.attributes.position.needsUpdate = true;
        particles.rotation.y = elapsed * 0.006;

        renderer.render(scene, camera);
    };
    loop();

    document.addEventListener('astro:before-swap', () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize',    onResize);
        disposeCubeHeroScene();
    }, { once: true });
}

export function disposeCubeHeroScene() {
    if (animFrameId)           { cancelAnimationFrame(animFrameId); animFrameId = null; }
    if (scrollTriggerInstance) { scrollTriggerInstance.kill(); scrollTriggerInstance = null; }
    if (themeObserverInstance) { themeObserverInstance.disconnect(); themeObserverInstance = null; }
    if (activeScene) {
        activeScene.traverse((obj) => {
            const m = obj as THREE.Mesh;
            if (m.isMesh) {
                m.geometry?.dispose();
                const mats = Array.isArray(m.material) ? m.material : [m.material];
                mats.forEach(mt => mt?.dispose());
            }
        });
        activeScene = null;
    }
    if (activeRenderer) { activeRenderer.dispose(); activeRenderer = null; }
}
