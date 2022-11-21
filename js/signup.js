var loader1 = document.getElementById("preloadersignup");

function undisplayloader() {
  if (loader1) loader1.style.display = "none";
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
  undisplayloader();
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword,updateProfile, sendEmailVerification} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

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
const auth = getAuth();






signUpUserBtn.addEventListener('click', (e) => {

    var email = document.getElementById('emailSu').value;
    var password = document.getElementById('passSu').value;
    var firstName = document.getElementById('firstNameSu').value;
    var lastName = document.getElementById('lastNameSu').value;



    if (!(ValidateEmail())) {
        return;
    }

    if (!(checkInfo())) {
        return;
    }

    if (!(checkPassword())) {
        return;
    }

    if (!(checkPasswordValue(password))) {
        return;
    }

   
    





    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;

           sendVerificationEmail();

           updateProfile(user,{
                displayName: document.getElementById("firstNameSu").value
           })

         

            set(ref(database, 'users/' + user.uid), {

                firstName: firstName,
                email: email,
                lastName: lastName

            })

            notify('success', 'User created !')
            setTimeout(() => {
                window.location.replace("../html/login.html");
               }, 1000)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email2 = document.getElementById('emailSu');
            email2.style.borderBottom = "2px solid red";

            notify('info', 'User already exist , try login ')
           
            // ..
        });

});



const sendVerificationEmail = () => {
    sendEmailVerification(auth.currentUser)
  .then(() => {
    // Email verification sent!
    // ...
  });
}

 function ValidateEmail() {

    const email = document.getElementById('emailSu').value;
    const email2 = document.getElementById('emailSu');

    var validRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/



    if (email == '') {
        notify("info", "Please enter your email address");
        email2.style.borderBottom = "2px solid red";

    }

    else if (validRegex.test(email)) {
        email2.style.borderBottom = "1px solid #1b9476";
        return true;
    }
    else {
        notify('error', "Invalid email address!");
        email2.style.borderBottom = "2px solid red";
        return false;

    }

}

export function ValidateIndicator() {

  const email = document.getElementById('emailSu').value;
  const email2 = document.getElementById('emailSu');
  const form=document.getElementById('form1');

  var validRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/



  if (email == '') {
    form.classList.remove('valid')
     form.classList.remove('invalid')
     form.classList.remove('invalidText')
      email2.style.borderBottom = "1px solid #1b9476";

  }

  else if (validRegex.test(email)) {
    form.classList.remove('invalid')
    form.classList.add('valid')
    form.classList.remove('invalidText')
      email2.style.borderBottom = "1px solid #1b9476";
      return true;
  }
  else {
    form.classList.remove('valid')
    form.classList.add('invalid')
    form.classList.add('invalidText')
      email2.style.borderBottom = "2px solid red";
      return false;

  }

}


function checkInfo() {
    const first = document.getElementById('firstNameSu').value;
    const last = document.getElementById('lastNameSu').value;

    const first2 = document.getElementById('firstNameSu');
    const last2 = document.getElementById('lastNameSu');

    if (first) {
        first2.style.borderBottom = "1px solid #1b9476";

    }
    if (last) {
        last2.style.borderBottom = "1px solid #1b9476";

    }

    if (!(first)) {
        notify("info", "Please enter your first name");
        first2.style.borderBottom = "2px solid red";
    }

    else if (!(last)) {
        notify("info", "Please enter your last name");
        last2.style.borderBottom = "2px solid red";
    }
   
    else {

        return true;
    }

}

function checkPassword() {
    const password1 = document.getElementById('passSu').value;
    const password2 = document.getElementById('confirmPassSu').value;
    const password1style = document.getElementById('passSu');
    const password2style = document.getElementById('confirmPassSu');


    if (password2 != '') {

        password2style.style.borderBottom = "1px solid #1b9476";
    }

    
    if (password1 == password2) {

        password2style.style.borderBottom = "1px solid #1b9476";
    }


    // If password not entered
    if (password1 == '') {
        notify("info", "Please enter a password");
        password1style.style.borderBottom = "2px solid red";
    }



    // If confirm password not entered
    else if (password2 == '') {
        notify("info", "Please confirm your password");
        password2style.style.borderBottom = "2px solid red";
    }





    // If Not same return False.    
    else if (password1 != password2) {
        notify("error", "Password did not match: Please try again...");
        password2style.style.borderBottom = "2px solid red";
        return false;
    }




    // If same return True.
    else {

        return true;
    }
}

export function PassNoMatch(){
  const password1 = document.getElementById('passSu').value;
    const password2 = document.getElementById('confirmPassSu').value;
    const password1style = document.getElementById('passSu');
    const password2style = document.getElementById('confirmPassSu');
    const form=document.getElementById('form1');

    if (password2==''  ) {
      password2style.style.borderBottom = "1px solid #1b9476";
       form.classList.remove('PassMatchText')
    
     
  }

  
  // if (password1=='' ) {
  //   password1style.style.borderBottom = "1px solid #1b9476";
    
  //  }

  //  if (password1!='' ) {
  // password1style.style.borderBottom = "1px solid #1b9476";
  

  //  }

   else  if (password1 != password2) {
      password2style.style.borderBottom = "2px solid red";
       form.classList.add('PassMatchText')
     
     
  }

  else if (password1 == password2) {
    password2style.style.borderBottom = "1px solid #1b9476";
    form.classList.remove('PassMatchText')
  
    
  
}


}



export function NameNotEmpty(){
  const first = document.getElementById('firstNameSu').value;
    const last = document.getElementById('lastNameSu').value;
    const pass = document.getElementById('passSu').value;
    const firstStyle = document.getElementById('firstNameSu');
    const lastStyle = document.getElementById('lastNameSu');
    const passStyle = document.getElementById('passSu');
    const form=document.getElementById('form1');

    if (first=='' || first!='' ) {

      firstStyle.style.borderBottom = "1px solid #1b9476";
  }

     if (last=='' | last!='') {
      lastStyle.style.borderBottom = "1px solid #1b9476";

  }

  if (pass=='' | pass!='') {
    passStyle.style.borderBottom = "1px solid #1b9476";

}

}


export function checkPasswordValueText() {

 const password1 = document.getElementById('passSu').value;
  const password1style = document.getElementById('passSu');
  const password2 = document.getElementById('confirmPassSu').value;
  const password2style = document.getElementById('confirmPassSu');
  const form=document.getElementById('form1');


  

//   if (password1=='' && password2=='') {
//     password2style.style.borderBottom = "1px solid #1b9476";
//     password1style.style.borderBottom = "1px solid #1b9476";
//      form.classList.remove('PassMatchText')
  
//    return;
// }

if (password1=='' ) {
 
  form.classList.remove('passLower')
  form.classList.remove('passUpper')
  form.classList.remove('passNum')
  form.classList.remove('pass8')
   password1style.style.borderBottom = "1px solid #1b9476";


 return;
}

if (password1!= password2 && password2!='') {
 
  
  password2style.style.borderBottom = "2px solid red";
  form.classList.add('PassMatchText')

 
}

if (password1== password2 && password2!='') {
 
  
  password2style.style.borderBottom = "1px solid #1b9476";
  form.classList.remove('PassMatchText')

 
}





    if (password1.length < 8) {

       
        password1style.style.borderBottom = "2px solid red ";
         form.classList.remove('passLower')
         form.classList.remove('passUpper')
         form.classList.remove('passNum')
         form.classList.add('pass8')



    } else if (password1.search(/[a-z]/) < 0) {

      
        password1style.style.borderBottom = "2px solid red ";
        form.classList.remove('passNum')
        form.classList.remove('passUpper')
        form.classList.remove('pass8')
        form.classList.add('passLower')


    } else if (password1.search(/[A-Z]/) < 0) {

      
        password1style.style.borderBottom = "2px solid red ";
        form.classList.remove('passNum')
        form.classList.remove('pass8')
        form.classList.remove('passLower')
        form.classList.add('passUpper')


    } else if (password1.search(/[0-9]/) < 0) {

       
        password1style.style.borderBottom = "2px solid red ";
        form.classList.remove('passUpper')
        form.classList.remove('pass8')
        form.classList.remove('passLower')
        form.classList.add('passNum')


    }
    else {
      form.classList.remove('passLower')
      form.classList.remove('passUpper')
      form.classList.remove('passNum')
      form.classList.remove('pass8')
       password1style.style.borderBottom = "1px solid #1b9476";
        return true;
    }
}

function checkPasswordValue(password) {

  const password1style = document.getElementById('passSu');
  const password2style = document.getElementById('confirmPassSu');

    if (password.length < 8) {

        notify('error', ' Password must be at least 8 characters');
        password1style.style.borderBottom = "2px solid red ";
        password2style.style.borderBottom = "2px solid red ";
         



    } else if (password.search(/[a-z]/) < 0) {

        notify('error', ' Password must contain at least one lowercase letter');
        password1style.style.borderBottom = "2px solid red ";
        password2style.style.borderBottom = "2px solid red ";
       


    } else if (password.search(/[A-Z]/) < 0) {

        notify('error', ' Password must contain at least one uppercase letter');
        password1style.style.borderBottom = "2px solid red ";
        password2style.style.borderBottom = "2px solid red ";
       


    } else if (password.search(/[0-9]/) < 0) {

        notify('error', ' Password must contain at least one number');
        password1style.style.borderBottom = "2px solid red ";
        password2style.style.borderBottom = "2px solid red ";
       

    }
    else {

        return true;
    }
}




const togglePassword = document.querySelector("#lock");
const password = document.querySelector("#passSu");


togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("bi-eye");
});

const togglePassword2 = document.querySelector("#lock2");
const password2 = document.querySelector("#confirmPassSu");

togglePassword2.addEventListener("click", function () {
    // toggle the type attribute
    const type = password2.getAttribute("type") === "password" ? "text" : "password";
    password2.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("bi-eye");
});

// prevent form submit
const form = document.querySelector("form");
form.addEventListener('submit', function (e) {
    e.preventDefault();
});



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
            for (let i = 0; i < notifications.length; i++) {
                if (notifications[i].getAttribute("id") == id) {
                    notifications[i].remove();
                    break;
                }
            }
        }, 5000);
    })();
}

