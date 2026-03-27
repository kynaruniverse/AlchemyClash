/**
 * ALCHEMY CLASH: AAA INPUT SYSTEM (SNAP STYLE)
 * - Smooth drag & drop
 * - Hover tilt and lift
 * - Snap snapping to lanes
 * - Works with DuelManager & Engine3D
 */

import * as THREE from 'three';

export class InputSystem {
    constructor(engine, duelMgr) {
        this.engine = engine;
        this.duelMgr = duelMgr;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.selectedCard = null;
        this.isDragging = false;
        this.enabled = false;

        // Dragging helpers
        this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        this.intersection = new THREE.Vector3();
        this.offset = new THREE.Vector3();
        this.originalPos = new THREE.Vector3();

        this.initEvents();
    }

    initEvents() {
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

            // Offset for smooth drag
            if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
                this.offset.copy(this.intersection).sub(target.position);
            }

            // Lift & tilt
            this.selectedCard.state = 'dragging';
            if (this.duelMgr.audio) this.duelMgr.audio.play('PICKUP', 0.2);
        }
    }

    onMove(e) {
        if (!this.isDragging || !this.selectedCard) return;
        if (e.preventDefault) e.preventDefault();

        this.updateMouse(e);
        this.raycaster.setFromCamera(this.mouse, this.engine.camera);

        if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
            const newPos = this.intersection.sub(this.offset);

            this.selectedCard.position.x = newPos.x;
            this.selectedCard.position.y = newPos.y;
            this.selectedCard.position.z = 2; // hover height

            // Slight tilt for Snap-style feel
            this.selectedCard.rotation.z = (newPos.x - this.originalPos.x) * -0.05;
            this.selectedCard.rotation.x = (newPos.y - this.originalPos.y) * 0.03;
        }

        // Lane highlight while hovering
        this.duelMgr.lanes.forEach(lane => {
            const dist = this.selectedCard.position.distanceTo(lane.position);
            if (dist < 2.5 && lane.userData.pCards < 4) {
                gsap.to(lane.material, { opacity: 0.5, duration: 0.2, yoyo: true, repeat: 1 });
            } else {
                gsap.to(lane.material, { opacity: 0.2, duration: 0.2 });
            }
        });
    }

    onUp(e) {
        if (!this.selectedCard) return;

        // Attempt to snap card into lane
        const success = this.duelMgr.tryPlayCard(this.selectedCard);

        if (!success) {
            // Smoothly return to hand
            gsap.to(this.selectedCard.position, {
                x: this.originalPos.x,
                y: this.originalPos.y,
                z: this.originalPos.z,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(this.selectedCard.rotation, { x: 0, z: 0, duration: 0.3 });
        }

        this.selectedCard.state = 'idle';
        this.selectedCard = null;
        this.isDragging = false;
    }
}