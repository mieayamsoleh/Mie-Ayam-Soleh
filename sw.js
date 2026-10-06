// Service worker aplikasi: selalu ambil versi terbaru dari internet, cadangan dari cache kalau offline.
// Juga menampilkan notifikasi push (FCM) saat aplikasi ditutup / di latar belakang.
const CACHE = "mie-ayam-v20261006";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Firebase, Google, dll. tidak disentuh
  e.respondWith(
    fetch(req, { cache: "no-cache" })
      .then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html")))
  );
});

// ---- Notifikasi push (format pesan FCM) ----
self.addEventListener("push", e => {
  let payload = {};
  try { payload = e.data ? e.data.json() : {}; } catch (_) {
    try { payload = { notification: { body: e.data.text() } }; } catch (__) {}
  }
  const n = payload.notification || {};
  const d = payload.data || {};
  const title = n.title || d.title || "Mie Ayam Soleh";
  const body = n.body || d.body || "Ada aktivitas baru.";
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: n.icon || "img/logo.png",
      badge: "img/logo.png",
      tag: "mie-ayam-soleh",
      data: d
    })
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      return clients.openWindow("./");
    })
  );
});
