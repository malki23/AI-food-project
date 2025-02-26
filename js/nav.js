function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
      //  if (reveals[i]?.tagName.toLowerCase()==="p")
      //  {
      //   reveals[i].classList.add("typewriter");
      //  }

    } else {
      reveals[i].classList.remove("active");
      //   if (reveals[i]?.tagName.toLowerCase()==="p")
      //  {
      //   reveals[i].classList.remove("typewriter");
      //  }
    }
  }
}

window.addEventListener("scroll", reveal);

function typing() {
  var reveals = document.querySelectorAll(".writing");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 0;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("typewriter");
      //  if (reveals[i]?.tagName.toLowerCase()==="p")
      //  {
      //   reveals[i].classList.add("typewriter");
      //  }

    } else {
      reveals[i].classList.remove("typewriter");
      //   if (reveals[i]?.tagName.toLowerCase()==="p")
      //  {
      //   reveals[i].classList.remove("typewriter");
      //  }
    }
  }
}

window.addEventListener("scroll", typing);



var loader1 = document.getElementById("preloader");

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

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, update, get, child } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getAuth, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

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
const storage = getStorage(app)
const auth = getAuth(app);
const user = auth.currentUser;
const numtoday = [

  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]


const logOut = document.getElementById('logOut');
const home = document.getElementById('home');
const mergeAccounts = document.getElementById('mergeAccounts');
const modifyAccount = document.getElementById('modifyAccount');
const displayNameHolder = document.getElementById('displayNameHolder');
const displayNameHolder1 = document.getElementById('displayNameHolder1');
const displayNameHolder2 = document.getElementById('displayNameHolder2');
const displayNameHolder3 = document.getElementById('displayNameHolder3');
const photoHolder = document.getElementById('photoHolder');
const photoHolder1 = document.getElementById('photoHolder1');
const photoHolder2 = document.getElementById('photoHolder2');
const email1 = document.getElementById('email1')
const navbarSupportedContent1 = document.getElementById('navbarSupportedContent1')
const navbarSupportedContent = document.getElementById('navbarSupportedContent')
const lastLogin = document.getElementById('lastLogin')
const navBar = document.getElementById('navBar')
const mailField = document.getElementById('mail');
const passwordField = document.getElementById('newPass');
const displayNameField = document.getElementById('newName');
const photoField = document.getElementById('photo');
const labels = document.getElementsByTagName('label');
const backButton = document.getElementById('back');
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');
const newUrl = document.getElementById('newPic');
const newName = document.getElementById('newName');
let file



// const dt = new Date();
// const minutzformatted = dt.getMinutes() < 10 ? "0" + dt.getMinutes().toString() : dt.getMinutes().toString()
// const dateData = dt.getDate().toString() + "/" + (dt.getMonth()+1).toString() + " - " + dt.getHours().toString() + ":" + minutzformatted +  " , " +  numtoday[dt.getDay()]




auth.onAuthStateChanged(user => {

  //display the displayName and photoURL of the user on the page
  if (user.displayName) {

    const userId = user.uid;
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const dt = snapshot.val().last_login;
        lastLogin.innerText = dt;
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });


    email1.innerText = user.email;
    //  displayNameHolder.innerText = user.displayName;
    displayNameHolder1.innerText = user.displayName;
    displayNameHolder2.innerText = user.displayName;

  }
  if (user.photoURL) {

    photoHolder.setAttribute('src', user.photoURL);
    photoHolder1.setAttribute('src', user.photoURL);
    https://res.cloudinary.com/demo/image/upload/ar_1.0,c_thumb,g_face,w_0.6,z_0.7/r_max/co_brown,e_outline/co_grey,e_shadow,x_30,y_55/actor.png

    fetch(` https://res.cloudinary.com/dckjdb9ul/image/fetch/b_rgb:00000000,c_crop,g_face,h_800,w_800/r_max/c_scale,w_200/${user.photoURL}`).then((resp) => {
      photoHolder2.setAttribute('href', resp.url);


    }
    ).catch((error) => {

      console.log(error);
    })

  }


  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    navbarSupportedContent.classList.add('green-badge')
    navbarSupportedContent1.classList.remove('loginLink')
    // window.location.href="index.html";
    // ...
  } else {

    navbarSupportedContent1.classList.add('loginLink')
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








const photoHolder6 = document.getElementById('photoHolder6');



// The user object has basic properties such as display name, email, etc.




newUrl.addEventListener("change", (e) => {
  console.log(e.target.files[0]);
  file = e.target.files[0]
})


auth.onAuthStateChanged(user => {

  //display the displayName and photoURL of the user on the page

  if (user.photoURL) {
    photoHolder6.setAttribute('src', user.photoURL);
    newUrl.setAttribute('value', user.photoURL);
  }

  if (user.displayName)
    newName.setAttribute('value', user.displayName);
})

const editInformation = (e) => {
  e.preventDefault();

  const newNameAndPhoto = {
    newDisplayName: newName.value,
    newPhotoURL: file,
  };
  //  const newEmail = mailField.value;
  const newPassword = passwordField.value;
  //Holds all the information about the current signed in user
  const user = auth.currentUser;
  changeNameAndPhoto(user, newNameAndPhoto);

  //Changes the email and password if the respective fields are filled with values
  if (newPassword && newEmail) {
    const credential = createCredential(user);
    changePassword(user, credential, newPassword);
    changeEmail(user, credential, newEmail);
  }
  //Changes only the email
  else if (newPassword) {

    const credential = createCredential(user);
    changePassword(user, credential, newPassword);
  }
  //Changes only password
  // else if(newEmail) {
  //     const credential = createCredential(user);
  //     changeEmail(user, credential, newEmail);
  // }

}

const changeNameAndPhoto = (user, newNameAndPhoto) => {
  let count = 0;
  const { newDisplayName, newPhotoURL } = newNameAndPhoto;
  const storageReference = storageRef(storage, `${user?.uid}/tmuna`)
  //Changes displayName and photoURL properties
  if (newDisplayName) {
    count++;
    update(ref(database, 'users/' + user.uid), {
      displayName: newDisplayName,
    })

    updateProfile(user, {
      displayName: newDisplayName,
    })
      .then(() => {

        notify('success', 'Profile Updated Successfully !');
      })
      .catch(error => {
        console.error(error);
      })
    displayNameHolder1.innerText = newDisplayName
    displayNameHolder2.innerText = newDisplayName


  }

  if (newPhotoURL) {
    uploadBytes(storageReference, newPhotoURL).then(() => {
      getDownloadURL(storageReference).then((url) => {
        update(ref(database, 'users/' + user.uid), {
          photoURL: url
        })
        updateProfile(user, {
          photoURL: url
        })
          .then(() => {
            photoHolder.setAttribute('src', url);
            photoHolder1.setAttribute('src', url);
            photoHolder6.setAttribute('src', url);
            if (count > 0)
              notify('success', 'Profile Updated Successfully !');
          })
          .catch(error => {
            console.error(error);
          })



      })
    })

  }

}

//Create credential for the reauthenticationWithCredential function which is a most do
//in order to change critical information such as changing email, password or
//deleting the account
const createCredential = user => {
  const password = prompt('Password:');
  const credential = auth.EmailAuthProvider.credential(
    email,
    password
  );
  return credential;
}

const changePassword = (user, credential, newPassword) => {
  user.reauthenticateWithCredential(credential)
    .then(() => {
      user.updatePassword(newPassword);
      console.log('Password Updated!');
    })
    .catch(error => {
      console.error(error);
    })
}




const changeEmail = (user, credential, newEmail) => {
  user.reauthenticateWithCredential(credential)
    .then(() => {
      user.updateEmail(newEmail);
      console.log('Email Updated!');
    })
    .catch(error => {
      console.error(error);
    })

}


const deleteAccount = () => {
  const user = auth.currentUser;
  const credential = createCredential(user);
  user.reauthenticateWithCredential(credential)
    .then(() => {
      user.delete();
      // notify('error', 'Your Account Has Been Deleted!');
    })
    .catch(error => {
      console.error(error);
    })
}

deleteButton.addEventListener('click', deleteAccount);

editButton.addEventListener('click', (e) => editInformation(e));

function notify(type, message) {
  let n = document.createElement("div");
  let id = Math.random().toString(36).substring(2, 10);
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
}




