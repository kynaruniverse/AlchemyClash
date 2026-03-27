/**
 * ALCHEMY CLASH: DUEL MANAGER (RULES ENGINE)
 * Manages Lanes, Turns, Mana, and the Cinematic Reveal Sequence.
 */

import * as THREE from 'three';

export class DuelManager {
    constructor(scene, vfx, audio) {
        this.scene = scene;
        this.vfx = vfx;
        this.audio = audio;

        this.lanes = [];
        this.playerMana = 1;
        this.maxTurn = 6;
        this.currentTurn = 1;
        this.isRevealing = false;
        
        // Orchestration Refs
        this.ui = null;
        this.ai = null;
        this.hand = [];
        this.playedThisTurn = []; // Cards waiting for reveal

        this.createLanes();
    }

    createLanes() {
        const laneGeo = new THREE.PlaneGeometry(3.2, 5.0);
        const laneSpacing = 4.0;

        for (let i = 0; i < 3; i++) {
            const laneMat = new THREE.MeshStandardMaterial({ 
                color: 0x222222,
                transparent: true, 
                opacity: 0.2,
                side: THREE.DoubleSide,
                emissive: 0x000000,
                emissiveIntensity: 1.0
            });

            const lane = new THREE.Mesh(laneGeo, laneMat);
            // Positioned for the top-down tactical camera
            lane.position.set(-laneSpacing + (i * laneSpacing), 0, -0.05);
            
            lane.userData = { 
                type: 'LANE', 
                index: i, 
                pPower: 0, 
                ePower: 0, 
                pCards: 0, 
                eCards: 0,
                cardsInLane: []
            };
            
            this.scene.add(lane);
            this.lanes.push(lane);

            // Add a decorative border/glow for the lane
            const edges = new THREE.EdgesGeometry(laneGeo);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x444444 }));
            line.position.copy(lane.position);
            this.scene.add(line);
            lane.userData.border = line;
        }
    }

    /**
     * Logic for snapping a card into a lane during the Planning Phase
     */
    tryPlayCard(card) {
        if (this.isRevealing) return false;

        const cost = card.userData.data.cost || 1;
        if (this.playerMana < cost) {
            if (this.ui) this.ui.announce("NOT ENOUGH ENERGY");
            return false;
        }

        let bestLane = null;
        let minDist = 2.5;

        this.lanes.forEach(lane => {
            const dist = card.position.distanceTo(lane.position);
            if (dist < minDist && lane.userData.pCards < 4) {
                minDist = dist;
                bestLane = lane;
            }
        });

        if (bestLane) {
            this.playerMana -= cost;
            card.userData.isPlayed = true;
            card.userData.targetLane = bestLane;
            this.playedThisTurn.push(card);

            // AAA Snap Animation: Face Down (Y = PI)
            const yPos = -1.2 + (bestLane.userData.pCards * 0.5);
            bestLane.userData.pCards++;

            gsap.to(card.position, { 
                x: bestLane.position.x, 
                y: bestLane.position.y + yPos, 
                z: 0.1, 
                duration: 0.3, 
                ease: "back.out(1.2)" 
            });
            
            gsap.to(card.rotation, { y: Math.PI, duration: 0.4 });
            
            if (this.audio) this.audio.play('SNAP', 0.5);
            if (this.ui) this.ui.updateUI();
            
            return true;
        }
        
        return false;
    }

    /**
     * Ends the turn and triggers the Reveal Sequence
     */
    async processTurn() {
        if (this.isRevealing) return;
        this.isRevealing = true;

        if (this.ui) this.ui.announce("OPPONENT'S MOVE...");

        // 1. Get AI Move
        const enemyMoves = await this.ai.playTurn(); 
        if (enemyMoves && enemyMoves.length > 0) {
            enemyMoves.forEach(card => this.playedThisTurn.push(card));
        }

        // 2. Sort Reveal: Lower cost cards reveal first (Standard Snap priority)
        this.playedThisTurn.sort((a, b) => a.userData.data.cost - b.userData.data.cost);

        // 3. Reveal Sequence
        for (let card of this.playedThisTurn) {
            await this.revealCard(card);
        }

        // 4. Cleanup & Next Round
        this.playedThisTurn = [];
        this.currentTurn++;
        
        if (this.currentTurn > this.maxTurn) {
            this.endGame();
        } else {
            this.playerMana = this.currentTurn;
            this.isRevealing = false;
            if (this.ui) {
                this.ui.updateUI();
                this.ui.announce(`ROUND ${this.currentTurn}`);
            }
        }
    }

    async revealCard(card) {
        return new Promise(resolve => {
            gsap.to(card.rotation, { 
                y: 0, 
                duration: 0.6, 
                ease: "back.out(1.4)",
                onComplete: () => {
                    const lane = card.userData.targetLane;
                    const power = card.userData.data.atk;
                    
                    if (card.userData.owner === 'ENEMY') {
                        lane.userData.ePower += power;
                    } else {
                        lane.userData.pPower += power;
                    }
                    
                    // VFX Impact
                    if (this.vfx) this.vfx.createImpact(card.position, card.userData.data.color);
                    if (this.audio) this.audio.play('REVEAL', 0.4);

                    this.updateLaneVisuals();
                    if (this.ui) this.ui.updateUI();

                    card.userData.revealed = true;
                    setTimeout(resolve, 600); // Cinematic pause
                }
            });
        });
    }

    updateLaneVisuals() {
        this.lanes.forEach(lane => {
            const p = lane.userData.pPower;
            const e = lane.userData.ePower;
            
            let color = 0x444444; 
            if (p > e) color = 0x00ffff; // Cyan (Player)
            if (e > p) color = 0xff0055; // Magenta (Enemy)

            // Pulse the lane glow
            gsap.to(lane.material.emissive, {
                r: ((color >> 16) & 255) / 255,
                g: ((color >> 8) & 255) / 255,
                b: (color & 255) / 255,
                duration: 0.4
            });
            
            if (lane.userData.border) {
                lane.userData.border.material.color.set(color);
            }
        });
    }

    endGame() {
        let pWins = 0, eWins = 0;
        this.lanes.forEach(l => {
            if (l.userData.pPower > l.userData.ePower) pWins++;
            else if (l.userData.ePower > l.userData.pPower) eWins++;
        });

        const msg = pWins > eWins ? "VICTORY" : (pWins === eWins ? "DRAW" : "DEFEAT");
        if (this.ui) this.ui.announce(msg);
        
        // Final VFX
        this.lanes.forEach(l => {
            const winColor = l.userData.pPower > l.userData.ePower ? 0x00ffff : 0xff0055;
            if (this.vfx) this.vfx.createExplosion(l.position, winColor);
        });
    }
}
