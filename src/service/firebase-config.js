// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHZIJMoAbPBnFx10lMAwN6hB3Uhd2mpGk",
  authDomain: "fir-app-project-570db.firebaseapp.com",
  projectId: "fir-app-project-570db",
  storageBucket: "fir-app-project-570db.firebasestorage.app",
  messagingSenderId: "693382005476",
  appId: "1:693382005476:web:c7a8f099c9fbc8887da2f1",
  measurementId: "G-3NVDJH7EK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore and Storage instances
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
