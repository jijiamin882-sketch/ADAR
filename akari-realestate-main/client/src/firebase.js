import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; 
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_4R6WhQbcr-7KTl_mX2fFGjTRlRDFewE",
  authDomain: "akari-realestate.firebaseapp.com",
  databaseURL: "https://akari-realestate-default-rtdb.firebaseio.com", 
  projectId: "akari-realestate",
  storageBucket: "akari-realestate.appspot.com",
  messagingSenderId: "771995711830",
  appId: "1:771995711830:web:5b771c99a76e505d42fef7"
};

const app = initializeApp(firebaseConfig);
// أضيفي هذا السطر إذا كان ناقصاً
export const storage = getStorage(app);

// التصدير الذي يعيد الحياة لصفحاتك القديمة:
export const db = getDatabase(app);      // هذا سيعيد الوكالات والعقارات للعمل فوراً
export const auth = getAuth(app);


// التصدير الخاص بصفحة "إضافة إعلان" الجديدة (بأسماء مختلفة لتجنب التضارب):
export const firestoreDB = getFirestore(app); 
export const imageStorage = getStorage(app);