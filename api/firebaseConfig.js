// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKrOGp3tOJTJCXG8QPogxo0Ui0BuflE58",
  authDomain: "capstoneproject211-dd257.firebaseapp.com",
  projectId: "capstoneproject211-dd257",
  storageBucket: "capstoneproject211-dd257.firebasestorage.app",
  messagingSenderId: "684233915236",
  appId: "1:684233915236:web:168525c702717b7d181871",
  measurementId: "G-SGYBFCKXB9"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
