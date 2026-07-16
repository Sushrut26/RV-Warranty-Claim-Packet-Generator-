// Minimal offline-first service worker. The whole app runs client-side, so once
// the shell is cached the tool keeps working with no signal — handy standing next
// to an RV in a storage lot.
//
// Paths are derived from the worker's own location so this works whether the app
// is served from "/" (Vercel/local) or a repo subpath (GitHub Pages).

const CACHE = "rv-claim-v2";
const BASE = new URL("./", self.location).pathname; // "/" or "/RV-.../"
const APP_SHELL = [BASE, BASE + "manifest.json", BASE + "icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Network-first for navigations (so updates land), falling back to cache offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((r) => r || caches.match(BASE))
        )
    );
    return;
  }

  // Cache-first for everything else (Next static assets are content-hashed).
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return res;
        })
    )
  );
});
