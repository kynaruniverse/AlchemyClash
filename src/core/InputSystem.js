/**
 * ALCHEMY CLASH: INPUT SYSTEM
 * Converts Screen Touches/Mouse into 3D World interactions.
 * Handles Drag-and-Drop, Snapping Logic, and Input Gating.
 */

import * as THREE from 'three';

export class InputSystem {
    constructor(engine, duelMgr) {
        this.engine = engine;
        this.duelMgr = duelMgr;
        
        // Internal state
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedCard = null;
        this.isDragging = false;
        this.startPos = new THREE.Vector3();
        
        // Input Gate: Set to true only after the "Battle Transition"
        this.enabled = false; 

        // Mathematical plane representing the board surface
        this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.intersection = new THREE.Vector3();

        this.init();
    }

    init() {
        // Desktop Mouse Listeners
        window.addEventListener('mousedown', (e) => this.onDown(e));
        window.addEventListener('mousemove', (e) => this.onMove(e));
        window.addEventListener('mouseup', () => this.onUp());

        // Mobile Touch Listeners (with passive: false to allow preventDefault)
        window.addEventListener('touchstart', (e) => this.onDown(e.touches[0]), { passive: false });
        window.addEventListener('touchmove', (e) => this.onMove(e.touches[0]), { passive: false });
        window.addEventListener('touchend', () => this.onUp());
    }

    /**
     * Updates the internal mouse vector from screen coordinates
     */
    updateMouse(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onDown(e) {
        if (!this.enabled) return;
        
        this.updateMouse(e);
        this.raycaster.setFromCamera(this.mouse, this.engine.camera);
        
        // Detect if we hit a card that hasn't been played yet
        const hits = this.raycaster.intersectObjects(this.engine.scene.children);
        const cardHit = hits.find(h => 
            h.object.userData.type === 'CARD' && 
            !h.object.userData.isPlayed &&
            h.object.userData.owner === 'PLAYER'
        );
        
        if (cardHit) {
            // Show details on click/tap
            this.duelMgr.ui.showCardDetail(cardHit.object.userData.data);
            
            // Audio: Drag Whoosh
            if (this.duelMgr.audio) this.duelMgr.audio.play('DRAG', 0.3);

            this.selectedCard = cardHit.object;


            this.isDragging = true;
            this.startPos.copy(this.selectedCard.position);
            
            // AAA Lift Animation: Use "Back" ease for a springy weight feel
            gsap.to(this.selectedCard.position, { z: 1.2, duration: 0.25, ease: "back.out(2)" });
            gsap.to(this.selectedCard.scale, { x: 1.15, y: 1.15, duration: 0.25 });
        }
    }

    onMove(e) {
        if (!this.isDragging || !this.selectedCard) return;
        
        // Prevent mobile browser scrolling while dragging
        if (e.cancelable) e.preventDefault();

        this.updateMouse(e);
        this.raycaster.setFromCamera(this.mouse, this.engine.camera);

        // Calculate position on the invisible drag plane
        if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
            // Smoothly move card toward intersection point (z=1 to keep it "hovering")
            this.selectedCard.position.set(
                this.intersection.x,
                this.intersection.y,
                1.2
            );
        }
    }

    onUp() {
        if (!this.selectedCard) return;

        // Ask DuelManager if we are hovering over a valid lane
        const snapped = this.duelMgr.checkSnap(this.selectedCard);
        
        if (!snapped) {
            // REJECTED: Spring the card back to its original position in hand
            gsap.to(this.selectedCard.position, {
                x: this.startPos.x,
                y: this.startPos.y,
                z: 0,
                duration: 0.45,
                ease: "power3.out"
            });
            
            // Flip back to face up if it was accidentally tilted
            gsap.to(this.selectedCard.rotation, { y: 0, duration: 0.3 });
        }

        // Return scale to normal
        gsap.to(this.selectedCard.scale, { x: 1, y: 1, duration: 0.2 });
        
        this.isDragging = false;
        this.selectedCard = null;
    }
}
