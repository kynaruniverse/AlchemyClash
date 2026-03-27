/**
 * ALCHEMY CLASH: ABILITY MANAGER
 * Handles logic for special card effects (Buffs, Debuffs, and Lane manipulation).
 */

export class AbilityManager {
    constructor(duel) {
        this.duel = duel;
    }

    /**
     * Triggers a card's unique ability based on its data
     * @param {Object} card - The 3D Mesh of the card being revealed
     */
    trigger(card) {
        const ability = card.userData.data.ability;
        if (!ability) return;

        console.log(`Triggering Ability: ${ability.type} for ${card.userData.data.name}`);

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
        }
    }

    // Effect: Adds power to all OTHER cards in this lane
    boostLane(card, value) {
        const lane = card.userData.targetLane;
        // In a real game, you'd iterate through cards in the lane and add VFX
        if (card.userData.owner === 'PLAYER') lane.userData.pPower += value;
        else lane.userData.ePower += value;
        
        this.duel.vfx.createImpact(card.position, 0xffff00); // Golden buff glow
    }

    // Effect: Reduces the enemy's power in this lane
    burnEnemy(card, value) {
        const lane = card.userData.targetLane;
        if (card.userData.owner === 'PLAYER') lane.userData.ePower -= value;
        else lane.userData.pPower -= value;
        
        this.duel.vfx.createImpact(lane.position, 0xff4400); // Fire impact
    }
}
