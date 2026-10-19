/* SAMPLE v1.0.0 service worker — same-origin offline app shell only. */
const CACHE='sample-shell-v1.0.0';
const ASSETS=['./','./index.html','./app.js','./styles.css','./assets/qr.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/favicon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(k=>k.startsWith('sample-shell-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){event.respondWith((async()=>{try{const response=await fetch(req);if(response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone())}return response}catch(e){return (await caches.match('./index.html'))||Response.error()}})());return}
 event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{return await fetch(req)}catch(e){return Response.error()}})());
});
