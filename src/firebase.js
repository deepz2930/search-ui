import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjD10TMI2yYbxaLo1rAOhcL8u2QSES1Kc",
  authDomain: "madebydeepika-1530.firebaseapp.com",
  projectId: "madebydeepika-1530",
  storageBucket: "madebydeepika-1530.firebasestorage.app",
  messagingSenderId: "1056516558739",
  appId: "1:1056516558739:web:0c8076c0550b81e151a266"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
