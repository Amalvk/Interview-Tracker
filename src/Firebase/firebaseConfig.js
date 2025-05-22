import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyB0hMgEA1OgB4MDrSfM4_87p2FfZe3TVf0",
  authDomain: "interviewcrack.firebaseapp.com",
  projectId: "interviewcrack",
  storageBucket: "interviewcrack.firebasestorage.app",
  messagingSenderId: "458727393445",
  appId: "1:458727393445:web:e31051e499021853b9654c",
  measurementId: "G-FZ4CMQBNY6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
