// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCiuKwUo1fJtWURh1GdsstcUXf4R4HvXlU",
  authDomain: "passop-6bc11.firebaseapp.com",
  projectId: "passop-6bc11",
  storageBucket: "passop-6bc11.firebasestorage.app",
  messagingSenderId: "797272661948",
  appId: "1:797272661948:web:862807ad36e0a16cce15b9",
  measurementId: "G-8QY56MK3QC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Payload background: " , payload);
    self.registration.showNotification(payload.data.title, {
        body: payload.data.body,
        icon: './icon.png'
    });
});
