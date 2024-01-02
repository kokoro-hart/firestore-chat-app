import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyCPs_2q7j6HAaon9GfGygdSsSM4TsdLHLs",
 authDomain: "firestore-chat-app-4be04.firebaseapp.com",
 projectId: "firestore-chat-app-4be04",
 storageBucket: "firestore-chat-app-4be04.appspot.com",
 messagingSenderId: "398518441507",
 appId: "1:398518441507:web:bbb1bafda408880e42c396",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
