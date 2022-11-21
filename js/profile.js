import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut ,GoogleAuthProvider ,signInWithRedirect,getRedirectResult,signInWithPopup} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app);


const logOut = document.getElementById('logOut');
const home = document.getElementById('home');
const mergeAccounts = document.getElementById('mergeAccounts');
const modifyAccount = document.getElementById('modifyAccount');
const displayNameHolder = document.getElementById('displayNameHolder');
const photoHolder = document.getElementById('photoHolder');



logOut.addEventListener('click', () => {
    //signOut() is a built in firebase function responsible for signing a user out
    auth.signOut()
    .then(() => {
        window.location.assign('../html/signup.html');
    })
    .catch(error => {
        console.error(error);
    })
})

home.addEventListener('click', () => {
    //signOut() is a built in firebase function responsible for signing a user out
        window.location.assign('../html/index.html');
  
})

auth.onAuthStateChanged(user => {
    console.log(user);
    //display the displayName and photoURL of the user on the page
    if(user.displayName)
        displayNameHolder.innerText = user.displayName;
    if(user.photoURL)
        photoHolder.setAttribute('src', user.photoURL);
})

//Go to modification page
modifyAccount.addEventListener('click', () => {
    window.location.assign("../html/edit.html");
});

//Go to merge accounts page
// mergeAccounts.addEventListener('click', () => {
//     window.location.assign('../merge');
// });