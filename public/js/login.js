// firebase-auth.js

import firebase from "firebase";
import "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMuymXKCQ3qdCc0OoFLAJocB7OJAuqgaA",
  authDomain: "express-auth-71381.firebaseapp.com",
  projectId: "express-auth-71381",
  storageBucket: "express-auth-71381.appspot.com",
  messagingSenderId: "361663031242",
  appId: "1:361663031242:web:3010b4e632f20be7719133",
};

firebase.initializeApp(firebaseConfig);

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    console.log("User logged in:", user.uid);
    // Redirect user or perform other actions upon successful login
  } catch (error) {
    console.error("Login failed:", error.message);
  }
});
