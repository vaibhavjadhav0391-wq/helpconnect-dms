import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-csvDZFdAIfPNjnnVNB15vhCmwCbqrl4",
  authDomain: "social-e66c5.firebaseapp.com",
  projectId: "social-e66c5",
  storageBucket: "social-e66c5.firebasestorage.app",
  messagingSenderId: "767962531764",
  appId: "1:767962531764:web:6921906a054d5b46b754e1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
