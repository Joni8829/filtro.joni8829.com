const CACHE_NAME = 'filtro-v3'; // Bump to v3 because we changed the file list
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/.assets/style.css',  // Added this
  '/.assets/script.js', // Added this
  '/Logo-256.png',
  '/Logo-512.png',
  '/camera.png',
  '/favicon.ico'
];

self.addEventListener('install', (e) => {
  // This downloads all the files above into the phone's cache
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  // This allows the app to load from the cache even when offline
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});