import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBo0ezSg267zUXXsY0K8pT1dXAIjXg13-E",
  authDomain: "tjterritorios.firebaseapp.com",
  projectId: "tjterritorios",
  storageBucket: "tjterritorios.appspot.com",
  messagingSenderId: "711975789679",
  appId: "1:711975789679:web:98b465a492db9f4ac6599a",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db }
