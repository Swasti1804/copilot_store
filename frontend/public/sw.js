/* ---- SmartStore Copilot Service Worker ---- */
const CACHE_NAME = "smartstore-v1"

/* Pages / assets to pre-cache */
const urlsToCache = [
  "/",
  "/dashboard",
  "/inventory",
  "/drivers",
  "/sentiment",
  "/chat",
  "/login",
  "/signup",
  "/offline",
  "/icon-192x192.png",
  "/icon-512x512.png",
]

/* ----- Install ----- */
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

/* ----- Activate ----- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))),
  )
  /* Take control immediately (for first install). */
  return self.clients.claim()
})

/* ----- Fetch ----- */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then(
        (response) =>
          response ||
          fetch(event.request).catch(() =>
            event.request.destination === "document" ? caches.match("/offline") : undefined,
          ),
      ),
  )
})

/* ----- Push ----- */
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New notification from SmartStore",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
  }
  event.waitUntil(self.registration.showNotification("SmartStore Alert", options))
})

/* ----- Notification click ----- */
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow("/dashboard"))
})

/* ----- Skip-waiting handler (for in-app updates) ----- */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
