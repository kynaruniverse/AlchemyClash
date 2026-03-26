/**
 * FUSIONGOD - Simple Particle System (Phase 4)
 */
export default class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
    }

    burst(x, y, color = 0xffd700, count = 25) {
        const particles = this.scene.add.particles(x, y, 'particle-flare', {
            speed: { min: 80, max: 180 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
            lifespan: 600,
            quantity: count,
            tint: color
        });

        this.scene.time.delayedCall(800, () => particles.destroy());
    }
}