import Card from '../entities/Card.js';
import { FUSION_NAMES } from '../data/fusions.js';

export default class FusionManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = new (await import('../systems/ParticleSystem.js')).default(scene);
    }

    performFusion(cardA, cardB) {
        if (!cardA || !cardB || !cardA.active || !cardB.active) {
            console.warn("Fusion aborted - invalid cards");
            return;
        }

        cardA.disableInteractive();
        cardB.disableInteractive();

        this.scene.cameras.main.shake(120, 0.008);
        this.particles.burst(cardB.x, cardB.y, 0xffaa00, 35);

        this.scene.tweens.add({
            targets: cardA,
            x: cardB.x, y: cardB.y,
            scale: 0.2, alpha: 0.5,
            duration: 250,
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
                this.particles.burst(newCard.x, newCard.y, 0xffffff, 20);

                // Auto-save after fusion
                if (this.scene.saveSystem) this.scene.saveSystem.save();
            }
        });
    }

    unlockDiscovery(name) {
        const key = name.toLowerCase().replace(/\s/g, '_');
        if (!this.scene.discoveredEntries.includes(key)) {
            this.scene.discoveredEntries.push(key);
            if (this.scene.saveSystem) this.scene.saveSystem.save();
            this.scene.uiManager.createToast(`New Fusion Unlocked: ${name}`);
        }
    }
}