/**
 * ALCHEMY CLASH: AAA ENVIRONMENT & ARENA
 * Manages the 3D Backdrop, Cyber-Grid, and Animated Nebula.
 */

import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.stars = null;
        this.grid = null;
        this.init();
    }

    init() {
        // 1. Fog: Deep Space Atmosphere
        // Prevents the "infinite edge" look on high-res displays
        this.scene.fog = new THREE.FogExp2(0x05050a, 0.04);

        // 2. The Cyber-Grid Floor (Tactical Overlay)
        this.setupGrid();

        // 3. Cinematic Twinkling Starfield
        this.createStarfield();

        // 4. Arena Glow (Ambient Backdrop)
        const glowGeo = new THREE.SphereGeometry(100, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x020205,
            side: THREE.BackSide, // Inside out sphere
            transparent: true,
            opacity: 0.9
        });
        const dome = new THREE.Mesh(glowGeo, glowMat);
        this.scene.add(dome);
        
        // Start Global Animation
        this.animate();
    }

    setupGrid() {
        const size = 60;
        const divisions = 30;
        const color = 0x00ffff;
        
        this.grid = new THREE.GridHelper(size, divisions, color, 0x112233);
        this.grid.rotation.x = Math.PI / 2; 
        this.grid.position.z = -1.0; 
        
        this.grid.material.transparent = true;
        this.grid.material.opacity = 0.1;
        this.scene.add(this.grid);

        // Pulse the grid opacity for a "living" machine feel
        gsap.to(this.grid.material, {
            opacity: 0.25,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    createStarfield() {
        const starGeo = new THREE.BufferGeometry();
        const starCount = 3000;
        const posArray = new Float32Array(starCount * 3);
        const sizeArray = new Float32Array(starCount); // For individual twinkling

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            // Spread stars in a sphere but keep them mostly behind the board
            posArray[i3] = (Math.random() - 0.5) * 200;
            posArray[i3 + 1] = (Math.random() - 0.5) * 200;
            posArray[i3 + 2] = -50 - (Math.random() * 100);
            
            sizeArray[i] = Math.random();
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        starGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

        const starMat = new THREE.PointsMaterial({
            size: 0.15,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(starGeo, starMat);
        this.scene.add(this.stars);
    }

    animate() {
        const time = Date.now() * 0.001;

        if (this.stars) {
            // Subtle orbital drift
            this.stars.rotation.z += 0.0001;
            this.stars.rotation.y += 0.00005;

            // Twinkle effect (Scale manipulation)
            this.stars.material.size = 0.15 + Math.sin(time * 2) * 0.05;
        }

        requestAnimationFrame(() => this.animate());
    }
}
