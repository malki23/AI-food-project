
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import {getAuth ,  createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyAs8wqzfMoB1fx1cbwKDUJ5HH9pZmGeaSM",
  authDomain: "iot-project-of-malki.firebaseapp.com",
  databaseURL: "https://iot-project-of-malki-default-rtdb.firebaseio.com",
  projectId: "iot-project-of-malki",
  storageBucket: "iot-project-of-malki.appspot.com",
  messagingSenderId: "1042946587373",
  appId: "1:1042946587373:web:600231fca71a206df16ae4",
  measurementId: "G-4B1MKYBMK4"
};
const app = firebase.initializeApp(firebaseConfig)
const auth = getAuth()

function createUser() {
  mail = document.getElementById("emailSU").value;
  pass = document.getElementById("passSU").value;
  signUp(mail, pass);
}

function signUp(mail, pass) {
  auth
    .createUserWithEmailAndPassword(mail, pass)
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
}
