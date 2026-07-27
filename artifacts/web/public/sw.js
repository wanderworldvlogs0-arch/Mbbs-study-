// Minimal service worker: just enough for PWA installability
// (Chrome/Android + PWABuilder require one to be registered).
// Deliberately simple — caches the built static shell, always goes to the
// network first, and never touches /api requests (auth/session data must
// always be fresh).

const CACHE_NAME = "drtragicmfa-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never intercept API calls — always hit the network directly.
  if (url.pathname.startsWith("/api")) return;
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
