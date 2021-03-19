import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const config = {
    apiKey: "AIzaSyCWlSgSvwP-xouR2MQy3sXG500PS6Aj4sQ",
    authDomain: "untypical-network.firebaseapp.com",
    projectId: "untypical-network",
    storageBucket: "untypical-network.appspot.com",
    messagingSenderId: "783297625168",
    appId: "1:783297625168:web:34df91300ba4ac8380e555"
}


const  myFirebase = firebase.initializeApp(config)
export const db = firebase.firestore()


export default myFirebase