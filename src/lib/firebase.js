// src/lib/firebase.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDH1G1xq1NuN_8NxfDkykNAttCpBd7L4PE",
    authDomain: "next-js-expence-tracker.firebaseapp.com",
    projectId: "next-js-expence-tracker",
    storageBucket: "next-js-expence-tracker.appspot.com",
    messagingSenderId: "825967899254",
    appId: "1:825967899254:web:4ecfa322da58c32dd6e557",
    measurementId: "G-RL3KEKQ87M"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

export { db };
