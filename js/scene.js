/**
 * ============================================================================
 * SCENE.JS — Motor WebGL / Three.js con Paleta Vibrante, Gemas Poliédricas 3D
 * (No cuadradas) y Proyección 3D->2D en tiempo real para los Cuadritos Apuntadores.
 * ============================================================================
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CONFIG } from './config.js';

/**
 * Shader de Postprocesado Cinematográfico Luminoso
 */
const CinemaPostShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uVelocity: { value: 0 },
        uVignette: { value: 0.25 }
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

            float aberration = clamp(uVelocity * 0.007, 0.0, 0.008) * dist;
            vec2 offset = normalize(center + 0.0001) * aberration;

            float r = texture2D(tDiffuse, vUv + offset).r;
            float g = texture2D(tDiffuse, vUv).g;
            float b = texture2D(tDiffuse, vUv - offset).b;
            vec3 color = vec3(r, g, b);

            // Viñeta ligera que mantiene los colores brillantes y vivos
            float vig = smoothstep(0.95, 0.32, dist * (1.0 + uVignette));
            color *= mix(0.78, 1.04, vig);

            float grain = (hash(vUv * 1000.0 + fract(uTime)) - 0.5) * 0.016;
            color += grain;

            gl_FragColor = vec4(color, 1.0);
        }
    `
};

/**
 * Shader de Nubes Volumétricas tipo Aurora FBM (Colores cian, violeta y esmeralda vibrantes)
 */
const VolumetricFogShader = {
    uniforms: {
        uTime: { value: 0 },
        uColorDeep: { value: new THREE.Color('#1A2968') },
        uColorMist: { value: new THREE.Color('#00E5FF') },
        uColorAccent: { value: new THREE.Color('#A855F7') },
        uOpacity: { value: 0.52 }
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
        uniform vec3 uColorAccent;
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
            vec2 q = vec2(
                fbm(uv * 3.0 + vec2(uTime * 0.04, 0.0)),
                fbm(uv * 3.0 + vec2(0.0, uTime * 0.03))
            );

            float f = fbm(uv * 3.5 + q + vec2(uTime * 0.05, -uTime * 0.02));
            float radialMask = smoothstep(0.5, 0.1, length(vUv - 0.5));
            float alpha = smoothstep(0.18, 0.76, f) * radialMask * uOpacity;

            vec3 col = mix(uColorDeep, uColorAccent, clamp(q.x * 1.4, 0.0, 1.0));
            col = mix(col, uColorMist, clamp(f * 1.35, 0.0, 1.0));
            gl_FragColor = vec4(col, alpha);
        }
    `
};

/**
 * Shader de Portal Luminoso para Escena 6 (Contacto)
 */
const ExpandingLightShader = {
    uniforms: {
        uTime: { value: 0 },
        uExpansion: { value: 0.35 },
        uColorCore: { value: new THREE.Color('#00F5A0') },
        uColorHalo: { value: new THREE.Color('#00E5FF') },
        uColorViolet: { value: new THREE.Color('#A855F7') }
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
        uniform vec3 uColorViolet;
        varying vec2 vUv;

        void main() {
            vec2 p = vUv - 0.5;
            float d = length(p);
            float pulse = sin(uTime * 1.8) * 0.03;
            float radius = mix(0.16, 0.46, uExpansion) + pulse;

            float core = smoothstep(radius, 0.0, d);
            float ring = smoothstep(radius + 0.16, radius - 0.04, d) - smoothstep(radius, radius - 0.09, d);

            vec3 col = mix(uColorViolet, uColorHalo, pow(core, 1.2));
            col = mix(col, uColorCore, pow(core, 2.4));
            col += uColorCore * ring * 0.85;

            float alpha = clamp(core * 0.88 + ring * 0.5, 0.0, 0.94);
            gl_FragColor = vec4(col, alpha);
        }
    `
};

export class ExperienceScene {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.onProgress = options.onProgress || (() => {});
        this.onSkillScreenPositions = options.onSkillScreenPositions || (() => {});

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
        this.fps = 60;
        this._frameCount = 0;
        this._lastFpsUpdate = performance.now();
        this._projVec = new THREE.Vector3();

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
        this.onProgress(15, 'inicializando motor gráfico luminoso…');

        // Escena con fondo Azul Cósmico Vibrante (no negro)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.palette.night);
        this.scene.fog = new THREE.FogExp2(CONFIG.palette.night, 0.013);

        this.camera = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            0.1,
            190
        );
        this.camera.position.set(0, 0, this.cameraCurrentZ);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: !this.isMobile,
            powerPreference: 'high-performance',
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.32;

        this.onProgress(35, 'encendiendo iluminación multicolor…');
        this.setupLights();

        this.onProgress(52, 'forjando escultura hero y gemas orbitales…');
        this.buildHeroScene();
        this.buildInstancedParticles();

        this.onProgress(70, 'generando gemas poliédricas de skills…');
        this.buildSkillsCorridor();

        this.onProgress(85, 'renderizando aurora FBM y circuito 3D…');
        this.buildFogLandscape();
        this.buildProjectsBackdrop();
        this.buildProcessTimeline();
        this.buildContactPortal();

        this.setupPostProcessing();
        this.bindEvents();

        this.onProgress(100, 'experiencia 3D compilada · 60 FPS.');
    }

    setupLights() {
        const ambient = new THREE.AmbientLight('#A78BFA', 1.15);
        this.scene.add(ambient);

        const dirLight1 = new THREE.DirectionalLight('#00E5FF', 2.8);
        dirLight1.position.set(10, 16, 14);
        this.scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight('#FF4D79', 2.1);
        dirLight2.position.set(-12, -10, -18);
        this.scene.add(dirLight2);

        const dirLight3 = new THREE.DirectionalLight('#00F5A0', 1.8);
        dirLight3.position.set(0, 12, -90);
        this.scene.add(dirLight3);

        this.cameraLight = new THREE.PointLight('#00E5FF', 3.4, 45, 1.4);
        this.scene.add(this.cameraLight);
    }

    /**
     * ESCENA 1: Cristal Hero Multicolor Vibrante
     */
    buildHeroScene() {
        this.heroGroup = new THREE.Group();
        this.heroGroup.position.set(0, 0, 0);

        const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.34, 140, 28, 2, 3);
        const knotMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#00E5FF'),
            emissive: new THREE.Color('#6D28D9'),
            emissiveIntensity: 0.65,
            metalness: 0.72,
            roughness: 0.14,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        this.heroCoreMesh = new THREE.Mesh(knotGeo, knotMat);
        this.heroGroup.add(this.heroCoreMesh);

        const crystalGeo = new THREE.IcosahedronGeometry(2.4, 0);
        const crystalMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#A78BFA'),
            emissive: new THREE.Color('#00E5FF'),
            emissiveIntensity: 0.18,
            metalness: 0.12,
            roughness: 0.06,
            transmission: 0.84,
            thickness: 1.5,
            ior: 1.5,
            transparent: true,
            opacity: 0.9,
            clearcoat: 1.0,
            flatShading: true
        });
        this.heroCrystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
        this.heroGroup.add(this.heroCrystalMesh);

        const edgesGeo = new THREE.EdgesGeometry(crystalGeo);
        const edgesMat = new THREE.LineBasicMaterial({
            color: new THREE.Color('#00F5A0'),
            transparent: true,
            opacity: 0.68
        });
        this.heroEdges = new THREE.LineSegments(edgesGeo, edgesMat);
        this.heroEdges.scale.setScalar(1.04);
        this.heroGroup.add(this.heroEdges);

        const ringGeo = new THREE.TorusGeometry(3.25, 0.025, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#00E5FF'),
            transparent: true,
            opacity: 0.65
        });
        this.heroRing = new THREE.Mesh(ringGeo, ringMat);
        this.heroRing.rotation.x = Math.PI * 0.38;
        this.heroGroup.add(this.heroRing);

        this.scene.add(this.heroGroup);
        this.disposables.push(knotGeo, knotMat, crystalGeo, crystalMat, edgesGeo, edgesMat, ringGeo, ringMat);
    }

    /**
     * Partículas flotantes multicolores a lo largo del túnel Z
     */
    buildInstancedParticles() {
        const count = this.isMobile ? 480 : 1350;
        const particleGeo = new THREE.OctahedronGeometry(0.075, 0);
        const particleMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#ffffff'),
            transparent: true,
            opacity: 0.8
        });

        this.particlesMesh = new THREE.InstancedMesh(particleGeo, particleMat, count);
        const dummy = new THREE.Object3D();
        const paletteColors = [
            new THREE.Color('#00E5FF'),
            new THREE.Color('#00F5A0'),
            new THREE.Color('#A78BFA'),
            new THREE.Color('#FF6B8B'),
            new THREE.Color('#FBBF24')
        ];

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 44;
            const y = (Math.random() - 0.5) * 26;
            const z = 14 - Math.random() * 270;
            const scale = 0.45 + Math.random() * 1.4;

            dummy.position.set(x, y, z);
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            this.particlesMesh.setMatrixAt(i, dummy.matrix);
            this.particlesMesh.setColorAt(i, paletteColors[i % paletteColors.length]);
        }

        if (this.particlesMesh.instanceColor) {
            this.particlesMesh.instanceColor.needsUpdate = true;
        }

        this.scene.add(this.particlesMesh);
        this.disposables.push(particleGeo, particleMat);
    }

    /**
     * Crea un medallón circular luminoso con el icono SVG de la skill para el núcleo de la gema 3D
     */
    createSkillEmblemTexture(skill) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Halo radial circular del color de la skill
        const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 122);
        grad.addColorStop(0, skill.color);
        grad.addColorStop(0.55, 'rgba(21, 31, 66, 0.92)');
        grad.addColorStop(1, 'rgba(11, 16, 38, 0.0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(128, 128, 122, 0, Math.PI * 2);
        ctx.fill();

        // Anillo circular brillante
        ctx.strokeStyle = skill.color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(128, 128, 108, 0, Math.PI * 2);
        ctx.stroke();

        // Icono SVG centrado
        ctx.save();
        ctx.translate(68, 68);
        ctx.scale(5.0, 5.0);
        const path = new Path2D(skill.svgPath);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = skill.color;
        ctx.shadowBlur = 14;
        ctx.fill(path);
        ctx.restore();

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        this.disposables.push(texture);
        return texture;
    }

    /**
     * ESCENA 2: Gemas Poliédricas Orbitales (NO cuadradas) que se mueven dinámicamente en 3D
     */
    buildSkillsCorridor() {
        this.skillsGroup = new THREE.Group();

        // Geometrías poliédricas (icosaedros, octaedros y anillos orbitales, NADA cuadrado)
        const gemGeo = new THREE.IcosahedronGeometry(1.18, 0);
        const gemEdgesGeo = new THREE.EdgesGeometry(gemGeo);
        const outerCageGeo = new THREE.OctahedronGeometry(1.62, 0);
        const outerCageEdges = new THREE.EdgesGeometry(outerCageGeo);
        const orbitRingGeo = new THREE.TorusGeometry(1.85, 0.025, 16, 72);
        const discGeo = new THREE.CircleGeometry(0.82, 32);

        this.disposables.push(gemGeo, gemEdgesGeo, outerCageGeo, outerCageEdges, orbitRingGeo, discGeo);

        CONFIG.skills.forEach((skill, idx) => {
            const nodeGroup = new THREE.Group();
            nodeGroup.position.set(skill.pos.x, skill.pos.y, skill.pos.z);

            const skillColor = new THREE.Color(skill.color);

            // 1. Medallón central circular con el icono de la skill
            const emblemTex = this.createSkillEmblemTexture(skill);
            const emblemMat = new THREE.MeshBasicMaterial({
                map: emblemTex,
                transparent: true,
                side: THREE.DoubleSide
            });
            const emblemMesh = new THREE.Mesh(discGeo, emblemMat);
            nodeGroup.add(emblemMesh);

            // 2. Gema Icosaédrica translúcida con el color vibrante de la skill
            const gemMat = new THREE.MeshPhysicalMaterial({
                color: skillColor,
                emissive: skillColor,
                emissiveIntensity: 0.35,
                metalness: 0.2,
                roughness: 0.1,
                transmission: 0.72,
                transparent: true,
                opacity: 0.58,
                flatShading: true
            });
            const gemMesh = new THREE.Mesh(gemGeo, gemMat);
            nodeGroup.add(gemMesh);

            // 3. Aristas facetadas brillantes
            const wireMat = new THREE.LineBasicMaterial({
                color: skillColor,
                transparent: true,
                opacity: 0.85
            });
            const wireShell = new THREE.LineSegments(outerCageEdges, wireMat);
            nodeGroup.add(wireShell);

            // 4. Dos anillos giroscópicos orbitales alrededor de la gema
            const ringMat = new THREE.MeshBasicMaterial({
                color: skillColor,
                transparent: true,
                opacity: 0.65
            });
            const orbitRing1 = new THREE.Mesh(orbitRingGeo, ringMat);
            orbitRing1.rotation.x = Math.PI * 0.35;

            const orbitRing2 = new THREE.Mesh(orbitRingGeo, ringMat);
            orbitRing2.rotation.y = Math.PI * 0.35;
            orbitRing2.scale.setScalar(0.86);

            nodeGroup.add(orbitRing1, orbitRing2);

            this.skillsGroup.add(nodeGroup);
            this.disposables.push(emblemMat, gemMat, wireMat, ringMat);

            this.skillNodes.push({
                data: skill,
                index: idx,
                group: nodeGroup,
                gem: gemMesh,
                shell: wireShell,
                emblem: emblemMesh,
                ring1: orbitRing1,
                ring2: orbitRing2,
                material: gemMat,
                wireMaterial: wireMat,
                ringMaterial: ringMat,
                basePos: { ...skill.pos }
            });
        });

        this.scene.add(this.skillsGroup);
    }

    /**
     * ESCENA 3: Paisaje de Montañas Luminosas + Aurora Volumétrica FBM
     */
    buildFogLandscape() {
        this.landscapeGroup = new THREE.Group();

        function smoothstep(min, max, value) {
            const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
            return x * x * (3 - 2 * x);
        }

        const computeRidgeHeight = (x, z) => {
            const valleyMask = smoothstep(1.6, 11.0, Math.abs(x));
            const h1 = Math.sin(x * 0.35 + z * 0.18) * Math.cos(z * 0.22) * 3.5;
            const h2 = Math.sin(x * 0.85 - z * 0.45) * 1.4;
            return Math.max(0, (h1 + h2 + 3.0) * valleyMask);
        };

        const terrainGeo = new THREE.PlaneGeometry(52, 52, 48, 48);
        terrainGeo.rotateX(-Math.PI / 2);
        const posAttr = terrainGeo.attributes.position;

        for (let i = 0; i < posAttr.count; i++) {
            const vx = posAttr.getX(i);
            const vz = posAttr.getZ(i);
            posAttr.setY(i, computeRidgeHeight(vx, vz));
        }
        terrainGeo.computeVertexNormals();

        const terrainMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#192858'),
            emissive: new THREE.Color('#0E1738'),
            roughness: 0.65,
            metalness: 0.35,
            flatShading: true
        });

        const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
        terrainMesh.position.set(0, -4.6, -116);
        this.landscapeGroup.add(terrainMesh);

        const terrainWireMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#00E5FF'),
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });
        const terrainWire = new THREE.Mesh(terrainGeo, terrainWireMat);
        terrainWire.position.set(0, -4.57, -116);
        this.landscapeGroup.add(terrainWire);

        const fogPlaneGeo = new THREE.PlaneGeometry(34, 18);
        [-104, -114, -124, -132].forEach((zPos, i) => {
            const fogMat = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.clone(VolumetricFogShader.uniforms),
                vertexShader: VolumetricFogShader.vertexShader,
                fragmentShader: VolumetricFogShader.fragmentShader,
                transparent: true,
                depthWrite: false
            });
            fogMat.uniforms.uOpacity.value = 0.42 + (i % 2) * 0.1;

            const fogMesh = new THREE.Mesh(fogPlaneGeo, fogMat);
            fogMesh.position.set((i % 2 === 0 ? -1 : 1) * 2.2, -1.0 + i * 0.4, zPos);
            this.landscapeGroup.add(fogMesh);
            this.fogPlanes.push(fogMat);
            this.disposables.push(fogMat);
        });

        this.scene.add(this.landscapeGroup);
        this.disposables.push(terrainGeo, terrainMat, terrainWireMat, fogPlaneGeo);
    }

    /**
     * ESCENA 4: Portales hexagonales luminosos detrás de los Proyectos
     */
    buildProjectsBackdrop() {
        this.projectsGroup = new THREE.Group();
        const frameGeo = new THREE.RingGeometry(6.2, 6.28, 6);
        const colors = ['#FF4D79', '#00E5FF', '#00F5A0'];

        [-144, -156, -168].forEach((zPos, idx) => {
            const frameMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(colors[idx % colors.length]),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.42
            });
            const frame = new THREE.Mesh(frameGeo, frameMat);
            frame.position.set(0, 0, zPos);
            frame.rotation.z = idx * 0.4;
            this.projectsGroup.add(frame);
            this.disposables.push(frameMat);
        });

        this.scene.add(this.projectsGroup);
        this.disposables.push(frameGeo);
    }

    /**
     * ESCENA 5: Tubo de Energía 3D con Nodos Multicolores para el Proceso
     */
    buildProcessTimeline() {
        this.processGroup = new THREE.Group();

        const curvePoints = [
            new THREE.Vector3(0, -0.4, -174),
            new THREE.Vector3(-2.4, 0.7, -182),
            new THREE.Vector3(2.4, -0.5, -192),
            new THREE.Vector3(-2.2, 0.6, -202),
            new THREE.Vector3(2.0, -0.4, -212),
            new THREE.Vector3(0, 0, -222)
        ];

        const curve = new THREE.CatmullRomCurve3(curvePoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.09, 12, false);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#00E5FF'),
            transparent: true,
            opacity: 0.6
        });

        this.processTube = new THREE.Mesh(tubeGeo, tubeMat);
        this.processGroup.add(this.processTube);

        const nodeGeo = new THREE.OctahedronGeometry(0.48, 1);
        const ringGeo = new THREE.TorusGeometry(0.78, 0.03, 12, 48);

        CONFIG.processSteps.forEach((step) => {
            const stepGroup = new THREE.Group();
            stepGroup.position.set(step.x, step.y, step.z);

            const stepColor = new THREE.Color(step.color);

            const nodeMat = new THREE.MeshBasicMaterial({ color: stepColor });
            const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

            const ringMat = new THREE.MeshBasicMaterial({
                color: stepColor,
                transparent: true,
                opacity: 0.75
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);

            stepGroup.add(nodeMesh, ringMesh);
            this.processGroup.add(stepGroup);

            this.processNodes.push({
                data: step,
                group: stepGroup,
                ring: ringMesh
            });

            this.disposables.push(nodeMat, ringMat);
        });

        this.scene.add(this.processGroup);
        this.disposables.push(tubeGeo, tubeMat, nodeGeo, ringGeo);
    }

    /**
     * ESCENA 6: Portal de Luz Vibrante en Expansión
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
        this.portalMesh.position.set(0, 0, -252);
        this.scene.add(this.portalMesh);

        this.disposables.push(portalGeo, this.portalMat);
    }

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
            0.48,
            0.65,
            0.65
        );
        this.composer.addPass(this.bloomPass);

        this.cinemaPass = new ShaderPass(CinemaPostShader);
        this.composer.addPass(this.cinemaPass);
    }

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
        const bgColor = isLightMode ? '#EEF4FF' : CONFIG.palette.night;
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
     * Render frame: actualiza movimiento 3D y proyecta coordenadas 2D de cada Gema de Skill
     * para que el cuadrito apuntador en el DOM apunte exactamente a la gema en tiempo real.
     */
    update() {
        const elapsed = this.clock.getElapsedTime();

        this._frameCount++;
        const now = performance.now();
        if (now - this._lastFpsUpdate >= 500) {
            this.fps = Math.round((this._frameCount * 1000) / (now - this._lastFpsUpdate));
            this._frameCount = 0;
            this._lastFpsUpdate = now;
        }

        const lerpFactor = this.isPaused ? 0.25 : 0.08;
        this.mouse.x = THREE.MathUtils.lerp(this.mouse.x, this.mouse.targetX, 0.06);
        this.mouse.y = THREE.MathUtils.lerp(this.mouse.y, this.mouse.targetY, 0.06);
        this.cameraCurrentZ = THREE.MathUtils.lerp(this.cameraCurrentZ, this.cameraTargetZ, lerpFactor);

        const parallaxX = this.isPaused ? 0 : this.mouse.x * 0.85;
        const parallaxY = this.isPaused ? 0 : this.mouse.y * 0.55;

        this.camera.position.set(parallaxX, parallaxY, this.cameraCurrentZ);
        this.camera.lookAt(parallaxX * 0.35, parallaxY * 0.35, this.cameraCurrentZ - 14);
        this.camera.updateMatrixWorld();
        this.cameraLight.position.set(parallaxX * 2, parallaxY * 2 + 1, this.cameraCurrentZ - 4);

        const projectedSkills = [];
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Actualizar Gemas de Skills y calcular proyección 3D -> 2D para el cuadrito apuntador
        this.skillNodes.forEach((node, index) => {
            if (!this.isPaused) {
                // Movimiento orbital vivo en 3D (no estático)
                const orbitAngle = elapsed * 0.85 + index * 0.9;
                node.group.position.x = node.basePos.x + Math.cos(orbitAngle) * 0.42;
                node.group.position.y = node.basePos.y + Math.sin(orbitAngle * 1.2) * 0.36;

                node.gem.rotation.y = elapsed * 0.55 + index;
                node.gem.rotation.x = elapsed * 0.32;
                node.shell.rotation.y = -elapsed * 0.4 + index;
                node.shell.rotation.z = elapsed * 0.25;
                node.ring1.rotation.z = elapsed * 0.9 + index;
                node.ring2.rotation.x = -elapsed * 0.75 + index;
            }

            // Distancia en Z desde el punto focal frente a la cámara (camZ - 9)
            const focalZ = this.cameraCurrentZ - 9.5;
            const distZ = Math.abs(focalZ - node.group.position.z);
            const isAheadOfCamera = node.group.position.z < this.cameraCurrentZ - 1.8;
            const proximity = isAheadOfCamera ? THREE.MathUtils.clamp(1 - distZ / 10.5, 0, 1) : 0;

            node.material.emissiveIntensity = THREE.MathUtils.lerp(0.28, 1.45, proximity);
            const targetScale = 0.85 + proximity * 0.42;
            node.group.scale.setScalar(THREE.MathUtils.lerp(node.group.scale.x, targetScale, 0.12));

            // Proyectar centro de la gema 3D a píxeles de pantalla 2D
            node.group.getWorldPosition(this._projVec);
            this._projVec.project(this.camera);

            const screenX = (this._projVec.x * 0.5 + 0.5) * width;
            const screenY = (-(this._projVec.y * 0.5) + 0.5) * height;
            const inFrustum =
                isAheadOfCamera &&
                this._projVec.z < 1.0 &&
                screenX > -80 &&
                screenX < width + 80 &&
                screenY > -80 &&
                screenY < height + 80;

            projectedSkills.push({
                id: node.data.id,
                data: node.data,
                index,
                screenX,
                screenY,
                proximity,
                distZ,
                visible: inFrustum && proximity > 0.08
            });
        });

        this.onSkillScreenPositions(projectedSkills);

        if (!this.isPaused) {
            if (this.heroGroup) {
                this.heroCoreMesh.rotation.x = elapsed * 0.3;
                this.heroCoreMesh.rotation.y = elapsed * 0.38;
                this.heroCrystalMesh.rotation.y = -elapsed * 0.18 + this.mouse.x * 0.4;
                this.heroCrystalMesh.rotation.x = elapsed * 0.12 + this.mouse.y * 0.3;
                this.heroEdges.rotation.copy(this.heroCrystalMesh.rotation);
                this.heroRing.rotation.z = elapsed * 0.25;
            }

            this.fogPlanes.forEach((fogMat) => {
                fogMat.uniforms.uTime.value = elapsed;
            });

            this.processNodes.forEach((pNode, idx) => {
                pNode.group.rotation.y = elapsed * 0.6 + idx;
                pNode.ring.rotation.z = -elapsed * 0.8;
            });

            if (this.portalMat) {
                this.portalMat.uniforms.uTime.value = elapsed;
                const contactProgress = THREE.MathUtils.clamp((this.scrollProgress - 0.8) / 0.2, 0, 1);
                this.portalMat.uniforms.uExpansion.value = THREE.MathUtils.lerp(0.25, 1.0, contactProgress);
            }
        }

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
