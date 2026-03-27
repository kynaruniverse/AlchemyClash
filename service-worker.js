/**
 * ALCHEMY CLASH: SERVICE WORKER (PWA)
 * Enables offline play and high-speed asset loading.
 */

const CACHE_NAME = 'alchemy-clash-v1';

// List of critical assets to "Install" on the device
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './src/main.js',
    './src/core/Engine3D.js',
    './src/core/CardFactory.js',
    './src/core/AudioManager.js',
    './src/game/CardData.js',
    './src/game/DuelManager.js',
    './src/game/AIManager.js',
    './src/game/AbilityManager.js',
    './src/game/InputSystem.js',
    './src/game/VFXManager.js',
    './src/game/Environment.js',
    './src/ui/Interface.js',
    './src/ui/DeckBuilder.js',
    './manifest.json'
];

// 1. Install Event: Cache all core engine files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Caching Game Assets...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. Activate Event: Cleanup old versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Fetch Event: Intercept network requests
self.addEventListener('fetch', (event) => {
    // Strategy: Cache-First, falling back to Network
    // This makes the game load instantly after the first visit
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                // Optionally cache new assets (like external card art) on the fly
                return caches.open(CACHE_NAME).then((cache) => {
                    if (event.request.url.startsWith('http')) {
                        cache.put(event.request, fetchResponse.clone());
                    }
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // If both fail (offline and not in cache), return nothing
            console.warn('SW: Asset not found in cache or network.');
        })
    );
});
