/**
 * ALCHEMY CLASH: AAA AUDIO MANAGER
 * High-performance sound layering and browser-policy handling.
 */

export class AudioManager {
    constructor() {
        // High-fidelity SFX Library
        this.manifest = {
            'DRAG': 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',   // Whoosh
            'SNAP': 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',   // Slam
            'REVEAL': 'https://assets.mixkit.co/active_storage/sfx/2591/2591-preview.mp3', // Magic Flip
            'IMPACT': 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Explosion
            'CLICK': 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',  // UI Tick
            'SLIDE': 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3',  // Spy Move
            'SURGE': 'https://assets.mixkit.co/active_storage/sfx/2580/2580-preview.mp3'   // Power Up
        };

        this.cache = new Map();
        this.enabled = false;
        this.masterVolume = 0.6;

        this.init();
    }

    /**
     * Preloads all audio and listens for the first user interaction 
     * to bypass browser autoplay restrictions.
     */
    init() {
        Object.entries(this.manifest).forEach(([key, url]) => {
            const audio = new Audio(url);
            audio.preload = 'auto';
            audio.load();
            this.cache.set(key, audio);
        });

        // Unlock audio on first click/touch
        const unlock = () => {
            this.enabled = true;
            console.log("AudioManager: Audio Unlocked");
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
        };

        window.addEventListener('click', unlock);
        window.addEventListener('touchstart', unlock);
    }

    /**
     * Plays a sound effect with a specific volume and clone logic 
     * to allow overlapping sounds (pooling).
     */
    play(key, volume = 1.0) {
        if (!this.enabled || !this.cache.has(key)) return;

        const sound = this.cache.get(key);
        
        // Clone for overlapping playback (e.g., 3 reveals at once)
        const playback = sound.cloneNode();
        playback.volume = volume * this.masterVolume;
        
        playback.play().catch(err => {
            console.warn(`AudioManager: Playback blocked for ${key}`, err);
        });

        // Memory Management: Remove node after play
        playback.onended = () => {
            playback.remove();
        };
    }

    /**
     * Global volume control for settings menu
     */
    setMasterVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
    }
}
