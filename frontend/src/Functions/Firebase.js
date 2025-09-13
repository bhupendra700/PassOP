// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCiuKwUo1fJtWURh1GdsstcUXf4R4HvXlU",
    authDomain: "passop-6bc11.firebaseapp.com",
    projectId: "passop-6bc11",
    storageBucket: "passop-6bc11.firebasestorage.app",
    messagingSenderId: "797272661948",
    appId: "1:797272661948:web:862807ad36e0a16cce15b9",
    measurementId: "G-8QY56MK3QC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app)
export { messaging }