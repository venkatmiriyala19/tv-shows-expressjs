// Import Firebase SDK modules
import firebase from "https://cdn.jsdelivr.net/npm/firebase@10.12.1/compat/app.js";
import "https://cdn.jsdelivr.net/npm/firebase@10.12.1/compat/auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMuymXKCQ3qdCc0OoFLAJocB7OJAuqgaA",
  authDomain: "express-auth-71381.firebaseapp.com",
  projectId: "express-auth-71381",
  storageBucket: "express-auth-71381.appspot.com",
  messagingSenderId: "361663031242",
  appId: "1:361663031242:web:3010b4e632f20be7719133",
};

firebase.initializeApp(firebaseConfig);

// Get the currently signed-in user
var user = firebase.auth().currentUser;

if (user) {
  // User is signed in.
  var email = user.email;
  document.getElementById("userEmail").innerText = "Logged in as: " + email;
} else {
  // No user is signed in.
  document.getElementById("userEmail").innerText =
    "No user is currently logged in.";
}
