// Service worker de Gula: siempre busca la versión más nueva en internet (sin usar copias viejas).
const CACHE="gula-v2";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["/","/index.html"])).catch(()=>{}))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  const html=e.request.mode==="navigate"||u.pathname==="/"||u.pathname.endsWith(".html")||u.pathname.endsWith(".json")||u.pathname.endsWith("sw.js");
  e.respondWith(fetch(e.request,html?{cache:"no-store"}:{}).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(u.pathname==="/"?"/":e.request,c))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("/"))));
});
