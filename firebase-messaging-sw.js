// Service worker khusus notifikasi push. Letakkan di folder yang sama dengan index.html.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (_) { p = {}; }
  const d = p.data || p.notification || p;
  const title = d.title || "Mie Ayam Soleh";
  const body = d.body || "Ada perubahan data";
  e.waitUntil(self.registration.showNotification(title, { body, icon: "icon-192.png", badge: "icon-192.png", data: { url: "./" } }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      return self.clients.openWindow("/");
    })
  );
});
