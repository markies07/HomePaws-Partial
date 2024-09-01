// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, 
createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut,
signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLIUJh_dOuvTwqViXMFNjierCCFFUQc_g",
  authDomain: "paws-ae1eb.firebaseapp.com",
  projectId: "paws-ae1eb",
  storageBucket: "paws-ae1eb.appspot.com",
  messagingSenderId: "904708709402",
  appId: "1:904708709402:web:8459de8be799abea4705a3",
  measurementId: "G-L9N7P84NFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, provider, facebookProvider, signInWithPopup, createUserWithEmailAndPassword,
  sendEmailVerification, onAuthStateChanged, getAuth, signOut,
  signInWithEmailAndPassword, sendPasswordResetEmail, };
