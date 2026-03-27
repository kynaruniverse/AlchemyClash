/**
 * ALCHEMY CLASH: AAA CARD FACTORY
 * Handles the generation of 3D card entities with rarity-based visual effects.
 */

import * as THREE from 'three';
import { CARD_DATABASE } from '../game/CardData.js';

export class CardFactory {
    constructor(scene) {
        this.scene = scene;
        this.loader = new THREE.TextureLoader();
        this.textureCache = new Map(); 
    }

    /**
     * Internal helper to load and optimize textures for modern GPU rendering
     */
    getTexture(url) {
        if (!this.textureCache.has(url)) {
            const tex = this.loader.load(url);
            tex.anisotropy = 16; // Maximum sharpness for mobile/desktop
            tex.colorSpace = THREE.SRGBColorSpace; 
            this.textureCache.set(url, tex);
        }
        return this.textureCache.get(url);
    }

    /**
     * Creates a high-fidelity 3D Card Mesh with Rarity-based materials
     */
    createCard(cardKey, x, y, owner = 'PLAYER') {
        const data = CARD_DATABASE[cardKey];
        if (!data) {
            console.error(`CardFactory: Key ${cardKey} not found in database.`);
            return null;
        }
        
        // Standard TCG Aspect Ratio (2.2 x 3.2)
        const geometry = new THREE.BoxGeometry(2.2, 3.2, 0.1);
        
        // Rarity-based edge color
        const edgeColor = data.color || 0x222222;
        const sideMat = new THREE.MeshStandardMaterial({ 
            color: edgeColor, 
            metalness: 0.9, 
            roughness: 0.1,
            emissive: edgeColor,
            emissiveIntensity: data.rarity === 'LEGENDARY' ? 0.5 : 0.1
        });

        const materials = [
            sideMat, sideMat, sideMat, sideMat, // Edges
            new THREE.MeshStandardMaterial({ 
                map: this.getTexture(data.texture),
                metalness: 0.2,
                roughness: 0.6,
                bumpScale: 0.02
            }), // Front (Art)
            new THREE.MeshStandardMaterial({ 
                color: 0x05050a, 
                emissive: 0x00ffff, 
                emissiveIntensity: 0.2,
                metalness: 0.8,
                roughness: 0.2
            }) // Back (Alchemy Brand)
        ];

        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(x, y, 0);
        
        // Metadata for Game Logic
        mesh.userData = { 
            type: 'CARD', 
            data: { ...data }, // Clone to prevent reference bugs
            owner: owner, 
            isPlayed: false, 
            revealed: false,
            targetLane: null 
        };

        this.scene.add(mesh);
        return mesh;
    }

    /**
     * Handles the physical layout of a deck for the match start
     */
    spawnDeck(deckList, owner, onComplete) {
        console.log(`CardFactory: Spawning ${owner} deck...`);
        const cards = [];
        const startX = owner === 'PLAYER' ? -4 : -4;
        const startY = owner === 'PLAYER' ? -6 : 6;

        deckList.forEach((cardKey, index) => {
            // Stack cards slightly for a "Deck" look
            const card = this.createCard(cardKey, startX + (index * 0.05), startY, owner);
            
            // If it's the opponent, keep cards face down (rotated 180 on Y)
            if (owner === 'ENEMY') {
                card.rotation.y = Math.PI;
            }
            
            cards.push(card);
        });

        if (onComplete) onComplete(cards);
        return cards;
    }
}
