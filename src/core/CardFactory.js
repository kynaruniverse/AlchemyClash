/**
 * ALCHEMY CLASH: CARD FACTORY
 * Handles the generation of 3D card entities with multi-material support.
 */

import * as THREE from 'three';
import { CARD_DATABASE } from '../game/CardData.js';

export class CardFactory {
    constructor(scene) {
        this.scene = scene;
        this.loader = new THREE.TextureLoader();
        this.textureCache = new Map(); // Prevents redundant network requests
    }

    /**
     * Internal helper to load and optimize textures
     */
    getTexture(url) {
        if (!this.textureCache.has(url)) {
            const tex = this.loader.load(url);
            tex.anisotropy = 8; // Keeps art sharp at glancing angles
            tex.encoding = THREE.sRGBEncoding; // Correct color profile
            this.textureCache.set(url, tex);
        }
        return this.textureCache.get(url);
    }

    /**
     * Creates a high-fidelity 3D Card Mesh
     */
    createCard(cardKey, x, y, owner = 'PLAYER') {
        const data = CARD_DATABASE[cardKey];
        
        // AAA Dimensions: Standard TCG Aspect Ratio
        const geometry = new THREE.BoxGeometry(2.2, 3.2, 0.08);
        
        // Define specific material properties for a "Premium" feel
        const sideMat = new THREE.MeshStandardMaterial({ 
            color: 0x222222, 
            metalness: 0.8, 
            roughness: 0.2 
        });

        const materials = [
            sideMat, // Right
            sideMat, // Left
            sideMat, // Top
            sideMat, // Bottom
            new THREE.MeshStandardMaterial({ 
                map: this.getTexture(data.texture),
                metalness: 0.3,
                roughness: 0.4
            }), // Front Face
            new THREE.MeshStandardMaterial({ 
                color: 0x1a1a2e, // Deep Midnight Blue
                emissive: 0x001133, // Subtle glow for card back
                metalness: 0.7,
                roughness: 0.1
            }) // Back Face (Fog of War)
        ];

        const mesh = new THREE.Mesh(geometry, materials);
        
        // Set Initial Position
        mesh.position.set(x, y, 0);
        
        // Metadata: Essential for DuelManager and InputSystem
        mesh.userData = { 
            type: 'CARD', 
            data: data, 
            owner: owner, 
            isPlayed: false, 
            revealed: false,
            targetLane: null 
        };

        this.scene.add(mesh);
        return mesh;
    }
}
