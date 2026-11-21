importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

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
    data: { url: (payload.data && payload.data.url) || '/' }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
