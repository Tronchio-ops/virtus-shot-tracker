const CACHE_NAME = "virtus-shot-tracker-v3"; // se vuoi forzare update, cambia v3 -> v4
const ASSETS = [
  "/virtus-shot-tracker/",
  "/virtus-shot-tracker/index.html",
  "/virtus-shot-tracker/manifest.webmanifest",
  "/virtus-shot-tracker/icon-192.png",
  "/virtus-shot-tracker/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return res;
          })
          .catch(() => caches.match("/virtus-shot-tracker/"))
      );
    })
  );
});
