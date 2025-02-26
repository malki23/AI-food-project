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
  console.log(user);
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
    // displayNameHolder3.innerText = user.displayName;
  }
  if (user.photoURL) {

    photoHolder.setAttribute('src', user.photoURL);
    photoHolder1.setAttribute('src', user.photoURL);
    photoHolder2.setAttribute('src', user.photoURL);


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



export function changeTime() {
  console.log('test')
}




const photoHolder6 = document.getElementById('photoHolder6');



// The user object has basic properties such as display name, email, etc.




newUrl.addEventListener("change", (e) => {
  console.log(e.target.files[0]);
  file = e.target.files[0]
})


auth.onAuthStateChanged(user => {
  console.log(user);
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
  // if (newPassword && newEmail) {
  //   const credential = createCredential(user);
  //   changePassword(user, credential, newPassword);
  //   changeEmail(user, credential, newEmail);
  // }
  // //Changes only the email
  // else if (newPassword) {

  //   const credential = createCredential(user);
  //   changePassword(user, credential, newPassword);
  // }
  // //Changes only password
  // // else if(newEmail) {
  // //     const credential = createCredential(user);
  // //     changeEmail(user, credential, newEmail);
  // // }

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
    displayNameHolder3.innerText = newDisplayName


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
            photoHolder2.setAttribute('src', url);
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
      notify('error', 'Your Account Has Been Deleted!');
    })
    .catch(error => {
      console.error(error);
    })
}

deleteButton.addEventListener('click', deleteAccount);

editButton.addEventListener('click', (e) => editInformation(e));

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
    }, 1000);
  })();
}

const plate = document.getElementById("plate")


export function addSnow() {

  const snow1 = document.getElementById("snow1")
  const snow2 = document.getElementById("snow2")
  const snow3 = document.getElementById("snow3")
  const snow4 = document.getElementById("snow4")



  const snowL1 = document.getElementById("snowL1")
  const snowL2 = document.getElementById("snowL2")
  const snowL3 = document.getElementById("snowL3")
  const snowL4 = document.getElementById("snowL4")
  const snowL5 = document.getElementById("snowL5")
  const snowL6 = document.getElementById("snowL6")

  const snowAll = document.getElementById("snowAll")
  const audioGift = document.getElementById("audioGift")
  const cadeau = document.getElementById("cadeau")
  const plateFliping = document.getElementById("plateFliping")

  snow1.classList?.add('snowflake')
  snowL1.classList?.add('snowflakeL')
  snow2.classList?.add('snowflake')
  snowL2.classList?.add('snowflakeL')
  snow3.classList?.add('snowflake')
  snowL3.classList?.add('snowflakeL')
  snow4.classList?.add('snowflake')
  snowL4.classList?.add('snowflakeL')
  snowL5.classList?.add('snowflakeL')
  snowL6.classList?.add('snowflakeL')
  plate.classList?.add('fa-flip')

  snowAll.style.display = snow1.classList.contains('snowflake') ? "block" : "none";
  cadeau.style.display = "none";
  audioGift.volume = 0.35
  plateFliping.classList?.add("red")




}



const checkBox = document.getElementById("checkBox")

const DarkMainColor = "#0B162C";
const transparent = "#00941100"

let nav = document.getElementById("nav")
let TopDFill = document.getElementById("TopDFill")
let topDivider = document.getElementById("topDivider")
const navLinks = document.querySelectorAll(".nav-link");
const sec3 = document.getElementById("sec3")
let blinking = document.getElementById("blinking")
let blinking2 = document.getElementById("blinking2")
let calfoodHome = document.getElementById("calfoodHome")
let sun = document.getElementById("sunTourne")
let sec5 = document.getElementById("sec5")
const wave2 = document.querySelectorAll('.wave2');
const beige = document.querySelectorAll('.beige');
const sec2 = document.getElementById("secdeux")
const wave3 = document.getElementById("wave3")
const badge = document.getElementById("badge")
const cube = document.getElementById("cube")
// TopD.style.backgroundColor = "white";
let timeoutId

const paths = document.querySelectorAll('#montagneSvg path');
for (let i = 1; i < paths.length; i++) {
  paths[i].classList.add('montagneShadowDay');

}
topDivider.classList.add("topDivShadowDay")



export function handleCheckboxChange() {
  if (checkBox.checked) {

    cube.style.display = "none"

    document.body.classList.add("bgnight")
    document.body.classList.remove("bgday")


    nav.style.transition = "background-color 0.6s ease";
    nav.style.backgroundColor = "rgb(26,52,103,0.5)";
    nav.classList.remove("bg-gradient")
    calfoodHome.style.color = "white"

    badge.classList.remove("badgeM")
    badge.classList.add("white-badge")

    beige.forEach((beige) => {
      beige.style.color = '#f4ebd6';
    });





    TopDFill.style.transition = "fill 0.6s ease";
    TopDFill.style.fill = "rgb(26,52,103,0.5)";

    topDivider.classList.add("topDivShadowNight")
    topDivider.classList.remove("topDivShadowDay")


    timeoutId = setTimeout(() => {
      blinking.style.transition = "display 0.6s ease";
      blinking.classList.add("twinkling")
      blinking2.style.display = "block";

    }, 1000);


    wave2.forEach((wave) => {
      wave.style.fill = 'rgb(26,52,103,0.5)';
    });

    sec2.style.backgroundColor = "rgb(26,52,103,0.875)"
    wave3.style.fill = "rgb(26,52,103,0.875)"


    sec3.style.color = "white"
    // sec3.style.backgroundColor = transparent;
    // document.body.style.backgroundColor = transparent
    // document.body.style.backgroundImage = "none"
    document.body.style.transition = "background-color 0.8s ease";
    document.body.style.backgroundColor = DarkMainColor

    for (let i = 1; i < paths.length; i++) {
      paths[i].classList.add('montagneShadowNight');
      paths[i].classList.remove('montagneShadowDay');
    }



    sun.classList.add("sun")

    // layerMontagne.setAttribute("fill", transparent)
    sec5.style.color = "white"


    navLinks.forEach((link) => {
      link.style.transition = "background-image 0.6s ease";
      link.style.backgroundImage =
        "linear-gradient(to right, #ffffff, #ffffff 50%, #ffffff 50%)";
      link.style.backgroundColor = "white"
    });




  }
  else {

    cube.style.display = "block"


    document.body.classList.remove("bgnight")
    document.body.classList.add("bgday")


    nav.style.transition = "background-color 0.6s ease";
    nav.style.backgroundColor = "rgb(27,148,118,0.4)";
    calfoodHome.style.color = "black"


    TopDFill.style.transition = "fill 0.6s ease";
    TopDFill.style.fill = "rgb(27,148,118,0.4)";

    topDivider.classList.remove("topDivShadowNight")
    topDivider.classList.add("topDivShadowDay")

    beige.forEach((beige) => {
      beige.style.color = '#1B9476';
    });





    badge.classList.add("badgeM")
    badge.classList.remove("white-badge")
    // TopD.style.transition = "background-color 0.6s ease";
    // TopD.style.backgroundColor = "white";


    blinking.classList.remove("twinkling")
    blinking2.style.display = "none"
    clearTimeout(timeoutId);


    wave2.forEach((wave2) => {
      wave2.style.fill = 'rgb(27,148,118,0.5)';
    });

    sec2.style.backgroundColor = "rgb(27,148,118,0.875)"
    wave3.style.fill = "rgb(27,148,118,0.875)"


    sec3.style.color = "#124660"
    // sec3.style.backgroundColor = "#f4ebd6"
    // document.body.style.backgroundColor = "#f4ebd6"
    document.body.style.transition = "background-color 0.6s ease";
    document.body.style.backgroundColor = transparent



    for (let i = 1; i < paths.length; i++) {
      paths[i].classList.remove('montagneShadowNight');
      paths[i].classList.add('montagneShadowDay');
    }

    sec5.style.color = " #124660"

    sun.classList.remove("sun")

    //layerMontagne.setAttribute("fill", "#f4ebd6")

    navLinks.forEach((link) => {
      link.style.transition = "background-image 0.6s ease  ";
      link.style.backgroundImage =
        "linear-gradient(to right, #1b9476, #52b19a 50%, #196f4a 50%)";

    });
  }
}



// window.addEventListener('scroll', function () {

//   const viewportHeight = window.innerHeight;
//   let moonPosition = sec2.getBoundingClientRect();
//   console.log(moonPosition)

//   // Get the height of the viewport


//   // If the top of the moon is within the viewport, trigger the animation
//   if (moonPosition.top < 0) {
//     let value = window.scrollY;

//     sun.style.left = (value - viewportHeight) + 0.25 + 'px';
//     sun.style.left += (value - viewportHeight) + 0.25 + 'px';

//     console.log((value - viewportHeight))
//   }
// })
// const welcome = document.getElementById("welcomeCal")
// const hey = document.getElementById("hey")
// const arrow = document.getElementById("arrow")
// const sec2 = document.getElementById("secdeux")
// let moonPosition = sec2.getBoundingClientRect();

// window.addEventListener('scroll', function () {

//   const viewportHeight = window.innerHeight;

//   let value = window.scrollY;

//   welcome.style.paddingRight = (value) + 0.25 + 'px';
//   hey.style.paddingRight = (value) + 0.25 + 'px';



//   if (moonPosition.top < viewportHeight) {

//     arrow.style.opacity = 0;

//   }


// })