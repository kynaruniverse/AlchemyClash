/**
 * FUSIONGOD - FusionManager Class (Phase 2)
 * All fusion + discovery logic moved here
 */
export default class FusionManager {
    constructor(scene) {
        this.scene = scene;
    }

    performFusion(cardA, cardB) {
        cardA.disableInteractive();
        cardB.disableInteractive();

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
            }
        });
    }

    unlockDiscovery(name) {
        const key = name.toLowerCase().replace(/\s/g, '_');
        if (!this.scene.discoveredEntries.includes(key)) {
            this.scene.discoveredEntries.push(key);
            localStorage.setItem('fusion_discovery', JSON.stringify(this.scene.discoveredEntries));
            this.scene.uiManager.createToast(`New Fusion Unlocked: ${name}`);
        }
    }
}