const FILES_TO_CACHE = [
  '/',
  '/index.html',
  'index.js',
  'manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
  'service-worker.js',
  'styles.css',
  'db.js',
]

const CACHE_NAME = 'static-cache-v1'
const DATA_CACHE_NAME = 'data-cache-v1'

// install serviceworker
self.addEventListener("install", function(evt) {
  console.log('service worker installed')
  evt.waitUntil(
  caches.open(CACHE_NAME).then(cache => {
    console.log('caching files')
cache.addAll(FILES_TO_CACHE)
  }))
    })
  
//activate service worker
self.addEventListener('activate', evt =>{
  console.log ('service worker activated')
  evt.waitUntil(
    caches.keys().then(keys => {
    return Promise.all(keys
      .filter(key => key !== CACHE_NAME)
    .map(key => caches.delete(key)))
  }))
})

//created fetch event when getting stuff from server
self.addEventListener('fetch', evt =>{
  //console.log('fetch event',evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes =>{
      return cacheRes || fetch(evt.request);
    })
  );
})