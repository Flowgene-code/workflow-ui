// /lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBx_GrXnAttB6b_sPKwKyNz4FNiNL4RRZI",
  authDomain: "flowgenie-6215d.firebaseapp.com",
  projectId: "flowgenie-6215d",
  storageBucket: "flowgenie-6215d.firebasestorage.app",
  messagingSenderId: "803820282989",
  appId: "1:803820282989:web:49c66e5044b8fde1fa4b64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
