/**
 * ALCHEMY CLASH: AAA AI MANAGER (THE RIVAL) - UPGRADED
 * Smarter tactical decision-making with VFX cues and ability awareness.
 */

import { CARD_DATABASE } from './CardData.js';

export class AIManager {
    constructor(duel, factory, vfx = null, audio = null) {
        this.duel = duel;
        this.factory = factory;
        this.vfx = vfx;
        this.audio = audio;
        this.isThinking = false;

        // Competitive Rival Deck
        this.deck = [
            'FIRE_DRAGON', 'WATER_SPIRIT', 'EARTH_GOLEM', 
            'WIND_REAPER', 'EMERALD_TITAN', 'SHADOW_ASSASSIN',
            'VOID_MAGE', 'FIRE_DRAGON', 'EARTH_GOLEM'
        ];

        this.hand = [];
        this.initialDraw();
    }

    initialDraw() {
        // AI starts with a hand of 3 cards
        for (let i = 0; i < 3; i++) this.drawCard();
    }

    drawCard() {
        if (this.deck.length === 0) return;
        const index = Math.floor(Math.random() * this.deck.length);
        const card = this.deck.splice(index, 1)[0];
        this.hand.push(card);
    }

    /**
     * Executes the AI's turn logic. Returns an array of cards played.
     */
    async playTurn() {
        if (this.isThinking) return [];
        this.isThinking = true;

        // Draw for the new turn
        this.drawCard();

        // "Thinking" Simulation
        const delay = 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        let remainingEnergy = this.duel.currentTurn;
        const cardsToPlay = [];

        // Multi-card play logic
        let possiblePlays = this.hand.filter(key => CARD_DATABASE[key].cost <= remainingEnergy);

        while (possiblePlays.length > 0) {
            // Heuristic: prefer higher cost, higher power, synergy cards
            possiblePlays.sort((a, b) => CARD_DATABASE[b].cost - CARD_DATABASE[a].cost);
            const cardKey = possiblePlays[0];
            
            // Evaluate best tactical lane
            const targetLane = this.calculateBestLane(cardKey);
            if (!targetLane) break;

            const cardEntity = this.deployCard(cardKey, targetLane);
            cardsToPlay.push(cardEntity);

            remainingEnergy -= CARD_DATABASE[cardKey].cost;
            this.hand.splice(this.hand.indexOf(cardKey), 1);

            possiblePlays = this.hand.filter(key => CARD_DATABASE[key].cost <= remainingEnergy);
        }

        this.isThinking = false;
        return cardsToPlay;
    }

    /**
     * TACTICAL ENGINE: Evaluates lane priority
     */
    calculateBestLane(cardKey) {
        const cardData = CARD_DATABASE[cardKey];
        const lanes = this.duel.lanes;

        const laneScores = lanes.map(lane => {
            let score = 0;
            const diff = lane.userData.pPower - lane.userData.ePower;

            // Bolster lanes where slightly losing
            if (diff > 0 && diff <= 4) score += 10;

            // Avoid over-committing to winning lanes
            if (diff < -5) score -= 5;

            // Elemental / ability synergy (Future expansion)
            if (cardData.element === 'FIRE' && diff > 2) score += 2;
            if (cardData.ability?.type === 'BOOST_LANE' && diff < 0) score += 3;

            // Avoid full lanes
            if (lane.userData.eCards >= 4) score = -100;

            return { lane, score };
        });

        laneScores.sort((a, b) => b.score - a.score);
        return laneScores[0]?.lane || null;
    }

    /**
     * Cinematic deployment of 3D card
     */
    deployCard(cardKey, targetLane) {
        const spawnX = targetLane.position.x + (Math.random() - 0.5);
        const card = this.factory.createCard(cardKey, spawnX, 12, 'ENEMY');

        // Face-down for Fog of War
        card.rotation.y = Math.PI;
        card.userData.targetLane = targetLane;

        // Lane stacking
        const yOffset = 1.2 - (targetLane.userData.eCards * 0.45);
        targetLane.userData.eCards++;

        // Slam Animation
        gsap.to(card.position, { 
            x: targetLane.position.x,
            y: targetLane.position.y + yOffset, 
            z: 0.1, 
            duration: 0.7, 
            ease: "power3.out",
            onComplete: () => {
                if (this.vfx) this.vfx.createImpact(card.position, CARD_DATABASE[cardKey].impactVFXColor);
                if (this.audio && CARD_DATABASE[cardKey].soundCue) this.audio.play(CARD_DATABASE[cardKey].soundCue, 0.3);
            }
        });

        // Slight wobble on impact
        gsap.to(card.rotation, {
            z: (Math.random() - 0.5) * 0.1,
            duration: 0.5,
            delay: 0.2
        });

        return card;
    }
}