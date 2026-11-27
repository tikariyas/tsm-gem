importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const TSM_CACHE = 'tsm-music-shell-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(TSM_CACHE).then((cache) =>
      cache.addAll([
        './',
        './index.html',
        './manifest.webmanifest',
        './icon-192.png',
        './icon-512.png'
      ]).catch(() => {})
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('tsm-music-shell-') && k !== TSM_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Network-first fetch handler scoped strictly to this subdirectory (./) so Android Chrome
// recognizes this app as a distinct installable WebAPK separate from root tikariyas.github.io
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(TSM_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

firebase.initializeApp({
  apiKey: "AIzaSyD6UUHQL7hcWxvnOIFIzVxOPPU0wrSojFQ",
  authDomain: "tikariya-music---foundation.firebaseapp.com",
  projectId: "tikariya-music---foundation",
  storageBucket: "tikariya-music---foundation.firebasestorage.app",
  messagingSenderId: "869254236044",
  appId: "1:869254236044:web:fb6f5fccca9129cc4d78a9"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification && payload.notification.title ? payload.notification.title : "TIKARIYA'S SCHOOL OF MUSIC";
  const notificationOptions = {
    body: payload.notification && payload.notification.body ? payload.notification.body : "New update",
    icon: './icon-192.png',
    data: { url: (payload.data && payload.data.url) || './' }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
