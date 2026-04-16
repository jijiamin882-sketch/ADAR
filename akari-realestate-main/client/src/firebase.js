import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ==========================================
// استبدلنا هذا الجزء فقط ببياناتك الجديدة
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAi9tA04LMnzlqCCtfypzeFBVyJ6zB_QEE",
  authDomain: "adar-real-estate-4de68.firebaseapp.com",
  projectId: "adar-real-estate-4de68",
  storageBucket: "adar-real-estate-4de68.firebasestorage.app",
  messagingSenderId: "839321922914",
  appId: "1:839321922914:web:ab97b57daaf4edfb8f103b"
};
// ==========================================

const app = initializeApp(firebaseConfig);

// التصدير (لا تغير فيها شيئاً لكي يعمل الموقع)
 
export const db = getDatabase(app);      
export const auth = getAuth(app);
export const firestoreDB = getFirestore(app); 
export const imageStorage = getStorage(app);