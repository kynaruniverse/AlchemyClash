import Card from '../entities/Card.js';
import { FUSION_NAMES } from '../data/fusions.js';
import ParticleSystem from '../systems/ParticleSystem.js';

export default class FusionManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = new ParticleSystem(scene);
    }

    performFusion(cardA, cardB) {
        if (!cardA || !cardB || !cardA.active || !cardB.active) return;

        cardA.disableInteractive();
        cardB.disableInteractive();

        this.scene.cameras.main.shake(140, 0.009);

        // Animash swirling merge
        this.scene.tweens.add({
            targets: cardA,
            x: cardB.x,
            y: cardB.y,
            scale: 0.6,
            angle: 720,
            alpha: 0,
            duration: 420,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                const prefix = FUSION_NAMES.prefixes[cardA.cardData.id] || FUSION_NAMES.prefixes['hybrid'];
                const suffix = FUSION_NAMES.suffixes[cardB.cardData.id] || FUSION_NAMES.suffixes['hybrid'];
                const newName = `${prefix} ${suffix}`;

                let bonusAtk = (cardA.cardData.traits?.includes('aggressive')) ? 5 : 0;
                let bonusHp = (cardB.cardData.traits?.includes('beast')) ? 10 : 0;

                const newStats = {
                    id: 'hybrid',
                    name: newName,
                    atk: cardA.cardData.atk + cardB.cardData.atk + bonusAtk,
                    hp: cardA.cardData.hp + cardB.cardData.hp + bonusHp,
                    color: 0xffffff
                };

                cardA.kill();
                cardB.kill();

                const newCard = new Card(this.scene, cardB.x, cardB.y, newStats, true);
                this.scene.eventBus.emit('fusion-complete', { newCard, name: newName });
                this.unlockDiscovery(newName);

                // Big Animash explosion
                this.particles.burst(newCard.x, newCard.y, 0xffeecc, 45);
                this.scene.cameras.main.shake(80, 0.006);
            }
        });
    }

    unlockDiscovery(name) {
        const key = name.toLowerCase().replace(/\s/g, '_');
        if (!this.scene.discoveredEntries.includes(key)) {
            this.scene.discoveredEntries.push(key);
            if (this.scene.saveSystem) this.scene.saveSystem.save();
            this.scene.uiManager.createToast(`✨ New Fusion: ${name}`);
        }
    }
}