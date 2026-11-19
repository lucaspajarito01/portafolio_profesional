/**
 * ============================================================================
 * SCENE.JS — Motor WebGL / Three.js con 6 escenas continuas en el eje Z
 * Incluye: MeshPhysicalMaterial, InstancedMesh, Shaders FBM, Tubo 3D y Postprocesado.
 * ============================================================================
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CONFIG } from './config.js';

/**
 * Shader de Postprocesado Cinematográfico:
 * - Viñeta fría suave
 * - Grano de película sutil
 * - Aberración cromática modulada únicamente por la velocidad de transición (uVelocity)
 */
const CinemaPostShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uVelocity: { value: 0 },
        uVignette: { value: 0.42 }
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uVelocity;
        uniform float uVignette;
        varying vec2 vUv;

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
            vec2 center = vUv - 0.5;
            float dist = length(center);

            // Aberración cromática leve solo en transiciones de scroll
            float aberration = clamp(uVelocity * 0.008, 0.0, 0.009) * dist;
            vec2 offset = normalize(center + 0.0001) * aberration;

            float r = texture2D(tDiffuse, vUv + offset).r;
            float g = texture2D(tDiffuse, vUv).g;
            float b = texture2D(tDiffuse, vUv - offset).b;
            vec3 color = vec3(r, g, b);

            // Viñeta cinematográfica fría
            float vig = smoothstep(0.85, 0.28, dist * (1.0 + uVignette));
            color *= mix(0.62, 1.0, vig);

            // Grano de película sutil
            float grain = (hash(vUv * 1000.0 + fract(uTime)) - 0.5) * 0.022;
            color += grain;

            gl_FragColor = vec4(color, 1.0);
        }
    `
};

/**
 * Shader de Nubes Volumétricas con Fractal Brownian Motion (FBM) para Escena 3
 */
const VolumetricFogShader = {
    uniforms: {
        uTime: { value: 0 },
        uColorDeep: { value: new THREE.Color(CONFIG.palette.deep) },
        uColorMist: { value: new THREE.Color(CONFIG.palette.ice) },
        uOpacity: { value: 0.42 }
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColorDeep;
        uniform vec3 uColorMist;
        uniform float uOpacity;
        varying vec2 vUv;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        float fbm(vec2 st) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 5; i++) {
                value += amplitude * noise(st);
                st *= 2.04;
                amplitude *= 0.5;
            }
            return value;
        }

        void main() {
            vec2 uv = vUv;
            vec2 q = vec2(0.0);
            q.x = fbm(uv * 3.0 + vec2(uTime * 0.03, 0.0));
            q.y = fbm(uv * 3.0 + vec2(0.0, uTime * 0.02));

            float f = fbm(uv * 3.5 + q + vec2(uTime * 0.04, -uTime * 0.015));

            // Máscara suave en los bordes del plano
            float radialMask = smoothstep(0.5, 0.12, length(vUv - 0.5));
            float alpha = smoothstep(0.22, 0.78, f) * radialMask * uOpacity;

            vec3 finalColor = mix(uColorDeep, uColorMist, clamp(f * 1.25, 0.0, 1.0));
            gl_FragColor = vec4(finalColor, alpha);
        }
    `
};

/**
 * Shader de Luz Fría en Expansión para Escena 6 (Contacto)
 */
const ExpandingLightShader = {
    uniforms: {
        uTime: { value: 0 },
        uExpansion: { value: 0.25 },
        uColorCore: { value: new THREE.Color(CONFIG.palette.mist) },
        uColorHalo: { value: new THREE.Color(CONFIG.palette.glacier) },
        uColorTeal: { value: new THREE.Color(CONFIG.palette.accentTeal) }
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uExpansion;
        uniform vec3 uColorCore;
        uniform vec3 uColorHalo;
        uniform vec3 uColorTeal;
        varying vec2 vUv;

        void main() {
            vec2 p = vUv - 0.5;
            float d = length(p);
            float pulse = sin(uTime * 1.4) * 0.025;
            float radius = mix(0.12, 0.44, uExpansion) + pulse;

            float core = smoothstep(radius, 0.0, d);
            float ring = smoothstep(radius + 0.15, radius - 0.04, d) - smoothstep(radius, radius - 0.08, d);

            vec3 col = mix(uColorHalo, uColorCore, pow(core, 1.6));
            col += uColorTeal * ring * 0.65;

            float alpha = clamp(core * 0.85 + ring * 0.4, 0.0, 0.92);
            gl_FragColor = vec4(col, alpha);
        }
    `
};

export class ExperienceScene {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.onProgress = options.onProgress || (() => {});
        this.onActiveSkillChange = options.onActiveSkillChange || (() => {});

        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isPaused = this.prefersReducedMotion;

        this.cameraTargetZ = CONFIG.cameraWaypoints.hero.zStart;
        this.cameraCurrentZ = CONFIG.cameraWaypoints.hero.zStart;
        this.scrollProgress = 0;
        this.scrollVelocity = 0;

        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.clock = new THREE.Clock();
        this.disposables = [];
        this.skillNodes = [];
        this.processNodes = [];
        this.fogPlanes = [];
        this.activeSkillId = null;
        this.fps = 60;
        this._frameCount = 0;
        this._lastFpsUpdate = performance.now();

        this.init();
    }

    static isWebGLAvailable() {
        try {
            const testCanvas = document.createElement('canvas');
            return !!(
                window.WebGLRenderingContext &&
                (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
            );
        } catch {
            return false;
        }
    }

    init() {
        this.onProgress(15, 'inicializando contexto WebGL2…');

        // Escena y Niebla Exponencial Fría
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.palette.night);
        this.scene.fog = new THREE.FogExp2(CONFIG.palette.night, 0.017);

        // Cámara Principal
        this.camera = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            0.1,
            180
        );
        this.camera.position.set(0, 0, this.cameraCurrentZ);

        // Renderizador optimizado (pixelRatio máx 2 para 60fps estables)
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: !this.isMobile,
            powerPreference: 'high-performance',
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.08;

        this.onProgress(32, 'configurando iluminación volumétrica…');
        this.setupLights();

        this.onProgress(48, 'esculpiendo cristal hero y partículas instanciadas…');
        this.buildHeroScene();
        this.buildInstancedParticles();

        this.onProgress(64, 'grabando monolitos de skills en el corredor Z…');
        this.buildSkillsCorridor();

        this.onProgress(78, 'generando montañas en parallax y shader FBM de niebla…');
        this.buildFogLandscape();

        this.onProgress(90, 'trazando tubo de luz 3D y núcleo de resplandor…');
        this.buildProjectsBackdrop();
        this.buildProcessTimeline();
        this.buildContactPortal();

        this.setupPostProcessing();
        this.bindEvents();

        this.onProgress(100, 'experiencia compilada · 60 FPS listos.');
    }

    setupLights() {
        const ambient = new THREE.AmbientLight(CONFIG.palette.ice, 0.65);
        this.scene.add(ambient);

        const dirLight1 = new THREE.DirectionalLight(CONFIG.palette.mist, 2.2);
        dirLight1.position.set(8, 14, 12);
        this.scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(CONFIG.palette.glacier, 1.5);
        dirLight2.position.set(-10, -8, -20);
        this.scene.add(dirLight2);

        // Luz puntual móvil que acompaña a la cámara con tono glaciar frío
        this.cameraLight = new THREE.PointLight(CONFIG.palette.glacier, 2.6, 38, 1.6);
        this.scene.add(this.cameraLight);
    }

    /**
     * ESCENA 1: Objeto 3D Hero (Cristal facetado + Nudo Toroidal interno) con MeshPhysicalMaterial
     */
    buildHeroScene() {
        this.heroGroup = new THREE.Group();
        this.heroGroup.position.set(0, 0, 0);

        // Núcleo Toroidal Metálico-Frío
        const knotGeo = new THREE.TorusKnotGeometry(1.18, 0.34, 140, 28, 2, 3);
        const knotMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(CONFIG.palette.steel),
            emissive: new THREE.Color(CONFIG.palette.deep),
            emissiveIntensity: 0.4,
            metalness: 0.78,
            roughness: 0.18,
            clearcoat: 1.0,
            clearcoatRoughness: 0.12,
            reflectivity: 0.95
        });
        this.heroCoreMesh = new THREE.Mesh(knotGeo, knotMat);
        this.heroGroup.add(this.heroCoreMesh);

        // Cristal Facetado Exterior (Vidrio-Metal)
        const crystalGeo = new THREE.IcosahedronGeometry(2.45, 0);
        const crystalMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(CONFIG.palette.ice),
            metalness: 0.15,
            roughness: 0.08,
            transmission: 0.82,
            thickness: 1.4,
            ior: 1.48,
            transparent: true,
            opacity: 0.88,
            clearcoat: 1.0,
            wireframe: false,
            flatShading: true
        });
        this.heroCrystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
        this.heroGroup.add(this.heroCrystalMesh);

        // Armazón de aristas finas color hielo
        const edgesGeo = new THREE.EdgesGeometry(crystalGeo);
        const edgesMat = new THREE.LineBasicMaterial({
            color: new THREE.Color(CONFIG.palette.ice),
            transparent: true,
            opacity: 0.38
        });
        this.heroEdges = new THREE.LineSegments(edgesGeo, edgesMat);
        this.heroEdges.scale.setScalar(1.03);
        this.heroGroup.add(this.heroEdges);

        // Anillo orbital sutil
        const ringGeo = new THREE.RingGeometry(3.2, 3.24, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(CONFIG.palette.accentTeal),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.32
        });
        this.heroRing = new THREE.Mesh(ringGeo, ringMat);
        this.heroRing.rotation.x = Math.PI * 0.38;
        this.heroGroup.add(this.heroRing);

        this.scene.add(this.heroGroup);
        this.disposables.push(knotGeo, knotMat, crystalGeo, crystalMat, edgesGeo, edgesMat, ringGeo, ringMat);
    }

    /**
     * Partículas flotantes con InstancedMesh a lo largo de todo el túnel Z
     */
    buildInstancedParticles() {
        const count = this.isMobile ? 480 : 1350;
        const particleGeo = new THREE.OctahedronGeometry(0.06, 0);
        const particleMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(CONFIG.palette.ice),
            transparent: true,
            opacity: 0.55
        });

        this.particlesMesh = new THREE.InstancedMesh(particleGeo, particleMat, count);
        const dummy = new THREE.Object3D();
        this.particleData = [];

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 42;
            const y = (Math.random() - 0.5) * 26;
            const z = 14 - Math.random() * 345;
            const scale = 0.4 + Math.random() * 1.4;

            dummy.position.set(x, y, z);
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            this.particlesMesh.setMatrixAt(i, dummy.matrix);

            this.particleData.push({
                x,
                y,
                z,
                scale,
                speed: 0.2 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }

        this.scene.add(this.particlesMesh);
        this.disposables.push(particleGeo, particleMat);
    }

    /**
     * Genera una textura Canvas con el icono SVG minimalista y el nombre de la Skill
     */
    createSkillCrystalTexture(skill, index) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Fondo translúcido azul noche/acero
        const grad = ctx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0, 'rgba(15, 27, 45, 0.92)');
        grad.addColorStop(1, 'rgba(7, 11, 20, 0.96)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Borde técnico frío
        ctx.strokeStyle = 'rgba(169, 199, 217, 0.45)';
        ctx.lineWidth = 4;
        ctx.strokeRect(18, 18, 476, 476);

        // Número de índice arriba a la izquierda
        ctx.fillStyle = '#7FA6A0';
        ctx.font = '500 26px "DM Mono", monospace';
        ctx.fillText(`0${index + 1} // SKILL_NODE`, 42, 64);

        // Dibujar icono SVG centrado usando Path2D
        ctx.save();
        ctx.translate(166, 130);
        ctx.scale(7.5, 7.5);
        const path = new Path2D(skill.svgPath);
        ctx.fillStyle = '#DCE6EE';
        ctx.shadowColor = '#5B8DB8';
        ctx.shadowBlur = 12;
        ctx.fill(path);
        ctx.restore();

        // Nombre de la skill abajo
        ctx.fillStyle = '#DCE6EE';
        ctx.font = '700 34px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(skill.name.toUpperCase(), 256, 398);

        // Categoría técnica
        ctx.fillStyle = '#A9C7D9';
        ctx.font = '400 20px "DM Mono", monospace';
        ctx.fillText(skill.category, 256, 438);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        this.disposables.push(texture);
        return texture;
    }

    /**
     * ESCENA 2: Travesía de Skills (Campo de cubos/cristales flotantes con iconos SVG grabados)
     */
    buildSkillsCorridor() {
        this.skillsGroup = new THREE.Group();
        const boxGeo = new THREE.BoxGeometry(2.5, 2.5, 0.36);
        const shellGeo = new THREE.OctahedronGeometry(2.15, 0);
        const shellEdgesGeo = new THREE.EdgesGeometry(shellGeo);

        this.disposables.push(boxGeo, shellGeo, shellEdgesGeo);

        CONFIG.skills.forEach((skill, idx) => {
            const nodeGroup = new THREE.Group();
            nodeGroup.position.set(skill.pos.x, skill.pos.y, skill.pos.z);

            const texture = this.createSkillCrystalTexture(skill, idx);

            const faceMat = new THREE.MeshPhysicalMaterial({
                map: texture,
                color: new THREE.Color(CONFIG.palette.mist),
                emissive: new THREE.Color(CONFIG.palette.steel),
                emissiveIntensity: 0.22,
                metalness: 0.35,
                roughness: 0.2,
                clearcoat: 0.9
            });

            const crystalCore = new THREE.Mesh(boxGeo, faceMat);
            nodeGroup.add(crystalCore);

            const wireMat = new THREE.LineBasicMaterial({
                color: new THREE.Color(CONFIG.palette.glacier),
                transparent: true,
                opacity: 0.35
            });
            const wireShell = new THREE.LineSegments(shellEdgesGeo, wireMat);
            nodeGroup.add(wireShell);

            this.skillsGroup.add(nodeGroup);
            this.disposables.push(faceMat, wireMat);

            this.skillNodes.push({
                data: skill,
                group: nodeGroup,
                core: crystalCore,
                shell: wireShell,
                material: faceMat,
                wireMaterial: wireMat,
                basePos: { ...skill.pos }
            });
        });

        this.scene.add(this.skillsGroup);
    }

    /**
     * ESCENA 3: Paisaje de Niebla (Capas de montañas en parallax + Nubes volumétricas FBM)
     */
    buildFogLandscape() {
        this.landscapeGroup = new THREE.Group();

        // Función simple de altura pseudo-fractal para las crestas de montaña
        const computeRidgeHeight = (x, z) => {
            const valleyMask = smoothstep(1.5, 11.0, Math.abs(x));
            const h1 = Math.sin(x * 0.35 + z * 0.18) * Math.cos(z * 0.22) * 3.6;
            const h2 = Math.sin(x * 0.85 - z * 0.45) * 1.4;
            const h3 = Math.cos(x * 1.7 + z * 0.9) * 0.55;
            return Math.max(0, (h1 + h2 + h3 + 3.2) * valleyMask);
        };

        function smoothstep(min, max, value) {
            const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
            return x * x * (3 - 2 * x);
        }

        const terrainGeo = new THREE.PlaneGeometry(54, 65, 56, 56);
        terrainGeo.rotateX(-Math.PI / 2);
        const posAttr = terrainGeo.attributes.position;

        for (let i = 0; i < posAttr.count; i++) {
            const vx = posAttr.getX(i);
            const vz = posAttr.getZ(i);
            const vy = computeRidgeHeight(vx, vz);
            posAttr.setY(i, vy);
        }
        terrainGeo.computeVertexNormals();

        const terrainMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(CONFIG.palette.deep),
            emissive: new THREE.Color(CONFIG.palette.night),
            roughness: 0.78,
            metalness: 0.25,
            flatShading: true
        });

        const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
        terrainMesh.position.set(0, -4.8, -126);
        this.landscapeGroup.add(terrainMesh);

        // Malla de líneas glaciares sobre las montañas
        const terrainWireMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(CONFIG.palette.steel),
            wireframe: true,
            transparent: true,
            opacity: 0.24
        });
        const terrainWire = new THREE.Mesh(terrainGeo, terrainWireMat);
        terrainWire.position.set(0, -4.77, -126);
        this.landscapeGroup.add(terrainWire);

        // Capas de Nubes Volumétricas con Shader FBM
        const fogPlaneGeo = new THREE.PlaneGeometry(34, 18);
        const fogDepths = [-108, -120, -134, -146];

        fogDepths.forEach((zPos, i) => {
            const fogMat = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.clone(VolumetricFogShader.uniforms),
                vertexShader: VolumetricFogShader.vertexShader,
                fragmentShader: VolumetricFogShader.fragmentShader,
                transparent: true,
                depthWrite: false
            });
            fogMat.uniforms.uOpacity.value = 0.34 + (i % 2) * 0.1;

            const fogMesh = new THREE.Mesh(fogPlaneGeo, fogMat);
            fogMesh.position.set((i % 2 === 0 ? -1 : 1) * 2.5, -1.2 + i * 0.45, zPos);
            this.landscapeGroup.add(fogMesh);
            this.fogPlanes.push(fogMat);
            this.disposables.push(fogMat);
        });

        this.scene.add(this.landscapeGroup);
        this.disposables.push(terrainGeo, terrainMat, terrainWireMat, fogPlaneGeo);
    }

    /**
     * ESCENA 4: Marco arquitectónico 3D detrás de las tarjetas de Proyectos
     */
    buildProjectsBackdrop() {
        this.projectsGroup = new THREE.Group();
        const frameGeo = new THREE.RingGeometry(6.5, 6.56, 6);
        const frameMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(CONFIG.palette.steel),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.28
        });

        [-168, -184, -200].forEach((zPos, idx) => {
            const frame = new THREE.Mesh(frameGeo, frameMat);
            frame.position.set(0, 0, zPos);
            frame.rotation.z = idx * 0.35;
            this.projectsGroup.add(frame);
        });

        this.scene.add(this.projectsGroup);
        this.disposables.push(frameGeo, frameMat);
    }

    /**
     * ESCENA 5: Proceso (Línea de tiempo 3D — Tubo de luz tenue que la cámara recorre)
     */
    buildProcessTimeline() {
        this.processGroup = new THREE.Group();

        const curvePoints = [
            new THREE.Vector3(0, -0.5, -214),
            new THREE.Vector3(-2.6, 0.8, -226),
            new THREE.Vector3(2.6, -0.6, -242),
            new THREE.Vector3(-2.4, 0.7, -258),
            new THREE.Vector3(2.2, -0.4, -274),
            new THREE.Vector3(0, 0, -288)
        ];

        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.08, 12, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(CONFIG.palette.glacier),
            transparent: true,
            opacity: 0.45
        });

        this.processTube = new THREE.Mesh(tubeGeo, tubeMat);
        this.processGroup.add(this.processTube);

        // Nodos luminosos para Idea -> Diseño -> Código -> Despliegue
        const nodeGeo = new THREE.SphereGeometry(0.42, 24, 24);
        const ringGeo = new THREE.RingGeometry(0.68, 0.76, 32);

        CONFIG.processSteps.forEach((step) => {
            const stepGroup = new THREE.Group();
            stepGroup.position.set(step.x, step.y, step.z);

            const nodeMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(CONFIG.palette.ice)
            });
            const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

            const ringMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(CONFIG.palette.accentTeal),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.55
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);

            stepGroup.add(nodeMesh, ringMesh);
            this.processGroup.add(stepGroup);

            this.processNodes.push({
                data: step,
                group: stepGroup,
                ring: ringMesh,
                nodeMat,
                ringMat
            });

            this.disposables.push(nodeMat, ringMat);
        });

        this.scene.add(this.processGroup);
        this.disposables.push(tubeGeo, tubeMat, nodeGeo, ringGeo);
    }

    /**
     * ESCENA 6: Contacto (Luz fría que se expande con Shader de Resplandor)
     */
    buildContactPortal() {
        const portalGeo = new THREE.PlaneGeometry(36, 36);
        this.portalMat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(ExpandingLightShader.uniforms),
            vertexShader: ExpandingLightShader.vertexShader,
            fragmentShader: ExpandingLightShader.fragmentShader,
            transparent: true,
            depthWrite: false
        });

        this.portalMesh = new THREE.Mesh(portalGeo, this.portalMat);
        this.portalMesh.position.set(0, 0, -329);
        this.scene.add(this.portalMesh);

        this.disposables.push(portalGeo, this.portalMat);
    }

    /**
     * Postprocesado: Bloom muy suave + Viñeta + Grano sutil + Aberración cromática en transiciones
     */
    setupPostProcessing() {
        if (this.isMobile || this.prefersReducedMotion) {
            this.composer = null;
            return;
        }

        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.34, // strength suave
            0.6,  // radius
            0.75  // threshold
        );
        this.composer.addPass(this.bloomPass);

        this.cinemaPass = new ShaderPass(CinemaPostShader);
        this.composer.addPass(this.cinemaPass);
    }

    /**
     * Actualiza el progreso global del scroll (0.0 a 1.0) y la velocidad de transición
     */
    setScrollState(progress, velocity = 0) {
        this.scrollProgress = Math.max(0, Math.min(1, progress));
        this.scrollVelocity = Math.min(4.0, Math.abs(velocity));

        const zStart = CONFIG.cameraWaypoints.hero.zStart;
        const zEnd = CONFIG.cameraWaypoints.contact.zEnd;
        this.cameraTargetZ = THREE.MathUtils.lerp(zStart, zEnd, this.scrollProgress);
    }

    setPaused(paused) {
        this.isPaused = Boolean(paused);
    }

    setThemePalette(isLightMode) {
        const bgColor = isLightMode ? '#DCE6EE' : CONFIG.palette.night;
        this.scene.background.set(bgColor);
        this.scene.fog.color.set(bgColor);
    }

    bindEvents() {
        this._onMouseMove = (event) => {
            this.mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        this._onResize = () => {
            this.isMobile = window.matchMedia('(max-width: 768px)').matches;
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            if (this.composer) {
                this.composer.setSize(width, height);
            }
        };

        window.addEventListener('mousemove', this._onMouseMove, { passive: true });
        window.addEventListener('resize', this._onResize, { passive: true });
    }

    /**
     * Render frame llamado desde el único requestAnimationFrame central en main.js
     */
    update() {
        const elapsed = this.clock.getElapsedTime();

        // Cálculo de FPS en tiempo real para el overlay de consola DEV
        this._frameCount++;
        const now = performance.now();
        if (now - this._lastFpsUpdate >= 500) {
            this.fps = Math.round((this._frameCount * 1000) / (now - this._lastFpsUpdate));
            this._frameCount = 0;
            this._lastFpsUpdate = now;
        }

        // Suavizado de mouse (parallax) y posición Z de cámara
        const lerpFactor = this.isPaused ? 0.25 : 0.075;
        this.mouse.x = THREE.MathUtils.lerp(this.mouse.x, this.mouse.targetX, 0.06);
        this.mouse.y = THREE.MathUtils.lerp(this.mouse.y, this.mouse.targetY, 0.06);
        this.cameraCurrentZ = THREE.MathUtils.lerp(this.cameraCurrentZ, this.cameraTargetZ, lerpFactor);

        // Movimiento de cámara con parallax sutil
        const parallaxX = this.isPaused ? 0 : this.mouse.x * 0.85;
        const parallaxY = this.isPaused ? 0 : this.mouse.y * 0.55;

        this.camera.position.set(parallaxX, parallaxY, this.cameraCurrentZ);
        this.camera.lookAt(parallaxX * 0.35, parallaxY * 0.35, this.cameraCurrentZ - 14);
        this.cameraLight.position.set(parallaxX * 2, parallaxY * 2 + 1, this.cameraCurrentZ - 4);

        if (!this.isPaused) {
            // 1. Animación del Cristal Hero
            if (this.heroGroup) {
                this.heroCoreMesh.rotation.x = elapsed * 0.28;
                this.heroCoreMesh.rotation.y = elapsed * 0.36;
                this.heroCrystalMesh.rotation.y = -elapsed * 0.16 + this.mouse.x * 0.4;
                this.heroCrystalMesh.rotation.x = elapsed * 0.1 + this.mouse.y * 0.3;
                this.heroEdges.rotation.copy(this.heroCrystalMesh.rotation);
                this.heroRing.rotation.z = elapsed * 0.22;
            }

            // 2. Proximidad e iluminación de Cristales de Skills
            let closestSkill = null;
            let minDistance = Infinity;

            this.skillNodes.forEach((node, index) => {
                const distZ = Math.abs(this.cameraCurrentZ - 6 - node.basePos.z);
                if (distZ < minDistance) {
                    minDistance = distZ;
                    closestSkill = node;
                }

                // Proximidad activa cuando la cámara pasa cerca del cristal
                const proximity = THREE.MathUtils.clamp(1 - distZ / 13, 0, 1);
                node.material.emissiveIntensity = THREE.MathUtils.lerp(0.18, 1.35, proximity);
                node.wireMaterial.opacity = THREE.MathUtils.lerp(0.25, 0.92, proximity);

                const targetScale = 1 + proximity * 0.22;
                node.group.scale.setScalar(THREE.MathUtils.lerp(node.group.scale.x, targetScale, 0.1));

                node.group.position.y = node.basePos.y + Math.sin(elapsed * 1.3 + index) * 0.18;
                node.shell.rotation.y = elapsed * 0.25 + index;
                node.shell.rotation.x = elapsed * 0.15;
                node.core.rotation.y = Math.sin(elapsed * 0.6 + index) * 0.22;
            });

            if (closestSkill && minDistance < 12) {
                if (this.activeSkillId !== closestSkill.data.id) {
                    this.activeSkillId = closestSkill.data.id;
                    this.onActiveSkillChange(closestSkill.data);
                }
            } else if (this.activeSkillId !== null) {
                this.activeSkillId = null;
                this.onActiveSkillChange(null);
            }

            // 3. Actualizar Shader FBM de Niebla Volumétrica
            this.fogPlanes.forEach((fogMat) => {
                fogMat.uniforms.uTime.value = elapsed;
            });

            // 4. Animar Nodos de la Línea de Tiempo 3D (Proceso)
            this.processNodes.forEach((pNode, idx) => {
                const dist = Math.abs(this.cameraCurrentZ - 7 - pNode.data.z);
                const prox = THREE.MathUtils.clamp(1 - dist / 10, 0, 1);
                const pulse = 1 + Math.sin(elapsed * 3 + idx) * 0.12 + prox * 0.45;
                pNode.ring.scale.setScalar(pulse);
            });

            // 5. Luz Fría en Expansión (Escena 6: Contacto)
            if (this.portalMat) {
                this.portalMat.uniforms.uTime.value = elapsed;
                const contactProgress = THREE.MathUtils.clamp((this.scrollProgress - 0.82) / 0.18, 0, 1);
                this.portalMat.uniforms.uExpansion.value = THREE.MathUtils.lerp(0.18, 1.0, contactProgress);
            }
        }

        // decaimiento suave de la velocidad de scroll para la aberración cromática
        this.scrollVelocity *= 0.9;

        if (this.composer && this.cinemaPass) {
            this.cinemaPass.uniforms.uTime.value = elapsed;
            this.cinemaPass.uniforms.uVelocity.value = this.isPaused ? 0 : this.scrollVelocity;
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    dispose() {
        window.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('resize', this._onResize);
        this.disposables.forEach((item) => {
            if (item && typeof item.dispose === 'function') {
                item.dispose();
            }
        });
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}
