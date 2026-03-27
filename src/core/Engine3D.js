/**
 * ALCHEMY CLASH: AAA 3D CORE ENGINE
 * Manages the Scene, Camera, High-Fidelity Rendering, and Cinematic Transitions.
 */

import * as THREE from 'three';

export class Engine3D {
    constructor() {
        this.container = document.getElementById('game-container');
        this.scene = new THREE.Scene();
        
        // FOV 45 is ideal for card games to avoid edge distortion
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // High-Performance WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance",
            precision: "highp"
        });
        
        this.vfx = null;
        this.pLight = null;
        
        this.init();
    }

    init() {
        // 1. Renderer Setup (Modern Three.js Standards)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        
        // Modern Color Management
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.Uncharted2ToneMapping;
        this.renderer.toneMappingExposure = 1.1; 
        
        this.container.appendChild(this.renderer.domElement);

        // 2. Camera Setup (Initial cinematic angle)
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        // 3. Cinematic Lighting System
        this.setupLighting();

        // 4. Global Event Listeners
        window.addEventListener('resize', () => this.onWindowResize());

        // 5. Start Render Loop
        this.animate();
    }

    setupLighting() {
        // Natural atmosphere glow
        const hemiLight = new THREE.HemisphereLight(0x4444ff, 0x05050a, 0.8);
        this.scene.add(hemiLight);

        // Point light for high-specular "Hero" highlights on cards
        this.pLight = new THREE.PointLight(0x00ffff, 3, 30);
        this.pLight.position.set(5, 5, 5);
        this.scene.add(this.pLight);

        // Global ambient so shadows aren't pitch black
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        // Optional: Add a rim light for that "Marvel Snap" card pop
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
     * AAA Cinematic: Fly the camera from "Collection View" to "Battlefield View"
     */
    transitionToBattle() {
        console.log("3D Engine: Executing Cinematic Fly-In...");

        // Fly to a tactical slanted top-down view
        gsap.to(this.camera.position, { 
            x: 0, 
            y: -8.5, 
            z: 14.5, 
            duration: 2.5, 
            ease: "expo.inOut" 
        });

        // Tilt the camera to look at the board
        gsap.to(this.camera.rotation, { 
            x: 0.62, 
            duration: 2.5, 
            ease: "expo.inOut" 
        });

        // Shift lighting to focus on the 3 lanes
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

    /**
     * Links the VFX manager for per-frame updates
     */
    setVFX(vfxManager) {
        this.vfx = vfxManager;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update particles/animations
        if (this.vfx && typeof this.vfx.update === 'function') {
            this.vfx.update();
        }

        this.renderer.render(this.scene, this.camera);
    }
}
