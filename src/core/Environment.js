/**
 * ALCHEMY CLASH: ENVIRONMENT MANAGER
 * Handles the 3D Arena, Animated Starfield, and Cyber-Grid Floor.
 */

import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.stars = null;
        this.init();
    }

    init() {
        // 1. Scene Atmosphere: Deep Void Fog
        // This creates the AAA "fading into darkness" look for the grid
        this.scene.fog = new THREE.FogExp2(0x05050a, 0.05);

        // 2. The Cyber-Grid Floor
        const size = 40; // Increased size for camera fly-in coverage
        const divisions = 40;
        const gridColor = 0x00ffff;
        const centerColor = 0x112244;
        
        const grid = new THREE.GridHelper(size, divisions, gridColor, centerColor);
        grid.rotation.x = Math.PI / 2; 
        grid.position.z = -0.8; // Set safely behind cards (z=0) and lanes (z=0.1)
        
        // Enhance grid visibility with slight transparency
        grid.material.transparent = true;
        grid.material.opacity = 0.15;
        this.scene.add(grid);

        // 3. Cinematic Animated Star-field
        this.createStarfield();

        // 4. Soft Arena Glow (Backdrop)
        const glowGeo = new THREE.PlaneGeometry(100, 100);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x020205, // Ultra dark blue-black
            side: THREE.DoubleSide,
            depthWrite: false // Prevents the backdrop from blocking transparency
        });
        const background = new THREE.Mesh(glowGeo, glowMat);
        background.position.z = -2; // The absolute furthest layer
        this.scene.add(background);
    }

    /**
     * Creates a randomized 3D particle field for the background
     */
    createStarfield() {
        const starGeo = new THREE.BufferGeometry();
        const starCount = 2000; // Denser field for high-res mobile screens
        const posArray = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i++) {
            // Distribute stars in a large sphere around the center
            posArray[i] = (Math.random() - 0.5) * 150;
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const starMat = new THREE.PointsMaterial({
            size: 0.08,
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true // Stars further away appear smaller
        });

        this.stars = new THREE.Points(starGeo, starMat);
        this.stars.position.z = -5; // Behind everything
        this.scene.add(this.stars);

        // Start the subtle rotation loop
        this.animateStars();
    }

    /**
     * Subtle animation to make the background feel "alive"
     */
    animateStars() {
        const update = () => {
            if (this.stars) {
                this.stars.rotation.z += 0.0002; // Very slow crawl
                this.stars.rotation.y += 0.0001;
            }
            requestAnimationFrame(update);
        };
        update();
    }
}
