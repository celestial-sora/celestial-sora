import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CONFIGURATION & CONFIG CONSTANTS
// ==========================================
const ASSET_CONFIG = {
    modelPath: '/sora-catgirl.glb',          // Catgirl model path
    bgImagePath: '/bg-isekai.webp',         // Isekai 2D background wallpaper
    modelScale: 2.2,                        // Base scale for the character model
    modelPosition: new THREE.Vector3(0, -1.8, -4), // Placement of model in world
    cubeColor: 0xdceefb,                    // Ice ice-blue base color
    cubeAttenuationColor: 0xa594c8,         // Purple attenuation (internal absorption)
    accentColor: 0xC3B1E1,                  // Sora Astralis brand pastel purple
    cyanColor: 0x8EC8D8,                    // Sora Astralis brand cyan
};

// State variables to manage unmounting
let activeScene: THREE.Scene | null = null;
let activeRenderer: THREE.WebGLRenderer | null = null;
let activeCamera: THREE.PerspectiveCamera | null = null;
let animFrameId: number | null = null;
let scrollTriggerInstance: ScrollTrigger | null = null;
let modelMixer: THREE.AnimationMixer | null = null;
const clock = new THREE.Clock();

export function initCubeHeroScene(container: HTMLElement, canvas: HTMLCanvasElement) {
    const startTime = Date.now();

    // Add class to body to hide Navbar during loading
    document.body.classList.add('is-loading');

    // Clean up any previously active instances before initializing a new one
    disposeCubeHeroScene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Detect accessibility setting for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Render Engine setup
    const scene = new THREE.Scene();
    activeScene = scene;

    // Default dark theme background color
    const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
    scene.background = new THREE.Color(isDark ? 0x1a1915 : 0xfaf9f5);
    scene.fog = new THREE.FogExp2(isDark ? 0x1a1915 : 0xfaf9f5, 0.035);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 8); // Start camera far away facing the ice cube
    activeCamera = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !isMobile, // Disable antialiasing on mobile for better performance
        alpha: false,
        powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    activeRenderer = renderer;

    // Generate environment map using RoomEnvironment for realistic ice reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Spotlight dedicated to the model inside the portal/world
    const modelSpotLight = new THREE.SpotLight(ASSET_CONFIG.accentColor, 0.0); // Starts off (intensity=0)
    modelSpotLight.position.set(0, 4, -2);
    modelSpotLight.angle = Math.PI / 4;
    modelSpotLight.penumbra = 0.5;
    modelSpotLight.castShadow = !isMobile;
    scene.add(modelSpotLight);

    // 5. Creating the Ice Cube
    const iceGroup = new THREE.Group();
    scene.add(iceGroup);

    // Create main cube geometry
    const cubeGeo = new THREE.BoxGeometry(2.3, 2.3, 2.3);
    
    // Create cube mosaic tile texture — matches reference: dark 3D grid tiles with groove lines
    const iceTexLoader = new THREE.TextureLoader();

    // Color/roughness map — the mosaic tile image
    const iceTileMap = iceTexLoader.load('/ice-texture.png');
    iceTileMap.wrapS = THREE.RepeatWrapping;
    iceTileMap.wrapT = THREE.RepeatWrapping;
    iceTileMap.repeat.set(1, 1);       // 1x1 so the full grid fits the face cleanly
    iceTileMap.colorSpace = THREE.SRGBColorSpace;

    // Normal map — same image, used to create the ลีกตื้น (shallow groove relief) effect
    // Lighter areas = raised tiles, darker groove gaps = recessed channels
    const iceTileNormal = iceTexLoader.load('/ice-texture.png');
    iceTileNormal.wrapS = THREE.RepeatWrapping;
    iceTileNormal.wrapT = THREE.RepeatWrapping;
    iceTileNormal.repeat.set(1, 1);

    let cubeMat: THREE.Material;
    if (isMobile) {
        cubeMat = new THREE.MeshStandardMaterial({
            color: ASSET_CONFIG.cubeColor,
            roughness: 0.4,
            metalness: 0.05,
            transparent: true,
            opacity: 0.92,
            map: iceTileMap,
            normalMap: iceTileNormal,
            normalScale: new THREE.Vector2(0.6, 0.6),   // Stronger normal for visible groove
            bumpMap: iceTileMap,
            bumpScale: 0.04,                              // Shallow physical depth
        });
    } else {
        cubeMat = new THREE.MeshPhysicalMaterial({
            color: ASSET_CONFIG.cubeColor,
            transmission: 0.85,
            opacity: 1.0,
            transparent: true,
            roughness: 0.18,
            metalness: 0.0,
            ior: 1.31,
            thickness: 1.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.2,
            attenuationColor: ASSET_CONFIG.cubeAttenuationColor,
            attenuationDistance: 1.5,
            // ลีกตื้น (shallow groove) effect — normalScale controls depth intensity
            normalMap: iceTileNormal,
            normalScale: new THREE.Vector2(1.2, 1.2),    // Strong enough to see tile edges
            roughnessMap: iceTileMap,                     // Groove gaps look rougher, tiles smoother
            bumpMap: iceTileMap,
            bumpScale: 0.06,                              // Subtle physical height variation
        });
    }

    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    cubeMesh.castShadow = true;
    cubeMesh.receiveShadow = true;
    iceGroup.add(cubeMesh);

    // Add frosted blue edge lines to give shape definition
    const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgeMat = new THREE.LineBasicMaterial({ 
        color: ASSET_CONFIG.cyanColor, 
        transparent: true, 
        opacity: 0.35 
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    iceGroup.add(edgeLines);

    // PointLight inside/behind the ice cube to make it glow
    const iceGlowLight = new THREE.PointLight(ASSET_CONFIG.cyanColor, 1.8, 6);
    iceGlowLight.position.set(0, 0, 0);
    iceGroup.add(iceGlowLight);

    // 6. Creating the Background World (Projected onto a large sphere)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const bgSphereGeo = new THREE.SphereGeometry(30, 40, 40);
    bgSphereGeo.scale(-1, 1, 1); // Invert normals so texture faces inwards
    
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load(ASSET_CONFIG.bgImagePath);
    bgTexture.colorSpace = THREE.SRGBColorSpace;

    const bgMat = new THREE.MeshBasicMaterial({
        map: bgTexture,
        transparent: true,
        opacity: 0.0 // Starts invisible, fades in on scroll reveal
    });
    const bgMesh = new THREE.Mesh(bgSphereGeo, bgMat);
    bgMesh.rotation.y = -Math.PI / 2; // Adjust starting orientation
    worldGroup.add(bgMesh);

    // 7. Ambient Particle System (Cosmic Stars / Ice shards)
    const particleCount = isMobile ? 450 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Distribute particles randomly around the viewport
        particlePositions[i] = (Math.random() - 0.5) * 20;
        particlePositions[i + 1] = (Math.random() - 0.5) * 20;
        particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: ASSET_CONFIG.accentColor,
        size: isMobile ? 0.04 : 0.06,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Model opacity tracker for ScrollTrigger
    const modelOpacity = { value: prefersReducedMotion ? 1.0 : 0.0 };

    // 8. Load the 3D VTuber/Catgirl Model
    let loadedModel: THREE.Object3D | null = null;
    const gltfLoader = new GLTFLoader();

    // DOM UI elements for Loading Screen
    const loadingScreen = document.getElementById('cubeLoading');
    const loadingPercentText = document.getElementById('loadingPercent');
    const loadingBarFill = document.getElementById('loadingBarFill');

    gltfLoader.load(
        ASSET_CONFIG.modelPath,
        (gltf) => {
            loadedModel = gltf.scene;
            loadedModel.scale.setScalar(ASSET_CONFIG.modelScale);
            loadedModel.position.copy(ASSET_CONFIG.modelPosition);
            loadedModel.rotation.y = 0; // Face the camera forwards (GLB modeled facing away from default Z-backwards)

            // Hide initially until scrolled past 50%
            if (!prefersReducedMotion) {
                loadedModel.visible = false;
            }

            // Setup shadows and ensure transparency compatibility for fade-in
            loadedModel.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    
                    if (mesh.material) {
                        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                        mats.forEach(mat => {
                            mat.transparent = true;
                            mat.opacity = prefersReducedMotion ? 1.0 : 0.0;
                        });
                    }
                }
            });

            scene.add(loadedModel);

            // Connect animations if model has them
            if (gltf.animations && gltf.animations.length > 0) {
                modelMixer = new THREE.AnimationMixer(loadedModel);
                // Play first available animation clip (usually idle/breathing)
                const action = modelMixer.clipAction(gltf.animations[0]);
                action.play();
            }

            // Enforce minimum 5 seconds display for the loading screen animation
            const elapsed = Date.now() - startTime;
            const minDuration = 5000; // 5000ms = 5 seconds
            const delayTime = Math.max(0, minDuration - elapsed);

            setTimeout(() => {
                if (loadingPercentText) {
                    loadingPercentText.textContent = '100%';
                }
                if (loadingScreen) {
                    gsap.to(loadingScreen, {
                        opacity: 0,
                        duration: 0.8,
                        pointerEvents: 'none',
                        onComplete: () => {
                            loadingScreen.style.display = 'none';
                            // Remove body class to restore Navbar after loading
                            document.body.classList.remove('is-loading');
                        }
                    });
                }
            }, delayTime);
        },
        // Progress callback to feed the loading UI
        (xhr) => {
            if (xhr.total > 0) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                // Keep percent display capped before final 100% delay completion
                const displayedPercent = percent >= 100 ? 99 : percent;
                if (loadingPercentText) loadingPercentText.textContent = `${displayedPercent}%`;
                if (loadingBarFill) loadingBarFill.style.width = `${displayedPercent}%`;
            }
        },
        (error) => {
            console.error('Error loading 3D VTuber Model:', error);
            // Hide loading screen after minimum delay on error so page isn't blocked
            const elapsed = Date.now() - startTime;
            const minDuration = 5000;
            const delayTime = Math.max(0, minDuration - elapsed);
            setTimeout(() => {
                if (loadingScreen) loadingScreen.style.display = 'none';
                document.body.classList.remove('is-loading');
            }, delayTime);
        }
    );

    // 9. Setup GSAP ScrollTrigger timeline to map scroll -> WebGL animations
    // Dynamic look-at target vector
    const lookTarget = new THREE.Vector3(0, 0, 0);

    if (!prefersReducedMotion) {
        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.cube-hero',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2,
                pin: '.cube-hero__pin-wrapper',
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        // Step A: Fade out text overlay quickly at the start of scroll (0 -> 15%)
        scrollTimeline.to('#cubeOverlay', {
            opacity: 0,
            y: -50,
            duration: 1.5
        }, 0);

        // Step B: Camera moves forward through the cube face (0 -> 70% progress)
        scrollTimeline.to(camera.position, {
            z: 0.05,
            y: 0.15,
            x: 0.0,
            duration: 5.5,
            ease: 'power1.inOut'
        }, 0);

        // Step C: Look-at target shifts downward to focus on the character (0 -> 70%)
        scrollTimeline.to(lookTarget, {
            x: ASSET_CONFIG.modelPosition.x,
            y: ASSET_CONFIG.modelPosition.y + 0.9, // Align with character's torso/face area
            z: ASSET_CONFIG.modelPosition.z,
            duration: 5.5,
            ease: 'power1.inOut'
        }, 0);

        // Step D: Dissolve/fade out the Ice Cube (45% -> 70%)
        scrollTimeline.to(cubeMat, {
            opacity: 0.0,
            duration: 2.2,
            ease: 'power2.in'
        }, 3.0);

        scrollTimeline.to(edgeMat, {
            opacity: 0.0,
            duration: 1.8,
            ease: 'power2.in'
        }, 3.2);

        scrollTimeline.to(iceGlowLight, {
            intensity: 0.0,
            duration: 2.0
        }, 3.0);

        // Step E: Fade in background scene texture + lighting + model (55% -> 90%)
        scrollTimeline.to(bgMat, {
            opacity: 1.0,
            duration: 3.0,
            ease: 'power2.out'
        }, 3.8);

        scrollTimeline.to(modelOpacity, {
            value: 1.0,
            duration: 2.5,
            ease: 'power2.out'
        }, 4.0);

        scrollTimeline.to(ambientLight, {
            intensity: 0.75,
            duration: 2.5
        }, 4.0);

        scrollTimeline.to(modelSpotLight, {
            intensity: 3.5,
            duration: 3.0,
            ease: 'power2.out'
        }, 4.2);

        // Step F: Move camera to its final resting position in the new world (70% -> 100%)
        scrollTimeline.to(camera.position, {
            z: 5.0,
            y: 0.5,
            duration: 2.5,
            ease: 'power1.out'
        }, 5.5);

        // Save reference to destroy on unmount
        scrollTriggerInstance = scrollTimeline.scrollTrigger || null;

    } else {
        // Fallback for prefers-reduced-motion: skip animation, display final state immediately
        camera.position.set(0, 0.5, 5.0);
        lookTarget.copy(ASSET_CONFIG.modelPosition).y += 0.9;
        bgMat.opacity = 1.0;
        cubeMat.opacity = 0.0;
        edgeMat.opacity = 0.0;
        iceGlowLight.intensity = 0.0;
        ambientLight.intensity = 0.75;
        modelSpotLight.intensity = 3.5;

        // Hide overlay on immediate scroll
        window.addEventListener('scroll', () => {
            const overlay = document.getElementById('cubeOverlay');
            if (overlay) {
                if (window.scrollY > 50) {
                    overlay.style.opacity = '0';
                    overlay.style.transform = 'translateY(-30px)';
                } else {
                    overlay.style.opacity = '1';
                    overlay.style.transform = 'translateY(0)';
                }
            }
        }, { passive: true });
        
        // Hide loading screen if it's still displayed (in case of cached load)
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
        }, 500);
    }

    // 10. Mouse Interaction (Parallax Effect)
    const targetMouse = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
        // Normalize mouse coordinates to [-1, 1]
        targetMouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
        targetMouse.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 11. Theme Switch Handler (MutationObserver)
    const updateSceneTheme = () => {
        const isDarkTheme = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        const targetColor = isDarkTheme ? 0x1a1915 : 0xfaf9f5;
        
        gsap.to(scene.background as THREE.Color, {
            r: ((targetColor >> 16) & 255) / 255,
            g: ((targetColor >> 8) & 255) / 255,
            b: (targetColor & 255) / 255,
            duration: 0.5
        });

        if (scene.fog) {
            gsap.to((scene.fog as THREE.FogExp2).color, {
                r: ((targetColor >> 16) & 255) / 255,
                g: ((targetColor >> 8) & 255) / 255,
                b: (targetColor & 255) / 255,
                duration: 0.5
            });
        }
    };

    const themeObserver = new MutationObserver(updateSceneTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // 12. Viewport Resizing Handler
    const handleResize = () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 13. Main RAF Render Loop
    const renderLoop = () => {
        animFrameId = requestAnimationFrame(renderLoop);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Update animation mixer if animations are running
        if (modelMixer) {
            modelMixer.update(delta);
        } else if (loadedModel) {
            // Sway bobbing animation fallback if no clips are defined
            loadedModel.rotation.y = 0 + Math.sin(time * 0.4) * 0.06;
            loadedModel.position.y = ASSET_CONFIG.modelPosition.y + Math.sin(time * 1.2) * 0.04;
        }

        // Update loaded model visibility & opacity dynamically based on scroll timeline progress
        if (loadedModel && !prefersReducedMotion) {
            loadedModel.visible = modelOpacity.value > 0.01;
            loadedModel.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                    mats.forEach(mat => {
                        mat.opacity = modelOpacity.value;
                    });
                }
            });
        }

        // Rotate the ice cube in starting/middle phases
        if (cubeMat.opacity > 0.01) {
            iceGroup.rotation.y += 0.003;
            iceGroup.rotation.x += 0.001;
        }

        // Apply gentle mouse parallax movement
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;

        // Apply mouse position offset directly to camera coordinates
        camera.position.x += (currentMouse.x * 0.25 - camera.position.x) * 0.05;
        camera.position.y += (currentMouse.y * 0.2 - camera.position.y) * 0.05;

        // Update particles float drift
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 1; i < particlePositions.length; i += 3) {
            positions[i] += 0.004; // Drift upwards slowly
            if (positions[i] > 10) {
                positions[i] = -10; // Wrap at borders
            }
        }
        particleGeo.attributes.position.needsUpdate = true;
        particles.rotation.y = time * 0.015;

        // Keep camera focused on target
        camera.lookAt(lookTarget);

        renderer.render(scene, camera);
    };

    renderLoop();

    // 14. Cleanup listener for Astro's SPA routing (before swapping pages)
    document.addEventListener('astro:before-swap', () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        themeObserver.disconnect();
        disposeCubeHeroScene();
    }, { once: true });
}

// Full memory cleanup to prevent WebGL context leaks on navigation
export function disposeCubeHeroScene() {
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }

    if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
        scrollTriggerInstance = null;
    }

    if (activeScene) {
        activeScene.traverse((object) => {
            if ((object as THREE.Mesh).isMesh) {
                const mesh = object as THREE.Mesh;
                if (mesh.geometry) mesh.geometry.dispose();

                if (mesh.material) {
                    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                    mats.forEach(mat => mat.dispose());
                }
            }
        });
        activeScene = null;
    }

    if (activeRenderer) {
        activeRenderer.dispose();
        activeRenderer = null;
    }

    activeCamera = null;
    modelMixer = null;
}
