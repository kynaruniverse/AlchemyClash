/**
 * ALCHEMY CLASH: 3D CORE ENGINE
 * Manages the Scene, Camera, High-Fidelity Rendering, and Cinematic Transitions.
 */

import * as THREE from 'three';

export class Engine3D {
    constructor() {
        this.container = document.getElementById('game-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // High-Performance WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance" 
        });
        
        this.vfx = null;
        this.init();
    }

    init() {
        // 1. Renderer Setup (AAA Quality Settings)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Save battery on high-res screens
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 1.25; // Brightens the scene without washing out colors
        this.container.appendChild(this.renderer.domElement);

        // 2. Camera Setup (Initial Menu View)
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);

        // 3. Cinematic Lighting System
        // Hemisphere light provides a natural "skylight" glow
        const hemiLight = new THREE.HemisphereLight(0x4444ff, 0x000000, 0.6);
        this.scene.add(hemiLight);

        // Point light for the Hero Card in the Menu
        this.pLight = new THREE.PointLight(0x00ffff, 2, 25);
        this.pLight.position.set(2, 2, 5);
        this.scene.add(this.pLight);

        // Ambient fill to ensure cards are never pitch black
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));

        // 4. Handle Device Rotation / Resizing
        window.addEventListener('resize', () => this.onWindowResize());

        this.animate();
    }

    /**
     * Prevents game distortion on mobile orientation change
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * AAA Transition: Fly the camera from Menu to Tactical Battle View
     */
    transitionToBattle() {
        // A. Camera Movement (Position and Tilt)
        gsap.to(this.camera.position, { 
            x: 0, y: -9, z: 14, 
            duration: 2.2, 
            ease: "expo.inOut" 
        });

        gsap.to(this.camera.rotation, { 
            x: 0.65, 
            duration: 2.2, 
            ease: "expo.inOut" 
        });

        // B. HUD Transition (Fade out Menu, Fade in Battle HUD)
        const menu = document.getElementById('menu-layer');
        const hud = document.getElementById('ui-layer');

        gsap.to(menu, { 
            opacity: 0, 
            duration: 1, 
            onComplete: () => {
                menu.style.display = 'none';
                hud.style.display = 'block';
                gsap.to(hud, { opacity: 1, duration: 1 });
            }
        });

        // C. Dynamic Lighting Shift (Move light to illuminate the board)
        gsap.to(this.pLight.position, { x: 0, y: 5, z: 10, duration: 2 });
    }

    /**
     * Set the VFX manager to update frame-by-frame
     */
    setVFX(vfxManager) {
        this.vfx = vfxManager;
    }

    /**
     * The Render Loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.vfx) {
            this.vfx.update();
        }

        this.renderer.render(this.scene, this.camera);
    }
}
