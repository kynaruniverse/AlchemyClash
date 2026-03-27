/**
 * ALCHEMY CLASH: AUDIO MANAGER
 * Handles low-latency SFX playback and sound pooling.
 */
export class AudioManager {
    constructor() {
        this.sounds = {
            'DRAG': 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Whoosh
            'SNAP': 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3', // Slam
            'REVEAL': 'https://assets.mixkit.co/active_storage/sfx/2591/2591-preview.mp3', // Magic
            'IMPACT': 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' // Explosion
        };
        this.cache = {};
        this.preload();
    }

    preload() {
        Object.keys(this.sounds).forEach(key => {
            const audio = new Audio(this.sounds[key]);
            audio.preload = 'auto';
            this.cache[key] = audio;
        });
    }

    play(key, volume = 0.5) {
        if (this.cache[key]) {
            const sfx = this.cache[key].cloneNode();
            sfx.volume = volume;
            sfx.play().catch(() => { /* Handle autoplay block */ });
        }
    }
}
