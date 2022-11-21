function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);

var loader1 = document.getElementById("preloader");

function undisplayloader() {
  loader1.style.display = "none";
}

const wait2Seconds = new Promise((resolve) => {
  setTimeout(() => {
      resolve();
  }, 2000);
});

const waitForLoad = new Promise((resolve) => {
  window.addEventListener("load", () => {
    resolve();
  });
});

Promise.all([wait2Seconds, waitForLoad]).then(() => {
  console.log("nice");
  undisplayloader();
});

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
const user = auth.currentUser;

 

const logOut = document.getElementById('logOut');
const home = document.getElementById('home');
const mergeAccounts = document.getElementById('mergeAccounts');
const modifyAccount = document.getElementById('modifyAccount');
const displayNameHolder = document.getElementById('displayNameHolder');
const displayNameHolder1 = document.getElementById('displayNameHolder1');
const displayNameHolder2 = document.getElementById('displayNameHolder2');
const photoHolder = document.getElementById('photoHolder');
const photoHolder1 = document.getElementById('photoHolder1');
const email1=document.getElementById('email1')
const navbarSupportedContent=document.getElementById('navbarSupportedContent')


auth.onAuthStateChanged(user => {
  console.log(user);
  //display the displayName and photoURL of the user on the page
  if(user.displayName)
  {
      email1.innerText = user.email;
      displayNameHolder.innerText = user.displayName;
      displayNameHolder1.innerText = user.displayName;
      displayNameHolder2.innerText = user.displayName;
}
  if(user.photoURL)
  {
      photoHolder.setAttribute('src', user.photoURL);
      photoHolder1.setAttribute('src', user.photoURL);


}
     
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            navbarSupportedContent.classList.add('green-badge')
            // window.location.href="index.html";
            // ...
        } else {

          navbarSupportedContent.classList.remove('green-badge')
            // User is signed out
            // ...
        }
   
})

logOut.addEventListener('click', () => {
  //signOut() is a built in firebase function responsible for signing a user out
  auth.signOut()
  .then(() => {
      window.location.assign('../html/login.html');
  })
  .catch(error => {
      console.error(error);
  })
})



export function  changeTime (){
  console.log('test')
}