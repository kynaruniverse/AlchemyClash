/**
 * ALCHEMY CLASH: AAA INPUT SYSTEM
 * Handles 3D Raycasting, Drag-and-Drop Physics, and Mobile Touch Gating.
 */

import * as THREE from 'three';

export class InputSystem {
    constructor(engine, duelMgr) {
        this.engine = engine;
        this.duelMgr = duelMgr;
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Interaction State
        this.selectedCard = null;
        this.isDragging = false;
        this.enabled = false; 
        
        // Physics Helpers
        this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.intersection = new THREE.Vector3();
        this.offset = new THREE.Vector3();
        this.originalPos = new THREE.Vector3();

        this.init();
    }

    init() {
        const options = { passive: false };

        // Desktop
        window.addEventListener('mousedown', (e) => this.onDown(e), options);
        window.addEventListener('mousemove', (e) => this.onMove(e), options);
        window.addEventListener('mouseup', (e) => this.onUp(e), options);

        // Mobile
        window.addEventListener('touchstart', (e) => this.onDown(e.touches[0]), options);
        window.addEventListener('touchmove', (e) => this.onMove(e.touches[0]), options);
        window.addEventListener('touchend', (e) => this.onUp(e.changedTouches[0]), options);
    }

    updateMouse(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    onDown(e) {
        if (!this.enabled) return;
        
        this.updateMouse(e);
        this.raycaster.setFromCamera(this.mouse, this.engine.camera);
        
        const intersects = this.raycaster.intersectObjects(this.engine.scene.children, true);
        const cardHit = intersects.find(h => 
            h.object.parent?.userData?.type === 'CARD' || h.object.userData.type === 'CARD'
        );

        const target = cardHit?.object.userData.type === 'CARD' ? cardHit.object : cardHit?.object.parent;

        if (target && target.userData.owner === 'PLAYER' && !target.userData.isPlayed) {
            this.selectedCard = target;
            this.isDragging = true;
            this.originalPos.copy(target.position);

            // Calculate offset to prevent "jumping" when grabbed
            if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
                this.offset.copy(this.intersection).sub(target.position);
            }

            // AAA Animation: Lift and Glow
            gsap.to(target.position, { z: 2, duration: 0.2, ease: "power2.out" });
            gsap.to(target.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.2 });
            
            if (this.duelMgr.audio) this.duelMgr.audio.play('PICKUP', 0.2);
        }
    }

    onMove(e) {
        if (!this.isDragging || !this.selectedCard) return;
        
        // Block browser ghost-scrolling
        if (e.preventDefault) e.preventDefault();

        this.updateMouse(e);
        this.raycaster.setFromCamera(this.mouse, this.engine.camera);

        if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
            const newPos = this.intersection.sub(this.offset);
            
            // Apply position with a hover height (z=2)
            this.selectedCard.position.set(newPos.x, newPos.y, 2);

            // Dynamic Tilt (Juice): Card tilts as it moves
            const tiltX = (newPos.y - this.originalPos.y) * 0.1;
            const tiltY = (newPos.x - this.originalPos.x) * -0.1;
            gsap.to(this.selectedCard.rotation, {
                x: tiltX,
                y: tiltY,
                duration: 0.1
            });
        }
    }

    onUp(e) {
        if (!this.selectedCard) return;

        // Check with DuelManager if drop is valid
        const success = this.duelMgr.tryPlayCard(this.selectedCard);

        if (!success) {
            // Snap back to hand
            gsap.to(this.selectedCard.position, {
                x: this.originalPos.x,
                y: this.originalPos.y,
                z: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.75)"
            });
            gsap.to(this.selectedCard.rotation, { x: 0, y: 0, z: 0, duration: 0.3 });
        }

        gsap.to(this.selectedCard.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
        
        this.selectedCard = null;
        this.isDragging = false;
    }
}
