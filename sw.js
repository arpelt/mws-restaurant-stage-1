
let cacheName = "offline-cache-v2";
let oldCacheName = "offline-cache-v1";

/**
Adds the eventlistener for the install event. This is executed after the new 
service worker is successfully registered in index.html or restaurant.html file.
Creates a new cache and prefetch resources to the cache.
If one or more resource fails, no resources are cached.
*/
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("Service worker " + cacheName + " installing...");
      return cache.addAll([
        "index.html",
        "restaurant.html",
        "css/styles.css",
        "js/dbhelper.js",
        "js/main.js",
        "js/tab_nav.js",
        "data/restaurants.json",
        "img/1.jpg",
        "img/2.jpg",
        "img/3.jpg",
        "img/4.jpg",
        "img/5.jpg",
        "img/6.jpg",
        "img/7.jpg",
        "img/8.jpg",
        "img/9.jpg",
        "img/10.jpg",
        "img/error.png",
        "img/offline.png",
        "https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png",
        "https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png",
        "https://unpkg.com/leaflet@1.3.1/dist/leaflet.css",
        "https://unpkg.com/leaflet@1.3.1/dist/leaflet.js",
        "manifest.json",
        "img/icon-192.png",
        "img/icon-512.png",
        "img/favicon-32x32.png",
        "img/favicon-16x16.png",
        "img/safari-pinned-tab.svg",
        "img/apple-touch-icon.png"
      ])
      .then(() => {
        console.log("Service worker " + cacheName + " installed successfully.");
      })
      .catch((failure) => {
        console.error("Service worker " + cacheName + " installation failed with",failure)
      });
    })
  );
});
  
/**
This is just a simple solution for deleting the old service worker (previous version).
This is executed when the new service worker is installed. If there is currently contolling
service worker available and the new service worker is waiting for activation state.
The currently controlling service worker is deleted and the new installed service worker
takes control of pages.
*/
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.delete(oldCacheName)
      .then((cacheFound) => {
        if (cacheFound) {
          console.log("Old cache " + oldCacheName + " deleted.");
        }
      })
   );
});
    
/**
Adds the eventlistener for the fetch event, then prevents the browser's default fetch 
handling. When the GET method is sent from the browser, the cache will be opened 
and checked if there is a match for the request/response pair found. 
If the match found the service worker sends this response to the browser, otherwise 
the request is sent to the network and this network response is used as 
a response to the browser. The request which is sent to the network 
is cloned (request/response pair) and cached for later use. 
If there is an error in response, a custom error page is showed to the user instead of 
the browser's default error page.
*/
self.addEventListener("fetch", (event) => {
  event.respondWith(
   caches.open(cacheName)
    .then((cache) => {
      return cache.match(event.request)
      .then((response) => {
        if (response) {
          console.log("Cache resource");
          return response;
        }
        else {
          return fetch(event.request)
          .then((response) => {
            if (response.status >= 400) {
            //return new Response("Something went wrong.");
            return cache.match("img/error.png");
            }
            console.log("Network resource");
            cache.put(event.request, response.clone());
            return response;
          })
          .catch((failure) => {
            console.log(failure);
            //return new Response("You are offline.");
            return cache.match("img/offline.png");
          });
        }
      });
    })
  );
});
