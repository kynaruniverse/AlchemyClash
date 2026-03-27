/**
 * ALCHEMY CLASH: AAA 3D CORE ENGINE (UPGRADED)
 * Now includes:
 * - Card motion system (lerp-based)
 * - Depth & scaling system (Snap-style feel)
 * - Central animation loop
 * - Camera parallax motion
 */

import * as THREE from 'three';

export class Engine3D {
    constructor() {
        this.container = document.getElementById('game-container');
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance",
            precision: "highp"
        });
        
        this.vfx = null;
        this.pLight = null;

        // 🔥 NEW SYSTEMS
        this.cards = new Set(); // all active cards
        this.clock = new THREE.Clock();
        this.pointer = { x: 0, y: 0 };

        this.init();
    }

    init() {
        // Renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.Uncharted2ToneMapping;
        this.renderer.toneMappingExposure = 1.1; 
        
        this.container.appendChild(this.renderer.domElement);

        // Camera
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        // Lighting
        this.setupLighting();

        // Events
        window.addEventListener('resize', () => this.onWindowResize());

        // 🔥 Pointer tracking for camera motion
        window.addEventListener('pointermove', (e) => {
            this.pointer.x = (e.clientX / window.innerWidth - 0.5);
            this.pointer.y = (e.clientY / window.innerHeight - 0.5);
        });

        // Start loop
        this.animate();
    }

    setupLighting() {
        const hemiLight = new THREE.HemisphereLight(0x4444ff, 0x05050a, 0.8);
        this.scene.add(hemiLight);

        this.pLight = new THREE.PointLight(0x00ffff, 3, 30);
        this.pLight.position.set(5, 5, 5);
        this.scene.add(this.pLight);

        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        const rimLight = new THREE.DirectionalLight(0xff0055, 0.5);
        rimLight.position.set(-5, 5, -5);
        this.scene.add(rimLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * 🔥 Register cards so engine controls them
     */
    registerCard(card) {
        this.cards.add(card);

        card.x = 0;
        card.y = 0;
        card.z = 0;

        card.targetX = 0;
        card.targetY = 0;
        card.targetZ = 0;

        card.scale = 1;
        card.targetScale = 1;

        card.rot = 0;
        card.targetRot = 0;
    }

    /**
     * 🔥 LERP (smooth motion)
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * 🔥 Update ALL cards (Snap-style motion system)
     */
    updateCards(delta) {
        this.cards.forEach(card => {

            // Smooth position
            card.x = this.lerp(card.x, card.targetX, 0.15);
            card.y = this.lerp(card.y, card.targetY, 0.15);
            card.z = this.lerp(card.z, card.targetZ, 0.15);

            // Smooth scale & rotation
            card.scale = this.lerp(card.scale, card.targetScale, 0.15);
            card.rot = this.lerp(card.rot, card.targetRot, 0.15);

            // 🔥 STATE-BASED DEPTH
            if (card.state === "dragging") {
                card.targetZ = 5;
                card.targetScale = 1.15;
            } else if (card.state === "hover") {
                card.targetZ = 2;
                card.targetScale = 1.05;
            } else {
                card.targetZ = 0;
                card.targetScale = 1;
            }

            // Apply transforms
            if (card.mesh) {
                card.mesh.position.set(card.x, card.y, card.z);
                card.mesh.rotation.z = card.rot * 0.017; // deg → rad
                card.mesh.scale.set(card.scale, card.scale, card.scale);
            }
        });
    }

    /**
     * 🔥 Subtle camera motion (Snap feel)
     */
    updateCamera() {
        const targetY = -8.5 + this.pointer.y * 1.5;
        const targetX = this.pointer.x * 1.5;

        this.camera.position.x = this.lerp(this.camera.position.x, targetX, 0.05);
        this.camera.position.y = this.lerp(this.camera.position.y, targetY, 0.05);

        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Cinematic transition
     */
    transitionToBattle() {
        console.log("3D Engine: Executing Cinematic Fly-In...");

        gsap.to(this.camera.position, { 
            x: 0, 
            y: -8.5, 
            z: 14.5, 
            duration: 2.5, 
            ease: "expo.inOut" 
        });

        gsap.to(this.camera.rotation, { 
            x: 0.62, 
            duration: 2.5, 
            ease: "expo.inOut" 
        });

        if (this.pLight) {
            gsap.to(this.pLight.position, { 
                x: 0, 
                y: 2, 
                z: 8, 
                duration: 2,
                ease: "power2.out"
            });

            gsap.to(this.pLight, { 
                intensity: 4, 
                duration: 2 
            });
        }
    }

    setVFX(vfxManager) {
        this.vfx = vfxManager;
    }

    /**
     * 🔥 MAIN LOOP (NOW DRIVES EVERYTHING)
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // Core systems
        this.updateCards(delta);
        this.updateCamera();

        // VFX
        if (this.vfx && typeof this.vfx.update === 'function') {
            this.vfx.update(delta);
        }

        this.renderer.render(this.scene, this.camera);
    }
}