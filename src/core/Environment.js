/**
 * ALCHEMY CLASH: AAA ENVIRONMENT & ARENA (UPGRADED)
 * 3D Backdrop with Cyber-Grid, Animated Nebula, and Reactive Lane Feedback
 */

import * as THREE from 'three';
import gsap from 'gsap';

export class Environment {
    constructor(scene, duelMgr) {
        this.scene = scene;
        this.duelMgr = duelMgr; // Optional: to track lane power changes

        this.stars = null;
        this.grid = null;
        this.gridColor = new THREE.Color(0x00ffff);
        this.gridPulseTimeline = null;

        this.lanePulseMap = new Map(); // Map laneIndex -> pulse tween

        this.init();
    }

    init() {
        // 1. Fog: Deep Space Atmosphere
        this.scene.fog = new THREE.FogExp2(0x05050a, 0.04);

        // 2. Cyber-Grid Floor
        this.setupGrid();

        // 3. Cinematic Starfield
        this.createStarfield();

        // 4. Arena Dome Glow
        this.createDome();

        // 5. Start Global Animation
        this.animate();
    }

    setupGrid() {
        const size = 60;
        const divisions = 30;

        this.grid = new THREE.GridHelper(size, divisions, 0x00ffff, 0x112233);
        this.grid.rotation.x = Math.PI / 2;
        this.grid.position.z = -1.0;

        this.grid.material.transparent = true;
        this.grid.material.opacity = 0.1;

        this.scene.add(this.grid);

        // Pulse the grid opacity for a "living" machine feel
        this.gridPulseTimeline = gsap.to(this.grid.material, {
            opacity: 0.25,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    createDome() {
        const glowGeo = new THREE.SphereGeometry(100, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x020205,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.9
        });
        const dome = new THREE.Mesh(glowGeo, glowMat);
        this.scene.add(dome);
    }

    createStarfield() {
        const starGeo = new THREE.BufferGeometry();
        const starCount = 3000;
        const posArray = new Float32Array(starCount * 3);
        const sizeArray = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
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

    /**
     * Trigger a pulse on a specific lane for visual feedback
     * color: hex color (0x00ffff = player, 0xff0055 = enemy)
     */
    pulseLane(laneIndex, color = 0xffffff) {
        const lane = this.duelMgr?.lanes[laneIndex];
        if (!lane) return;

        // Cancel previous pulse if exists
        if (this.lanePulseMap.has(laneIndex)) {
            this.lanePulseMap.get(laneIndex).kill();
        }

        // Animate emissive glow
        const mat = lane.material;
        const targetColor = new THREE.Color(color);

        const pulse = gsap.to(mat.emissive, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut"
        });

        this.lanePulseMap.set(laneIndex, pulse);
    }

    /**
     * Update called every frame
     * - Starfield rotation & twinkle
     * - Optional: reactive lane glow
     */
    animate() {
        const time = Date.now() * 0.001;

        if (this.stars) {
            // Subtle orbital drift
            this.stars.rotation.z += 0.0001;
            this.stars.rotation.y += 0.00005;

            // Twinkle effect
            this.stars.material.size = 0.15 + Math.sin(time * 2) * 0.05;
        }

        // Optional: react to lane power changes
        if (this.duelMgr?.lanes) {
            this.duelMgr.lanes.forEach((lane, i) => {
                const p = lane.userData.pPower;
                const e = lane.userData.ePower;

                // Pulse lane if power changes significantly
                if (p > e && p > 0) this.pulseLane(i, 0x00ffff);
                if (e > p && e > 0) this.pulseLane(i, 0xff0055);
            });
        }

        requestAnimationFrame(() => this.animate());
    }
}