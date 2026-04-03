// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// если захочешь использовать аналитику в проде:
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCqw0FqZrw6k_3PNUWLgOcvMaiWsnrSUMY",
  authDomain: "wall-calendar-df3a1.firebaseapp.com",
  projectId: "wall-calendar-df3a1",
  storageBucket: "wall-calendar-df3a1.firebasestorage.app",
  messagingSenderId: "1069287266436",
  appId: "1:1069287266436:web:091b6125be3d53987c4ad1",
  measurementId: "G-4J0SB87955"
};

// Инициализируем приложение Firebase
const app = initializeApp(firebaseConfig);

// Firestore для хранения данных календаря
export const db = getFirestore(app);

// Если нужна аналитика только в браузере (не на сервере Vite):
// let analytics;
// if (typeof window !== "undefined") {
//   analytics = getAnalytics(app);
// }
// export { analytics };