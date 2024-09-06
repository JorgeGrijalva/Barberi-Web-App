/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDt3zjCrQuVXHAF0jegYviSqfN4lIqVo4c",
  authDomain: "barberi-e15ce.firebaseapp.com",
  projectId: "barberi-e15ce",
  storageBucket: "barberi-e15ce.appspot.com",
  messagingSenderId: "216141489123",
  appId: "1:216141489123:web:09bb56f3db3bc63e5df6d6",
  measurementId: "G-12H7BTJPNB",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
