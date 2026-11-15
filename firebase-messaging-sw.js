importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD6UUHQL7hcWxvnOIFIzVxOPPU0wrSojFQ",
  authDomain: "tikariya-music---foundation.firebaseapp.com",
  projectId: "tikariya-music---foundation",
  storageBucket: "tikariya-music---foundation.firebasestorage.app",
  messagingSenderId: "869254236044",
  appId: "1:869254236044:web:fb6f5fccca9129cc4d78a9",
  measurementId: "G-0HC5PTKZQ3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "TIKARIYA'S SCHOOL OF MUSIC";
  const body = (payload.notification && payload.notification.body) || "New academy update";
  self.registration.showNotification(title, {
    body: body,
    tag: "tsm-fcm-bg",
    renotify: true,
    data: { url: "/tsm-gem/" }
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('/tsm-gem/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/tsm-gem/');
      }
    })
  );
});
