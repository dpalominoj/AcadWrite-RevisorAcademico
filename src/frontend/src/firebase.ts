// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "re-inventory-api.firebaseapp.com",
  projectId: "re-inventory-api",
  storageBucket: "re-inventory-api.appspot.com",
  messagingSenderId: "453621594248",
  appId: "1:453621594248:web:de1d8e8faa2b54b7a6073d",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export { app, storage }
