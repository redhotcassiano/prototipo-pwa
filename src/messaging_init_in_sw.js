// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { doc, setDoc, getFirestore, query, where, collection, getDocs} from "firebase/firestore";
import {v4 as uuidv4} from 'uuid';


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

console.log('Loading Config Firebase!');



function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification Permission Granted.')
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const messaging = getMessaging(app);
      getToken(messaging, {vapidKey: ""}).then(async (currencyKey) => {
        if (currencyKey) {
          console.log('Key: ', currencyKey)
          const date = new Date()
          
          const keysRef = collection(db, "keys");

          const queryKeys = query(keysRef, where("key", "==", currencyKey));
          const arrayData = []

          await getDocs(queryKeys).then((querySnapshot) => {
            
            querySnapshot.forEach((doc) => {
              arrayData.push(doc.data())
              console.log(doc.id, " => ", doc.data());

            });
          }).catch((err) => console.error(err));

          console.log('Array Keys Equal: ', arrayData)

          if (arrayData.length <= 0) {
            console.log("Save new!")
            
            let uuid = uuidv4();
            setDoc(doc(db, "keys", uuid), { date: date, key: currencyKey}).then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
          } 
        }
      });

    } else {
      console.log('Not Have Permission.')
    }
  })
}

requestPermission()


