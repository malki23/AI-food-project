var loader1 = document.getElementById("preloaderlogin");

function undisplayloader() {
    loader1.style.display = "none";
}

const wait2Seconds = new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, 0);
});

const waitForLoad = new Promise((resolve) => {
    window.addEventListener("load", () => {
        resolve();
    });
});

Promise.all([wait2Seconds, waitForLoad]).then(() => {
    undisplayloader();
});

const togglePassword = document.querySelector("#lock");
const password = document.querySelector("#passSi");


togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("bi-eye");
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, update, child, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);

const numtoday = [

    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]








BtnSignIn.addEventListener('click', (e) => {
    e.preventDefault();


    var email = document.getElementById('emailSi').value;
    var password = document.getElementById('passSi').value;

    if (!(checkInfo())) {
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const dt = new Date();
            const minutzformatted = dt.getMinutes() < 10 ? "0" + dt.getMinutes().toString() : dt.getMinutes().toString()
            const dateData = numtoday[dt.getDay()] + " the " + dt.getDate().toString() + "/" + (dt.getMonth() + 1).toString() + " at " + dt.getHours().toString() + ":" + minutzformatted


            const userId = user.uid;
            const dbRef = ref(getDatabase());
            get(child(dbRef, `users/${userId}`)).then((snapshot) => {
                if (snapshot.exists()) {



                    update(ref(database, 'users/' + user.uid), {

                        last_login: snapshot.val()?.current_login ? snapshot.val()?.current_login : dateData + " first login",
                        current_login: dateData

                    })

                }
                else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });



            notify("success", "user loged in");
            setTimeout(() => {
                window.location.replace("../html/index.html");
            }, 1000)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const pass2 = document.getElementById('passSi');
            const email2 = document.getElementById('emailSi');
            email2.style.borderBottom = "2px solid red";
            pass2.style.borderBottom = "2px solid red";

            notify("error", authErrorToTitleCase(errorCode));
        });

});

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // window.location.href="index.html";
        // ...
    } else {
        // User is signed out
        // ...
    }
});

// logout.addEventListener('click', (e) => {


//     signOut(auth).then(() => {
//         alert('user loged out ')
//     }).catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         alert('Please try again')
//     });
// });
function authErrorToTitleCase(str) {
    return str
        ?.replaceAll("auth/", "")
        ?.replaceAll("-", " ")
        ?.split(" ")
        ?.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        ?.join(" ");
}


function checkInfo() {
    const pass = document.getElementById('passSi').value;
    const email = document.getElementById('emailSi').value;
    const pass2 = document.getElementById('passSi');
    const email2 = document.getElementById('emailSi');

    if (email != '') {

        email2.style.borderBottom = "1px solid #1b9476";
    }

    if (pass != '') {

        pass2.style.borderBottom = "1px solid #1b9476";
    }


    if (email == '') {
        notify("info", "Please enter your email address");
        email2.style.borderBottom = "2px solid red";
    }

    else if (pass == '') {
        notify("info", "Please enter your password");
        pass2.style.borderBottom = "2px solid red";
    }


    else {

        return true;
    }

}

const accountDetails = document.querySelector('.account-details')



BtnGoogleSignup.addEventListener('click', (e) => {



    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;


            const dt = new Date();
            const minutzformatted = dt.getMinutes() < 10 ? "0" + dt.getMinutes().toString() : dt.getMinutes().toString()
            const hourzformatted = dt.getHours() < 10 ? "0" + dt.getHours().toString() : dt.getHours().toString()
            const dateData = numtoday[dt.getDay()] + " the " + dt.getDate().toString() + "/" + (dt.getMonth() + 1).toString() + " at " + hourzformatted + ":" + minutzformatted

            const userId = user.uid;
            const dbRef = ref(getDatabase());
            get(child(dbRef, `users/${userId}`)).then((snapshot) => {
                if (snapshot.exists()) {



                    update(ref(database, 'users/' + user.uid), {



                        fullName: user.displayName,
                        email: user.email,
                        photo: user.photoURL,
                        last_login: snapshot.val()?.current_login ? snapshot.val()?.current_login : dateData + " first login",
                        current_login: dateData


                    })



                }



                else {
                    set(ref(database, 'users/' + user.uid), {



                        fullName: user.displayName,
                        email: user.email,
                        photo: user.photoURL,
                        last_login: snapshot.val()?.current_login ? snapshot.val()?.current_login : dateData + " first login",
                        current_login: dateData


                    })
                }
            }).catch((error) => {
                console.error(error);
            });








            //form.classList.remove('PassMatchText')
            notify("success", user.displayName + " loged successfuly")
            setTimeout(() => {
                window.location.replace("../html/index.html");
            }, 1000)


            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            // const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);

            alert(errorMessage)
            // ...
        });


    // signInWithRedirect(auth, provider);
    // getRedirectResult(auth)
    // .then((result) => {
    //   // This gives you a Google Access Token. You can use it to access Google APIs.
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   const token = credential.accessToken;

    //   // The signed-in user info.
    //   const user = result.user;
    // }).catch((error) => {
    //   // Handle Errors here.
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // The email of the user's account used.
    //   const email = error.customData.email;
    //   // The AuthCredential type that was used.
    //   const credential = GoogleAuthProvider.credentialFromError(error);
    //   // ...
    // });
});



function notify(type, message) {
    (() => {
        let n = document.createElement("div");
        let id = Math.random().toString(36).substr(2, 10);
        n.setAttribute("id", id);
        n.classList.add("notification", type);
        n.innerText = message;
        document.getElementById("notification-area").appendChild(n);
        if (type === "error") {
            var audio = new Audio('/sound/error.mp3');
            audio.play();
        }
        else if (type === "info") {
            var audio = new Audio("/sound/warning.mp3");
            audio.play();
            console.log('warning')
        }
        else if (type === "success") {
            var audio = new Audio('/sound/success.mp3');
            audio.play();
        }
        setTimeout(() => {
            var notifications = document.getElementById("notification-area").getElementsByClassName("notification");
            for (let i = 0; i < notifications.length; i--) {
                if (notifications[i].getAttribute("id") == id) {
                    notifications[i].remove();
                    break;
                }
            }
        }, 0);
    })();
}

;