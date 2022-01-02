/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyA626V0HeaBfdiJGZjQ5MfIimoRRmdR5p0",
    authDomain: "hafiz-enterprises-20f0b.firebaseapp.com",
    projectId: "hafiz-enterprises-20f0b",
    storageBucket: "hafiz-enterprises-20f0b.appspot.com",
    messagingSenderId: "844442854967",
    appId: "1:844442854967:web:9ac6511760347da2ed01b2",
    measurementId: "G-24C9ECEZFT"
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  console.log(notificationTitle);
  console.log(notificationOptions);
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});