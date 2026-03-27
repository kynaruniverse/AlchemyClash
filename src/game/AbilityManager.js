/**
 * ALCHEMY CLASH: AAA ABILITY MANAGER
 * Orchestrates card effects, lane manipulation, and cinematic power shifts.
 */

export class AbilityManager {
    constructor(duel) {
        this.duel = duel;
    }

    /**
     * Triggers a card's unique ability.
     * Called by DuelManager immediately after the card reveal animation.
     */
    trigger(card) {
        const ability = card.userData.data.ability;
        if (!ability) return;

        console.log(`AbilityManager: Activating ${ability.type} for ${card.userData.data.name}`);

        switch (ability.type) {
            case 'BOOST_LANE':
                this.boostLane(card, ability.value);
                break;
            case 'BURN_ENEMY':
                this.burnEnemy(card, ability.value);
                break;
            case 'SURGE':
                this.surge(card, ability.value);
                break;
            case 'SPY':
                this.spy(card);
                break;
            default:
                console.warn(`AbilityManager: Unknown ability type ${ability.type}`);
        }
    }

    /**
     * Effect: Flat power boost to the current side of the lane.
     */
    boostLane(card, value) {
        const lane = card.userData.targetLane;
        const color = 0xffff00; // Gold/Yellow

        if (card.userData.owner === 'PLAYER') lane.userData.pPower += value;
        else lane.userData.ePower += value;
        
        // AAA: Lane Pulse
        if (this.duel.vfx) this.duel.vfx.createImpact(card.position, color);
        gsap.to(lane.scale, { x: 1.05, y: 1.05, duration: 0.15, yoyo: true, repeat: 1 });
        
        this.syncGame();
    }

    /**
     * Effect: Reduces the opponent's power in this lane (Debuff).
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
    }

    /**
     * Effect: Conditional Power - Only triggers if you are already winning.
     */
    surge(card, value) {
        const lane = card.userData.targetLane;
        const color = 0x00ff88; // Emerald Green
        
        // Check win state *before* adding surge power
        const isWinning = card.userData.owner === 'PLAYER' ? 
            (lane.userData.pPower > lane.userData.ePower) : 
            (lane.userData.ePower > lane.userData.pPower);

        if (isWinning) {
            if (card.userData.owner === 'PLAYER') lane.userData.pPower += value;
            else lane.userData.ePower += value;
            
            if (this.duel.vfx) this.duel.vfx.createImpact(card.position, color);
            if (this.duel.audio) this.duel.audio.play('SURGE', 0.5);
            
            this.syncGame();
        }
    }
    
    /**
     * Effect: The "Defector" - Card moves to the other side of the lane.
     */
    spy(card) {
        const lane = card.userData.targetLane;
        const power = card.userData.data.atk;
        const isPlayerOwned = card.userData.owner === 'PLAYER';

        // 1. Remove from current side stats
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

        // 2. AAA Animation: Slide across the "Equator"
        const targetY = card.userData.owner === 'ENEMY' ? 
            (1.2 - (lane.userData.eCards * 0.4)) : 
            (-1.2 + (lane.userData.pCards * 0.4));

        gsap.to(card.position, {
            y: lane.position.y + targetY,
            duration: 1.2,
            ease: "slow(0.7, 0.7, false)",
            onStart: () => {
                if (this.duel.audio) this.duel.audio.play('SLIDE', 0.4);
            },
            onComplete: () => {
                // 3. Add to new side stats after movement
                if (card.userData.owner === 'PLAYER') lane.userData.pPower += power;
                else lane.userData.ePower += power;

                if (this.duel.vfx) this.duel.vfx.createImpact(card.position, 0xaa00ff);
                this.syncGame();
            }
        });
    }

    /**
     * Utility: Triggers UI and Lane Visual updates after a logic shift
     */
    syncGame() {
        this.duel.updateLaneVisuals();
        if (this.duel.ui) this.duel.ui.updateUI();
    }
}
