import Firebase from 'firebase'

let config = {
    apiKey: "AIzaSyDz5SHGFjHoRB--_bi94dKTgmfqjr0Q71I",
    authDomain: "sisgesa-84ae1.firebaseapp.com",
    databaseURL: "https://sisgesa-84ae1.firebaseio.com",
    projectId: "sisgesa-84ae1",
    storageBucket: "sisgesa-84ae1.appspot.com",
    messagingSenderId: "254582565338"

}

const firebaseApp = Firebase.initializeApp(config);

// Export the database for components to use.
export const db = firebaseApp.database();