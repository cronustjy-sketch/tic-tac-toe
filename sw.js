var CACHE='cronus-games-v12';
var ASSETS=['/','/index.html','/manifest.json','/icon-192.png','/icon-512.png'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  var url=e.request.url;
  if(url.indexOf('workers.dev')!==-1 || url.indexOf('piesocket')!==-1){ return; }
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).then(function(resp){
        return resp;
      }).catch(function(){ return caches.match('/index.html'); });
    })
  );
});
