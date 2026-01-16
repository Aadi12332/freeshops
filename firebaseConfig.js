import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVfjp0NUw9-3GTLh-pjG2WXZbTMIKdSOI",
  authDomain: "mamunrazaapp.firebaseapp.com",
  projectId: "mamunrazaapp",
  storageBucket: "mamunrazaapp.firebasestorage.app",
  messagingSenderId: "683258032591",
  appId: "1:683258032591:web:a879dd23d1af4a0808a2ba",
  measurementId: "G-QYCQ8FXSTF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const analytics = getAnalytics(app);

export { db,storage };
