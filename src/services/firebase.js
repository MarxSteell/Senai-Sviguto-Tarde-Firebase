import firebase from 'firebase';

const firebaseConfig = {
    
    authDomain: "svigufotardeholanda.firebaseapp.com",
    databaseURL: "https://svigufotardeholanda.firebaseio.com",
    projectId: "svigufotardeholanda",
    storageBucket: "svigufotardeholanda.appspot.com",
    messagingSenderId: "835812807984",
    appId: "1:835812807984:web:7a827359e2b3e92f"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;