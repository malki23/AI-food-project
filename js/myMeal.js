
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, update, get, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";


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

const ip_text = document.getElementById('ip')


const dbRef = ref(getDatabase());
get(child(dbRef, `test2/`)).then((snapshot) => {
  if (snapshot.exists()) {
    // const captureIp = "http://" + snapshot.val().photo.substring(0, snapshot.val().photo.length - 9) + "/capture";
    const captureIp = "http://" +  snapshot.val().photo.substring(0, snapshot.val().photo.length - 10) + "/capture";

    console.log(captureIp)
    const ip = "http://" + snapshot.val().photo;//http://127.0.0.1/iot-project/html/10.9.24.125:81/stream
    ip_text.innerText = ip;
    const imgURL = document.getElementById("imgEsp")
    imgURL.src =  ip
    
    console.log(ip)
    // imgEsp.setAttribute('src', ip);

  } else {
    notify("error", "No data available");
  }
}).catch((error) => {
  console.error(error);
});





















// async function postData(url = "", data = {}) {
//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + "106d98e090b1e31141ed514ca984fa49839590c2",
//     },
//   });
//   return response.json();
// }

// postData("https://api.logmeal.es/v2/custom_recipe", {
//   answer: 42,
// })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });




// async function postData(url = '', data = {}) {
//   // Default options are marked with *
//   const response = await fetch(url, {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors', // no-cors, *cors, same-origin
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'same-origin', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + '8c34eb86782e14b178a4b1bbf80ef9a5b10903c9'
//     },
//     redirect: 'follow', // manual, *follow, error
//     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data) // body data type must match "Content-Type" header
//   });
//   return response.json(); // parses JSON response into native JavaScript objects
// }

// postData('https://example.com/answer', { answer: 42 })
//   .then((data) => {
//     console.log(data); // JSON data parsed by `data.json()` call
//   });



  // const body = new FormData
  // body.append("image", uploadFile(inputElement))
  
  // fetch("https://api.logmeal.es/v2/image/segmentation/complete/v1.0?language=eng", {
  //   body,
  //   headers: {
  //     Accept: "application/json",
  //     Authorization: "Bearer 8c34eb86782e14b178a4b1bbf80ef9a5b10903c9",
  //     "Content-Type": "multipart/form-data"
  //   },
  //   method: "POST"
  // })


  // export function uploadFile(inputElement) {
  //   var file = inputElement.files[0];
  //   var reader = new FileReader();
  //   reader.onloadend = function() {
  //     console.log('Encoded Base 64 File String:', reader.result);
      
  //     /******************* for Binary ***********************/
  //     var data=(reader.result).split(',')[1];
  //      var binaryBlob = Buffer.from(data, 'base64');
  //      console.log('Encoded Binary File String:', binaryBlob);
  //   }
  //   reader.readAsDataURL(file);
  //   return binaryBlob
  // }

  