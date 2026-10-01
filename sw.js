const CACHE='mie-ayam-soleh-v7';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-512-maskable.png','./img/bg-main.webp','./img/brand-logo.webp','./img/ic-03.webp','./img/ic-08.webp','./img/ic-09.webp','./img/ic-10.webp','./img/ic-11.webp','./img/ic-12.webp','./img/ic-13.webp','./img/ic-14.webp','./img/ic-15.webp','./img/ic-16.webp','./img/ic-17.webp','./img/ic-18.webp','./img/ic-19.webp','./img/ic-20.webp','./img/ic-21.webp','./img/ic-22.webp','./img/ic-23.webp','./img/ic-24.webp','./img/ic-25.webp','./img/ic-26.webp','./img/ic-27.webp','./img/ic-28.webp','./img/ic-29.webp','./img/ic-30.webp','./img/ic-31.webp','./img/ic-32.webp','./img/ic-33.webp','./img/ic-34.webp','./img/ic-35.webp','./img/ic-36.webp','./img/ic-37.webp','./img/ic-38.webp','./img/ic-39.webp','./img/ic-40.webp','./img/ic-41.webp','./img/ic-42.webp','./img/ic-43.webp','./img/ic-44.webp','./img/ic-45.webp','./img/ic-46.webp','./img/ic-47.webp','./img/ic-48.webp','./img/ic-49.webp','./img/ic-50.webp','./img/ic-51.webp','./img/ic-52.webp','./img/ic-53.webp','./img/ic-54.webp','./img/ic-55.webp','./img/ic-56.webp','./img/ic-57.webp','./img/ic-58.webp','./img/ic-59.webp','./img/ic-60.webp','./img/photo-02.webp','./img/photo-04.webp','./img/photo-05.webp','./img/splash.webp'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// Stale-while-revalidate: tampil langsung dari cache, update diam-diam di belakang layar
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return; // Firebase/gstatic dibiarkan langsung ke jaringan
  e.respondWith(caches.open(CACHE).then(async c=>{
    const key=req.mode==='navigate'?'./index.html':req;
    const cached=await c.match(key);
    const net=fetch(req).then(res=>{if(res&&res.ok)c.put(key,res.clone());return res}).catch(()=>cached);
    return cached||net;
  }));
});
