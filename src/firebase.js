import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyA626V0HeaBfdiJGZjQ5MfIimoRRmdR5p0",
    authDomain: "hafiz-enterprises-20f0b.firebaseapp.com",
    projectId: "hafiz-enterprises-20f0b",
    storageBucket: "hafiz-enterprises-20f0b.appspot.com",
    messagingSenderId: "844442854967",
    appId: "1:844442854967:web:9ac6511760347da2ed01b2",
    measurementId: "G-24C9ECEZFT"
  };
  initializeApp(firebaseConfig);

  const messaging = getMessaging();
  export const requestForToken = async () => {
    try {
          // eslint-disable-next-line no-unused-vars
          const currentToken = await getToken(messaging, { vapidKey: "BLz3ZKIvnUYIl5foY49sGj2C5HaYOWWkHTlGuFJwG-K8FEZYN7y03Gf4oO_UQ4gOcfxVAWsQujh5cJ3j2dmhx1A" });
        console.log(currentToken);
        } catch (err) {
          console.log('An error occurred while retrieving token. ', err);
      }
  };
  export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });