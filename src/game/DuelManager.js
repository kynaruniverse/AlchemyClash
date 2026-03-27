/**
 * ALCHEMY CLASH: DUEL MANAGER (FULL SNAP DRAG & DROP)
 * - Drag & Drop from hand
 * - Lane highlight pulse on hover
 * - Legendary card trails
 * - Snap snapping
 * - Cinematic reveals
 */

import * as THREE from 'three';

export class DuelManager {
    constructor(scene, vfx, audio, camera, domElement) {
        this.scene = scene;
        this.vfx = vfx;
        this.audio = audio;
        this.camera = camera;
        this.domElement = domElement; // for pointer events

        this.lanes = [];
        this.playerMana = 1;
        this.maxTurn = 6;
        this.currentTurn = 1;
        this.isRevealing = false;

        this.ui = null;
        this.ai = null;
        this.playerHand = [];
        this.playedThisTurn = [];

        this.draggedCard = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.createLanes();
        this.setupPointerEvents();
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
            lane.position.set(-laneSpacing + i * laneSpacing, 0, -0.05);

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

            const edges = new THREE.EdgesGeometry(laneGeo);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x444444 }));
            line.position.copy(lane.position);
            this.scene.add(line);
            lane.userData.border = line;
        }
    }

    setupPointerEvents() {
        this.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.domElement.addEventListener('pointerup', (e) => this.onPointerUp(e));
    }

    onPointerDown(event) {
        if (this.isRevealing) return;

        this.updateMouse(event);
        const intersects = this.getIntersectedCards();
        if (intersects.length > 0) {
            const card = intersects[0].object;
            if (card.userData.owner === 'PLAYER' && !card.userData.isPlayed) {
                this.draggedCard = card;

                // Lift card up for drag
                gsap.to(card.position, { z: 1.0, duration: 0.2 });

                // Legendary trail
                if (card.userData.data.rarity === 'LEGENDARY' && this.vfx) {
                    this.vfx.attachLegendaryTrail(card, 0xffdd00);
                }
            }
        }
    }

    onPointerMove(event) {
        if (!this.draggedCard) return;

        this.updateMouse(event);
        const dragCard = this.draggedCard;

        // Move card with mouse in 3D plane
        const planeZ = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersect = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(planeZ, intersect);
        dragCard.position.x = intersect.x;
        dragCard.position.y = intersect.y;

        // Lane hover highlight
        this.lanes.forEach(lane => {
            const dist = dragCard.position.distanceTo(lane.position);
            if (dist < 2.5 && lane.userData.pCards < 4) {
                // Pulse highlight
                gsap.to(lane.material, { opacity: 0.5, duration: 0.3, yoyo: true, repeat: 1 });
            } else {
                gsap.to(lane.material, { opacity: 0.2, duration: 0.2 });
            }
        });
    }

    onPointerUp(event) {
        if (!this.draggedCard) return;

        const card = this.draggedCard;
        this.draggedCard = null;

        // Snap card into closest lane
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
            this.tryPlayCard(card);
        } else {
            // Return to hand
            gsap.to(card.position, { z: 0, x: card.userData.startX, y: card.userData.startY, duration: 0.3 });
        }
    }

    updateMouse(event) {
        const rect = this.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    getIntersectedCards() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        return this.raycaster.intersectObjects(this.playerHand);
    }

    tryPlayCard(card) {
        if (this.isRevealing) return false;

        const cost = card.userData.data.cost || 1;
        if (this.playerMana < cost) {
            if (this.ui) this.ui.announce("NOT ENOUGH ENERGY");
            return false;
        }

        let bestLane = card.userData.targetLane || null;
        if (!bestLane) {
            // Find closest lane if not set
            let minDist = 2.5;
            this.lanes.forEach(lane => {
                const dist = card.position.distanceTo(lane.position);
                if (dist < minDist && lane.userData.pCards < 4) {
                    minDist = dist;
                    bestLane = lane;
                }
            });
        }

        if (bestLane) {
            this.playerMana -= cost;
            card.userData.isPlayed = true;
            card.userData.targetLane = bestLane;
            this.playedThisTurn.push(card);

            // Snap animation
            const yPos = -1.2 + bestLane.userData.pCards * 0.5;
            bestLane.userData.pCards++;

            gsap.to(card.position, { 
                x: bestLane.position.x, 
                y: bestLane.position.y + yPos, 
                z: 0.1, 
                duration: 0.3, 
                ease: "back.out(1.2)" 
            });

            gsap.to(card.rotation, { y: Math.PI, duration: 0.4 });

            // Lane impact FX
            if (this.vfx) this.vfx.createImpact(bestLane.position, 0xffffff, 10);

            if (this.audio) this.audio.play('SNAP', 0.5);
            if (this.ui) this.ui.updateUI();

            return true;
        }

        return false;
    }

    async processTurn() {
        if (this.isRevealing) return;
        this.isRevealing = true;

        if (this.ui) this.ui.announce("OPPONENT'S MOVE...");

        // AI Moves
        const enemyMoves = await this.ai.playTurn();
        if (enemyMoves?.length) enemyMoves.forEach(c => this.playedThisTurn.push(c));

        // Sort by cost low->high
        this.playedThisTurn.sort((a, b) => a.userData.data.cost - b.userData.data.cost);

        // Reveal with cinematic FX
        for (let card of this.playedThisTurn) {
            await this.revealCard(card);
            if (card.userData.data.rarity === 'LEGENDARY' && this.vfx) {
                this.vfx.attachLegendaryTrail(card, 0xffdd00);
            }
        }

        this.playedThisTurn = [];
        this.currentTurn++;
        if (this.currentTurn > this.maxTurn) this.endGame();
        else {
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

                    if (card.userData.owner === 'ENEMY') lane.userData.ePower += power;
                    else lane.userData.pPower += power;

                    if (this.vfx) this.vfx.createImpact(card.position, card.userData.data.color, 12);
                    if (this.audio) this.audio.play('REVEAL', 0.4);

                    this.updateLaneVisuals();
                    if (this.ui) this.ui.updateUI();

                    card.userData.revealed = true;
                    setTimeout(resolve, 600);
                }
            });
        });
    }

    updateLaneVisuals() {
        this.lanes.forEach(lane => {
            const p = lane.userData.pPower;
            const e = lane.userData.ePower;
            let color = 0x444444;

            if (p > e) color = 0x00ffff;
            if (e > p) color = 0xff0055;

            gsap.to(lane.material.emissive, {
                r: ((color >> 16) & 255) / 255,
                g: ((color >> 8) & 255) / 255,
                b: (color & 255) & 255 / 255,
                duration: 0.4
            });

            if (lane.userData.border) lane.userData.border.material.color.set(color);
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

        // Cinematic final VFX
        this.lanes.forEach(l => {
            const winColor = l.userData.pPower > l.userData.ePower ? 0x00ffff : 0xff0055;
            if (this.vfx) this.vfx.createExplosion(l.position, winColor);
        });
    }
}