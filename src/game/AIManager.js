/**
 * ALCHEMY CLASH: AAA AI MANAGER (THE RIVAL)
 * Orchestrates tactical decision-making and cinematic card deployment.
 */

import { CARD_DATABASE } from './CardData.js';

export class AIManager {
    constructor(duel, factory) {
        this.duel = duel;
        this.factory = factory;
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
        for (let i = 0; i < 3; i++) {
            this.drawCard();
        }
    }

    drawCard() {
        if (this.deck.length > 0) {
            const card = this.deck.splice(Math.floor(Math.random() * this.deck.length), 1)[0];
            this.hand.push(card);
        }
    }

    /**
     * Executes the AI's turn logic. Returns an array of cards played.
     */
    async playTurn() {
        if (this.isThinking) return [];
        this.isThinking = true;

        // Draw for the new turn
        this.drawCard();

        // 1. "Thinking" Simulation
        const delay = 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        let remainingEnergy = this.duel.currentTurn;
        const cardsToPlay = [];

        // 2. Multi-Card Play Logic (Spend energy efficiently)
        let possiblePlays = this.hand.filter(key => CARD_DATABASE[key].cost <= remainingEnergy);

        while (possiblePlays.length > 0) {
            // Pick a card (Heuristic: Prefer higher cost/power cards first)
            possiblePlays.sort((a, b) => CARD_DATABASE[b].cost - CARD_DATABASE[a].cost);
            const cardKey = possiblePlays[0];
            
            // Choose the most tactical lane
            const targetLane = this.calculateBestLane(cardKey);
            
            if (targetLane && targetLane.userData.eCards < 4) {
                const cardEntity = this.deployCard(cardKey, targetLane);
                cardsToPlay.push(cardEntity);
                
                // Deduct energy and update hand
                remainingEnergy -= CARD_DATABASE[cardKey].cost;
                this.hand.splice(this.hand.indexOf(cardKey), 1);
                
                // Re-scan for more playable cards with remaining energy
                possiblePlays = this.hand.filter(key => CARD_DATABASE[key].cost <= remainingEnergy);
            } else {
                break; // No valid lanes left
            }
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

        // Scoring lanes based on priority
        const laneScores = lanes.map(lane => {
            let score = 0;
            const diff = lane.userData.pPower - lane.userData.ePower;

            // Priority 1: Bolster lanes where we are slightly losing (-1 to -4 diff)
            if (diff > 0 && diff <= 4) score += 10;
            
            // Priority 2: Don't over-commit to lanes we are already crushing
            if (diff < -5) score -= 5;

            // Priority 3: Element Synergy (Future Expansion Hook)
            if (cardData.element === 'FIRE' && diff > 2) score += 2;

            // Avoid full lanes
            if (lane.userData.eCards >= 4) score = -100;

            return { lane, score };
        });

        // Sort by score and return the best
        laneScores.sort((a, b) => b.score - a.score);
        return laneScores[0].lane;
    }

    /**
     * Cinematic deployment of 3D card
     */
    deployCard(cardKey, targetLane) {
        // Spawn from the top "Off-screen"
        const spawnX = targetLane.position.x + (Math.random() - 0.5);
        const card = this.factory.createCard(cardKey, spawnX, 12, 'ENEMY');
        
        // AI cards are face-down (Fog of War)
        card.rotation.y = Math.PI;
        card.userData.targetLane = targetLane;

        // Position in the lane stack
        const yOffset = 1.2 - (targetLane.userData.eCards * 0.45);
        targetLane.userData.eCards++;

        // Slam Animation
        gsap.to(card.position, { 
            x: targetLane.position.x,
            y: targetLane.position.y + yOffset, 
            z: 0.1, 
            duration: 0.7, 
            ease: "power3.out" 
        });

        // Add a slight "wobble" on impact
        gsap.to(card.rotation, {
            z: (Math.random() - 0.5) * 0.1,
            duration: 0.5,
            delay: 0.2
        });

        return card;
    }
}
