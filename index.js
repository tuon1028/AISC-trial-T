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
const storage = firebase.storage()

const storageRef = storage.ref('images')


flatpickr("#birthday")


// Set up our register function
function register () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  birthday= document.getElementById('birthday').value
  full_name = document.getElementById('full_name').value
  gender = document.getElementById('gender').value
  position = document.getElementById('position').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }
  if (validate_field(full_name) == false || validate_field(gender) == false || validate_field(position) == false) {
    alert('One or More Extra Fields is Outta Line!!')
    return
  }
 
  // Move on with Auth
auth.createUserWithEmailAndPassword(email, password)
.then(function() {
  // Declare user variable
  var user = auth.currentUser

  var file = document.getElementById('profile_picture').files[0];

  // If no file is selected, use a default image
  if (!file) {
    file = '3177440.png'; // Replace this with the path to your default image
  }
  
  // Create a canvas and initialize Cropper.js
  var canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  var context = canvas.getContext('2d');
  var img = new Image();
  img.onload = function() {
    context.drawImage(img, 0, 0, 400, 400);
    canvas.toBlob(function(blob) {
      // Create the file metadata
      var metadata = {
        contentType: 'image/jpeg'
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child('profile_pictures/' + user.uid + '.jpg').put(blob, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        function(error) {
          // Handle unsuccessful uploads
        }, 
        function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);

            // Add this user to Firebase Database
            var database_ref = database.ref();

            // Create User data
            var user_data = {
              email : email,
              full_name : full_name,
              gender : gender,
              birthday : birthday,
              position : position,
              last_login : Date.now(),
              profile_picture : downloadURL  // Add the download URL of the image to the user data
            };

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).set(user_data);

            // Done
            alert('User Created!!');
          });
        });
    }, 'image/jpeg');
  };
  img.src = URL.createObjectURL(file);
})

  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

// Set up our login function
function login () {
  window.location.href = "loginpage.html"; 
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

