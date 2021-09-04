const firebase = require('firebase')

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBniIV2fbQKc4WcZEu3h5IIfO60sb3RutU",
    authDomain: "instagram-2-72a9b.firebaseapp.com",
    projectId: "instagram-2-72a9b",
    storageBucket: "instagram-2-72a9b.appspot.com",
    messagingSenderId: "471522611477",
    appId: "1:471522611477:web:dbd031a78fdf268025d91c",
    measurementId: "G-1PEYJJHP2M"
  };

firebase.initializeApp(firebaseConfig);

module.exports = firebase