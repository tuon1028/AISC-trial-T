// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuJytVyT9ZC7O5sMH3dA0N6DGGjd8gjgM",
    authDomain: "aisc-9c269.firebaseapp.com",
    projectId: "aisc-9c269",
    storageBucket: "aisc-9c269.appspot.com",
    messagingSenderId: "1066794399981",
    appId: "1:1066794399981:web:b3eb60bff4d358834774e4",
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()


// Set up our register function
function register () {
    window.location.href = "index.html"; // replace with your login page URL
}
 
// Set up our login function
function login () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)

    // DOne
    alert('User Logged In!!')
    window.location.href = "user.html"

  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}




// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}