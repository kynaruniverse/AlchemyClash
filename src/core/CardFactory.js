/**
 * ALCHEMY CLASH: AAA CARD FACTORY (UPGRADED v2)
 * 3D card entities with rarity VFX, Snap-style dynamics, and cinematic battlefield deployment.
 */

import * as THREE from 'three';
import { CARD_DATABASE } from '../game/CardData.js';
import { gsap } from 'gsap';

export class CardFactory {
    constructor(scene, vfxManager) {
        this.scene = scene;
        this.vfx = vfxManager;
        this.loader = new THREE.TextureLoader();
        this.textureCache = new Map();
    }

    /**
     * Load and cache textures with anisotropy and sRGB for GPU
     */
    getTexture(url) {
        if (!this.textureCache.has(url)) {
            const tex = this.loader.load(url);
            tex.anisotropy = 16;
            tex.colorSpace = THREE.SRGBColorSpace;
            this.textureCache.set(url, tex);
        }
        return this.textureCache.get(url);
    }

    /**
     * Creates a high-fidelity 3D Card Mesh
     */
    createCard(cardKey, x, y, owner = 'PLAYER') {
        const data = CARD_DATABASE[cardKey];
        if (!data) {
            console.error(`CardFactory: Card key ${cardKey} not found`);
            return null;
        }

        const geometry = new THREE.BoxGeometry(2.2, 3.2, 0.1);

        // Materials
        const edgeColor = data.color || 0x222222;
        const emissiveIntensity = { 'LEGENDARY': 0.6, 'EPIC': 0.35, 'RARE': 0.2, 'UNCOMMON': 0.15, 'COMMON': 0.05 }[data.rarity] || 0.1;

        const sideMat = new THREE.MeshStandardMaterial({
            color: edgeColor,
            metalness: 0.8,
            roughness: 0.2,
            emissive: edgeColor,
            emissiveIntensity
        });

        const frontMat = new THREE.MeshStandardMaterial({
            map: this.getTexture(data.texture),
            metalness: 0.2,
            roughness: 0.6,
            bumpScale: 0.02
        });

        const backMat = new THREE.MeshStandardMaterial({
            color: 0x05050a,
            emissive: 0x00ffff,
            emissiveIntensity: 0.15,
            metalness: 0.8,
            roughness: 0.2
        });

        const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(x, y, 0);

        // Metadata
        mesh.userData = {
            type: 'CARD',
            data: { ...data },
            owner,
            isPlayed: false,
            revealed: false,
            targetLane: null
        };

        // Rarity VFX
        if (this.vfx) {
            if (data.rarity === 'LEGENDARY') this.vfx.attachLegendaryTrail(mesh);
            else if (data.rarity === 'EPIC') this.vfx.attachEpicGlow(mesh);
        }

        this.scene.add(mesh);
        return mesh;
    }

    /**
     * Spawns a deck visually
     */
    spawnDeck(deckList = [], owner = 'PLAYER', onComplete = null) {
        if (!deckList.length) return [];

        const cards = [];
        const startX = owner === 'PLAYER' ? -4 : -4;
        const startY = owner === 'PLAYER' ? -6 : 6;

        deckList.forEach((cardKey, index) => {
            const offsetX = (index % 3) * 0.05;
            const offsetY = (index % 3) * 0.05;
            const card = this.createCard(cardKey, startX + offsetX, startY + offsetY, owner);

            if (!card) return;

            if (owner === 'ENEMY') card.rotation.y = Math.PI;

            gsap.fromTo(card.position, { z: -1 }, { z: 0, duration: 0.4, delay: index * 0.05, ease: "power2.out" });

            cards.push(card);
        });

        if (onComplete) onComplete(cards);
        return cards;
    }

    /**
     * Animates a card from hand to lane with cinematic arc
     */
    playCardToLane(card, lane) {
        if (!card || !lane) return;

        const side = card.userData.owner;
        const cardsInLane = side === 'PLAYER' ? lane.userData.pCards : lane.userData.eCards;
        const targetY = (side === 'PLAYER' ? -1.2 : 1.2) + cardsInLane * 0.5;

        // Update lane metadata
        if (side === 'PLAYER') lane.userData.pCards++;
        else lane.userData.eCards++;

        // Arc motion for cinematic feel
        gsap.to(card.position, {
            x: lane.position.x + (Math.random() - 0.5) * 0.1,
            y: lane.position.y + targetY + 0.1,
            z: 0.1,
            duration: 0.5,
            ease: "power3.out"
        });

        // Slight rotation tilt
        gsap.to(card.rotation, {
            x: (Math.random() - 0.5) * 0.1,
            y: Math.PI,
            z: (Math.random() - 0.5) * 0.1,
            duration: 0.4
        });

        // VFX impact
        if (this.vfx) this.vfx.createImpact(card.position, card.userData.data.color);
    }

    /**
     * Dispose of card resources when removed from scene
     */
    removeCard(card) {
        if (!card) return;

        if (card.material) {
            if (Array.isArray(card.material)) {
                card.material.forEach(mat => {
                    if (mat.map) mat.map.dispose();
                    mat.dispose();
                });
            } else {
                if (card.material.map) card.material.map.dispose();
                card.material.dispose();
            }
        }

        this.scene.remove(card);
    }
}