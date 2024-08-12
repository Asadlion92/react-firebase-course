import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlQpzyQgdWGrEUT25wINodhZ0wVEcQlPo",
  authDomain: "fir-course-2-1ab38.firebaseapp.com",
  projectId: "fir-course-2-1ab38",
  storageBucket: "fir-course-2-1ab38.appspot.com",
  messagingSenderId: "130585791451",
  appId: "1:130585791451:web:c664a0359b7c4f829b75fe",
  measurementId: "G-0ZP42WF2NR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);