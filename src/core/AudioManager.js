/**
 * ALCHEMY CLASH: AAA AUDIO MANAGER - UPGRADED
 * High-performance sound layering with AudioContext, fade, and overlapping SFX support.
 */

export class AudioManager {
    constructor() {
        this.manifest = {
            'DRAG': 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
            'SNAP': 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',
            'REVEAL': 'https://assets.mixkit.co/active_storage/sfx/2591/2591-preview.mp3',
            'IMPACT': 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
            'CLICK': 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
            'SLIDE': 'https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3',
            'SURGE': 'https://assets.mixkit.co/active_storage/sfx/2580/2580-preview.mp3'
        };

        this.audioContext = null;
        this.masterGain = null;
        this.buffers = new Map();
        this.enabled = false;
        this.masterVolume = 0.6;

        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
        } catch (e) {
            console.warn("AudioManager: Web Audio API not supported, falling back to HTMLAudio.", e);
            this.audioContext = null;
        }

        // Preload audio buffers
        Object.entries(this.manifest).forEach(([key, url]) => {
            this.loadAudioBuffer(key, url);
        });

        // Unlock on first interaction
        const unlock = () => {
            this.enabled = true;
            console.log("AudioManager: Audio Unlocked");
            if (this.audioContext && this.audioContext.state === 'suspended') this.audioContext.resume();
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
        };

        window.addEventListener('click', unlock);
        window.addEventListener('touchstart', unlock);
    }

    async loadAudioBuffer(key, url) {
        if (!this.audioContext) return; // Fallback will use HTMLAudio
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.buffers.set(key, buffer);
        } catch (err) {
            console.warn(`AudioManager: Failed to load ${key}`, err);
        }
    }

    play(key, volume = 1.0, loop = false) {
        if (!this.enabled) return;

        if (this.audioContext && this.buffers.has(key)) {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.buffers.get(key);
            source.loop = loop;

            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = volume * this.masterVolume;

            source.connect(gainNode).connect(this.masterGain);
            source.start(0);
        } else if (!this.audioContext) {
            // Fallback to HTMLAudio
            const audio = new Audio(this.manifest[key]);
            audio.volume = volume * this.masterVolume;
            audio.loop = loop;
            audio.play().catch(err => console.warn(`AudioManager: Playback blocked for ${key}`, err));
        }
    }

    fadeVolume(targetVolume = 1.0, duration = 1.0) {
        if (!this.masterGain) return;
        const current = this.masterGain.gain.value;
        const diff = targetVolume - current;
        const steps = 30;
        let i = 0;
        const interval = setInterval(() => {
            i++;
            this.masterGain.gain.value = current + (diff * (i / steps));
            if (i >= steps) clearInterval(interval);
        }, duration * 33); // ~30fps
    }

    setMasterVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.masterGain) this.masterGain.gain.value = this.masterVolume;
    }
}