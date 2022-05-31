// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChGGPLIx-KEhoTNGoE0B-fYN-AHVlFBas",
  authDomain: "velina-208320.firebaseapp.com",
  projectId: "velina-208320",
  storageBucket: "ml_portal2",
  messagingSenderId: "237653208032",
  appId: "1:237653208032:web:11721d3502de5f811b1985"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// References
// https://stackoverflow.com/questions/59508597/vue-how-to-commit-firebase-config-data-when-its-part-of-main-js
