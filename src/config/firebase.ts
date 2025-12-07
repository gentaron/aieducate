import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_PLACEHOLDER_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "0000000000",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:00000000:web:00000000"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
