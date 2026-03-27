/**
 * ALCHEMY CLASH: DUEL MANAGER
 * The core rules engine handling turns, mana, lane power, and the reveal sequence.
 */

import * as THREE from 'three';

export class DuelManager {
    constructor(scene, vfx, audio) {
        this.scene = scene;
        this.vfx = vfx;
        this.audio = audio;

        this.lanes = [];
        
        // Game State
        this.playerMana = 1;
        this.maxTurn = 6;
        this.currentTurn = 1;
        this.isRevealing = false;
        
        // References to be injected by main.js
        this.ui = null;
        this.ai = null;

        // Turn management
        this.playedCards = []; // Queue for the current turn's reveal
        
        // Systems
        this.abilities = new AbilityManager(this);

        this.createLanes();
    }


    createLanes() {
        // High-fidelity Lane visuals
        const laneGeo = new THREE.PlaneGeometry(2.8, 4.5);
        
        for (let i = 0; i < 3; i++) {
            const laneMat = new THREE.MeshStandardMaterial({ 
                color: 0x00ffff, 
                transparent: true, 
                opacity: 0.05,
                side: THREE.DoubleSide
            });
            
            const lane = new THREE.Mesh(laneGeo, laneMat);
            // Positioned for the Tactical View (z=-0.1 to stay behind cards)
            lane.position.set(-3.8 + (i * 3.8), 1.5, -0.1);
            
            lane.userData = { 
                type: 'LANE', 
                index: i, 
                pPower: 0, 
                ePower: 0, 
                pCards: 0, // Count of player cards in this lane
                eCards: 0  // Count of enemy cards in this lane
            };
            
            this.scene.add(lane);
            this.lanes.push(lane);
        }
    }

    /**
     * Validates if a card can be placed and handles the Snap animation
     */
    checkSnap(card) {
        if (this.isRevealing) return false;

        // Mana Check
        const cost = card.userData.data.cost || 1;
        if (this.playerMana < cost) {
            this.ui.announce("NOT ENOUGH ENERGY");
            return false;
        }

        let snapped = false;
        this.lanes.forEach(lane => {
            const dist = card.position.distanceTo(lane.position);
            
            // If card is dropped near a lane and hasn't been played
            if (dist < 2.2 && !card.userData.isPlayed) {
                snapped = true;
                card.userData.isPlayed = true;
                card.userData.targetLane = lane;
                this.playedCards.push(card);
                
                // Deduct Mana
                this.playerMana -= cost;
                this.ui.updateUI();

                // Calculate Stack Offset (so cards don't overlap perfectly)
                const yOffset = -1.2 + (lane.userData.pCards * 0.4);
                lane.userData.pCards++;

                // AAA Snap Animation: Flip to back (Face Down)
                gsap.to(card.position, { 
                    x: lane.position.x, 
                    y: lane.position.y + yOffset, 
                    z: 0.1, 
                    duration: 0.4, 
                    ease: "power2.out" 
                });
                
                gsap.to(card.rotation, { y: Math.PI, duration: 0.4 }); 
                
                // Audio: Snap Slam
                if (this.audio) this.audio.play('SNAP', 0.6);
            }

        });
        
        return snapped;
    }

    /**
     * Handles the transition from Planning to Reveal phase
     */
    async processTurn() {
        if (this.isRevealing) return;
        this.isRevealing = true;

        // 1. AI Logic: Rival makes its move
        const enemyCard = this.ai.playTurn();
        if (enemyCard) {
            const eLane = enemyCard.userData.targetLane;
            const eOffset = 1.2 - (eLane.userData.eCards * 0.4);
            eLane.userData.eCards++;
            
            // Move AI card to its stack position
            gsap.to(enemyCard.position, { y: eLane.position.y + eOffset, duration: 0.5 });
            this.playedCards.push(enemyCard);
        }

        // 2. The Reveal Sequence
        this.ui.announce(`REVEALING...`);

        // Sort played cards: Generally reveal Player then Enemy, or by priority
        for (let card of this.playedCards) {
            if (!card.userData.revealed) {
                await this.revealCard(card);
            }
        }

        // 3. Turn Cleanup
        this.playedCards = [];
        this.currentTurn++;
        
        if (this.currentTurn > this.maxTurn) {
            this.endGame();
        } else {
            this.playerMana = this.currentTurn; // Energy scales with round
            this.isRevealing = false;
            this.ui.updateUI();
            this.ui.announce(`ROUND ${this.currentTurn}`);
        }
    }

    /**
     * Cinematic card flip and power calculation
     */
    revealCard(card) {
        return new Promise(resolve => {
            // AAA Reveal: Flip, Pulse, Impact
            gsap.to(card.rotation, { 
                y: 0, 
                duration: 0.6, 
                ease: "back.out(1.5)",
                onComplete: () => {
                    const lane = card.userData.targetLane;
                    const power = card.userData.data.atk;
                    
                    if (card.userData.owner === 'ENEMY') {
                        lane.userData.ePower += power;
                    } else {
                        lane.userData.pPower += power;
                    }
                    
                    // Trigger VFX and Lane Glow
                    this.vfx.createImpact(card.position, card.userData.data.color);
                    
                    // Audio: Reveal and Impact
                    if (this.audio) {
                        this.audio.play('REVEAL', 0.4);
                        setTimeout(() => this.audio.play('IMPACT', 0.5), 100);
                    }

                    gsap.to(lane.material, { opacity: 0.4, duration: 0.2, yoyo: true, repeat: 1 });

                    // Execute Card Ability
                    if (this.abilities) {
                        this.abilities.trigger(card);
                    }
                    
                    this.ui.updateUI();

                    card.userData.revealed = true;
                    
                    // Small delay between multiple reveals for dramatic effect
                    setTimeout(resolve, 500);
                }
            });
        });
    }

    endGame() {
        let pWins = 0;
        let eWins = 0;
        
        this.lanes.forEach(l => {
            if (l.userData.pPower > l.userData.ePower) pWins++;
            else if (l.userData.ePower > l.userData.pPower) eWins++;
        });

        const result = pWins > eWins ? "VICTORY" : (pWins === eWins ? "DRAW" : "DEFEAT");
        this.ui.announce(result);
        
        // Final UI Polish: Hide the End Turn button
        document.getElementById('end-turn-btn').style.display = 'none';
    }
}
