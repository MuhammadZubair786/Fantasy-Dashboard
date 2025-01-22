// Import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKscZie5dqmEaWMfPhu_KsxY1hKhAU3nE",
  authDomain: "fantasy-app-ff2b6.firebaseapp.com",
  projectId: "fantasy-app-ff2b6",
  storageBucket: "fantasy-app-ff2b6.firebasestorage.app",
  messagingSenderId: "208149025123",
  appId: "1:208149025123:web:7cafe94046dcfced92c356"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore and Storage instances
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
