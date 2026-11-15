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
    icon: '/tsm-gem/favicon.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
