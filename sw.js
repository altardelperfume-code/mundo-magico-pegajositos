// Service worker: guarda la aventura para jugar sin conexión.
const CACHE = 'pegajositos-v2';
const SHELL = ['./', 'assets/amigos/bobi.webp', 'assets/amigos/fermin.webp', 'assets/amigos/head-sun.webp', 'assets/amigos/malory.webp', 'assets/amigos/many.webp', 'assets/amigos/polix.webp', 'assets/amigos/pupilo.webp', 'assets/amigos/team-jukilop.webp', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/maskable-512.png', 'assets/logo-colegio.webp', 'assets/mundo/bienvenida.webp', 'assets/mundo/mapa.webp', 'assets/personajes/aquarius.webp', 'assets/personajes/celestial.webp', 'assets/personajes/chochito.webp', 'assets/personajes/gatiamor.webp', 'assets/personajes/hielosi.webp', 'assets/personajes/popi.webp', 'assets/personajes/romina.webp', 'assets/personajes/rosebell.webp', 'css/styles.css', 'index.html', 'js/activities.js', 'js/app.js', 'js/audio.js', 'js/data.js', 'js/state.js', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Primero la red (para ver siempre la versión nueva); si no hay conexión, la copia guardada.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match('./')))
  );
});
