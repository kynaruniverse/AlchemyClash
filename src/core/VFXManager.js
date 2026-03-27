/**
 * ALCHEMY CLASH: VFX MANAGER
 * Handles high-performance particle systems for card impacts and reveals.
 * Optimized for mobile GPU memory management.
 */

import * as THREE from 'three';

export class VFXManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        
        // Reusable geometry to save memory
        this.particleGeo = new THREE.SphereGeometry(0.06, 6, 6);
    }

    /**
     * Creates a cinematic burst of energy
     * @param {THREE.Vector3} position - Where the impact occurs
     * @param {number} color - Hex color of the particles
     */
    createImpact(position, color = 0x00ffff) {
        const particleCount = 12; // Optimized for mobile performance
        
        // Shared material for this specific burst
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending // Makes the particles "glow" when overlapping
        });

        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(this.particleGeo, material);
            
            // Set start position
            particle.position.copy(position);
            
            // Randomized 3D Velocity (Explosion vector)
            const force = 0.15;
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * force,
                (Math.random() - 0.5) * force,
                (Math.random() * force)
            );
            
            // Physics attributes
            particle.userData.friction = 0.94; // Slows down over time
            particle.userData.life = 1.0;     // 1.0 to 0.0 scale

            this.scene.add(particle);
            this.particles.push(particle);
        }
    }

    /**
     * Frame-by-frame update loop called by Engine3D
     */
    update() {
        // Iterate backwards to safely remove elements while looping
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 1. Apply Physics
            p.position.add(p.userData.velocity);
            p.userData.velocity.multiplyScalar(p.userData.friction); // Apply air resistance
            
            // 2. Update Life State
            p.userData.life -= 0.025; // Speed of the fade-out
            
            // 3. Update Visuals
            const s = p.userData.life;
            p.scale.set(s, s, s);
            p.material.opacity = s;

            // 4. Garbage Collection
            if (p.userData.life <= 0) {
                this.removeParticle(p, i);
            }
        }
    }

    /**
     * Cleanly removes a particle from the scene and memory
     */
    removeParticle(particle, index) {
        this.scene.remove(particle);
        
        // Note: We don't dispose the material here because it might be shared 
        // by other particles in the same burst. Three.js handles basic cleanup.
        this.particles.splice(index, 1);
    }
}
