/**
 * ALCHEMY CLASH: AAA ABILITY MANAGER - UPGRADED
 * Card effects, lane manipulation, cinematic power shifts, and extensible abilities.
 */

export class AbilityManager {
    constructor(duel, maxLanePower = 99) {
        this.duel = duel;
        this.maxLanePower = maxLanePower; // Optional clamp
    }

    /**
     * Triggers a card's unique ability after reveal.
     */
    trigger(card) {
        const ability = card.userData.data.ability;
        if (!ability) return;

        console.log(`AbilityManager: Activating ${ability.type} for ${card.userData.data.name}`);

        // Extensible switch
        const abilityFn = this.abilityMap()[ability.type];
        if (abilityFn) abilityFn.call(this, card, ability.value);
        else console.warn(`AbilityManager: Unknown ability type ${ability.type}`);
    }

    /**
     * Ability mapping for easy expansion
     */
    abilityMap() {
        return {
            'BOOST_LANE': this.boostLane,
            'BURN_ENEMY': this.burnEnemy,
            'SURGE': this.surge,
            'SPY': this.spy
        };
    }

    /**
     * Effect: Flat power boost to card's side of lane
     */
    boostLane(card, value) {
        const lane = card.userData.targetLane;
        const color = 0xffff00; // Gold

        if (card.userData.owner === 'PLAYER') lane.userData.pPower = Math.min(this.maxLanePower, lane.userData.pPower + value);
        else lane.userData.ePower = Math.min(this.maxLanePower, lane.userData.ePower + value);

        if (this.duel.vfx) this.duel.vfx.createImpact(card.position, color);
        gsap.to(lane.scale, { x: 1.05, y: 1.05, duration: 0.15, yoyo: true, repeat: 1 });

        this.syncGame();
        if (this.duel.audio) this.duel.audio.play('BOOST', 0.4);
    }

    /**
     * Effect: Reduces the opponent's lane power
     */
    burnEnemy(card, value) {
        const lane = card.userData.targetLane;
        const color = 0xff4400; // Fire Orange

        if (card.userData.owner === 'PLAYER') {
            lane.userData.ePower = Math.max(0, lane.userData.ePower - value);
        } else {
            lane.userData.pPower = Math.max(0, lane.userData.pPower - value);
        }

        if (this.duel.vfx) this.duel.vfx.createImpact(lane.position, color);
        this.syncGame();
        if (this.duel.audio) this.duel.audio.play('BURN', 0.4);
    }

    /**
     * Effect: Conditional Power Surge if currently winning
     */
    surge(card, value) {
        const lane = card.userData.targetLane;
        const color = 0x00ff88; // Emerald

        const isWinning = card.userData.owner === 'PLAYER' ? 
            lane.userData.pPower > lane.userData.ePower : 
            lane.userData.ePower > lane.userData.pPower;

        if (!isWinning) return;

        if (card.userData.owner === 'PLAYER') lane.userData.pPower = Math.min(this.maxLanePower, lane.userData.pPower + value);
        else lane.userData.ePower = Math.min(this.maxLanePower, lane.userData.ePower + value);

        if (this.duel.vfx) this.duel.vfx.createImpact(card.position, color);
        if (this.duel.audio) this.duel.audio.play('SURGE', 0.5);

        this.syncGame();
    }

    /**
     * Effect: "Defector" – card moves to enemy side
     */
    spy(card) {
        const lane = card.userData.targetLane;
        const power = card.userData.data.atk;
        const isPlayerOwned = card.userData.owner === 'PLAYER';

        // Remove from current side
        if (isPlayerOwned) {
            lane.userData.pPower -= power;
            lane.userData.pCards--;
            card.userData.owner = 'ENEMY';
            lane.userData.eCards++;
        } else {
            lane.userData.ePower -= power;
            lane.userData.eCards--;
            card.userData.owner = 'PLAYER';
            lane.userData.pCards++;
        }

        // AAA Slide Animation
        const targetY = card.userData.owner === 'ENEMY' ? 
            1.2 - (lane.userData.eCards * 0.4) : 
            -1.2 + (lane.userData.pCards * 0.4);

        gsap.to(card.position, {
            y: lane.position.y + targetY,
            duration: 1.2,
            ease: "slow(0.7, 0.7, false)",
            rotation: card.userData.owner === 'PLAYER' ? 0 : Math.PI,
            scale: 1.05,
            onStart: () => { if (this.duel.audio) this.duel.audio.play('SLIDE', 0.4); },
            onComplete: () => {
                if (card.userData.owner === 'PLAYER') lane.userData.pPower += power;
                else lane.userData.ePower += power;

                if (this.duel.vfx) this.duel.vfx.createImpact(card.position, 0xaa00ff);
                this.syncGame();
            }
        });
    }

    /**
     * Updates lane visuals & UI
     */
    syncGame() {
        this.duel.updateLaneVisuals();
        if (this.duel.ui) this.duel.ui.updateUI();
    }
}