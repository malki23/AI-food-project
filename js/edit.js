const mailField = document.getElementById('mail');
const passwordField = document.getElementById('newPass');
const displayNameField = document.getElementById('newName');
const photoField = document.getElementById('photo');
const labels = document.getElementsByTagName('label');
const backButton = document.getElementById('back');
const editButton = document.getElementById('edit');
const deleteButton = document.getElementById('delete');
const newUrl =document.getElementById('newPic');
const newName =document.getElementById('newName');

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// import { getStorage, ref, uplo,updateadBytes } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { getAuth, updateProfile , onAuthStateChanged, signOut ,GoogleAuthProvider ,signInWithRedirect,getRedirectResult,signInWithPopup} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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
// const updatePro = updateProfile(app);
const provider = new GoogleAuthProvider(app);


const photoHolder = document.getElementById('photoHolder');



    // The user object has basic properties such as display name, email, etc.
    
    
   


auth.onAuthStateChanged(user => {
    console.log(user);
    //display the displayName and photoURL of the user on the page
   
    if(user.photoURL){
        photoHolder.setAttribute('src', user.photoURL);
         newUrl.setAttribute('value',  user.photoURL);
    }
        
    if (user.displayName)
        newName.setAttribute('value',user.displayName );
})

const editInformation = () => {
    const newNameAndPhoto = {
        newDisplayName: newName.value,
        newPhotoURL: newUrl.value
    };
  //  const newEmail = mailField.value;
    const newPassword = passwordField.value;
    //Holds all the information about the current signed in user
    const user = auth.currentUser;
    changeNameAndPhoto(user, newNameAndPhoto);

    //Changes the email and password if the respective fields are filled with values
    if(newPassword && newEmail) {
        const credential = createCredential(user);
        changePassword(user, credential, newPassword);
        changeEmail(user, credential, newEmail);
    }
    //Changes only the email
    else if(newPassword) {
        
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
    const {newDisplayName, newPhotoURL} = newNameAndPhoto;
    //Changes displayName and photoURL properties
    if(newDisplayName && newPhotoURL)
        updateProfile(user,{
            displayName: newDisplayName,
            photoURL: newPhotoURL
        })

        .then(() => {
            location.reload()
            notify('success','Profile Updated Successfully !');
        })
        .catch(error => {
            console.error(error);
        })
    //Changes only displaName
    else if(newDisplayName)
        updateProfile(user,{
            displayName: newDisplayName
        })
        .then(() => {
           
            notify('success','Display Name Updated Successfully !');

        })
        .catch(error => {
            console.error(error);
        })
    //Changes only photoURL
    else if(newPhotoURL)
       updateProfile(user,{
            photoURL: newPhotoURL
        })
        .then(() => {
            location.reload()
            notify('success','PhotoURL Updated Successfully !');

            
        })
        .catch(error => {
            console.error(error);
        })
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
        console.log('Your Account Has Been Deleted!');
    })
    .catch(error => {
        console.error(error);
    })
}

deleteButton.addEventListener('click', deleteAccount);

editButton.addEventListener('click', editInformation);

backButton.addEventListener('click', () => {
    console.log('hi')
    window.location.assign("../html/index.html");
});

//Animations
// mailField.addEventListener('focus', () => {
//     labels.item(0).className = "focused-field";
// });

// passwordField.addEventListener('focus', () => {
//     labels.item(1).className = "focused-field";
// });

// // mailField.addEventListener('blur', () => {
// //     if(!mailField.value)
// //         labels.item(0).className = "unfocused-field";
// // });

// passwordField.addEventListener('blur', () => {
//     if(!passwordField.value)
//         labels.item(1).className = "unfocused-field";
// });

// displayNameField.addEventListener('focus', () => {
//     labels.item(2).className = "focused-field";
// });

// photoField.addEventListener('focus', () => {
//     labels.item(3).className = "focused-field";
// });

// displayNameField.addEventListener('blur', () => {
//     if(!displayNameField.value)
//         labels.item(2).className = "unfocused-field";
// });

// photoField.addEventListener('blur', () => {
//     if(!photoField.value)
//         labels.item(3).className = "unfocused-field";
// });

function notify(type, message) {
    (() => {
        let n = document.createElement("div");
        let id = Math.random().toString(36).substr(2, 10);
        n.setAttribute("id", id);
        n.classList.add("notification", type);
        n.innerText = message;
        document.getElementById("notification-area").appendChild(n);
        setTimeout(() => {
            var notifications = document.getElementById("notification-area").getElementsByClassName("notification");
            for (let i = 0; i < notifications.length; i--) {
                if (notifications[i].getAttribute("id") == id) {
                    notifications[i].remove();
                    break;
                }
            }
        }, 5000);
    })();
}

