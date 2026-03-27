/**
 * ALCHEMY CLASH: AAA VFX MANAGER (UPGRADED)
 * High-performance Sprite-based particles, Impact FX, Legendary Trails, and Explosion Effects
 */

import * as THREE from 'three';

export class VFXManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.textureLoader = new THREE.TextureLoader();

        // AAA Glow Texture (Procedural radial gradient)
        this.glowTexture = this.createGlowTexture();

        // Material Pool to prevent GPU memory bloat
        this.materialPool = new Map();

        // Reusable Geometry (Plane is faster than Box for particles)
        this.particleGeo = new THREE.PlaneGeometry(0.3, 0.3);

        // Legendary Trail Pool
        this.legendaryTrails = [];
    }

    /**
     * Creates a soft radial glow texture programmatically
     */
    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }

    getMaterial(color) {
        if (!this.materialPool.has(color)) {
            this.materialPool.set(color, new THREE.MeshBasicMaterial({
                map: this.glowTexture,
                color: color,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            }));
        }
        return this.materialPool.get(color);
    }

    /**
     * Cinematic Impact (Card Reveal / Lane Hit)
     */
    createImpact(position, color = 0x00ffff, count = 15) {
        const material = this.getMaterial(color);

        for (let i = 0; i < count; i++) {
            const particle = new THREE.Mesh(this.particleGeo, material);
            particle.position.copy(position);

            // Random spherical spread
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const force = 0.1 + Math.random() * 0.15;

            particle.userData.velocity = new THREE.Vector3(
                Math.sin(theta) * Math.cos(phi) * force,
                Math.sin(theta) * Math.sin(phi) * force,
                Math.cos(theta) * force
            );

            particle.userData.life = 1.0;
            particle.userData.decay = 0.02 + Math.random() * 0.02;

            this.scene.add(particle);
            this.particles.push(particle);
        }
    }

    /**
     * Legendary Trail for flying cards
     */
    attachLegendaryTrail(cardMesh, color = 0xffdd00) {
        const trailMat = this.getMaterial(color);
        const trail = new THREE.Mesh(this.particleGeo, trailMat);

        trail.userData.follow = cardMesh;
        trail.userData.life = 1.0;
        trail.userData.decay = 0.02 + Math.random() * 0.01;

        this.scene.add(trail);
        this.legendaryTrails.push(trail);
    }

    /**
     * Large Victory/Defeat Explosion
     */
    createExplosion(position, color = 0xffffff) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.createImpact(position, color, 30), i * 150);
        }
    }

    /**
     * Per-frame update (Called by Engine3D)
     */
    update() {
        // Update normal particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Physics
            p.position.add(p.userData.velocity);
            p.userData.velocity.y -= 0.002; // Gravity
            p.userData.velocity.multiplyScalar(0.96); // Air friction

            // Scale fade
            p.userData.life -= p.userData.decay;
            p.scale.setScalar(p.userData.life);

            if (p.userData.life <= 0) {
                this.scene.remove(p);
                this.particles.splice(i, 1);
            }
        }

        // Update legendary trails
        for (let i = this.legendaryTrails.length - 1; i >= 0; i--) {
            const t = this.legendaryTrails[i];
            const target = t.userData.follow;
            if (!target) continue;

            // Trail follows card mesh with a small lag
            t.position.lerp(target.position, 0.25);

            // Fade out over time
            t.userData.life -= t.userData.decay;
            t.scale.setScalar(t.userData.life);

            if (t.userData.life <= 0) {
                this.scene.remove(t);
                this.legendaryTrails.splice(i, 1);
            }
        }
    }
}