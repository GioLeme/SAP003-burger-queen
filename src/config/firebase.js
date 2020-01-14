import * as firebase from 'firebase';


const config = {
    apiKey: "AIzaSyDgs7alezqty6eCrsK6js8ikx52s_OXOI4",
    authDomain: "burguer-queen-d8669.firebaseapp.com",
    databaseURL: "https://burguer-queen-d8669.firebaseio.com",
    projectId: "burguer-queen-d8669",
    storageBucket: "burguer-queen-d8669.appspot.com",
    messagingSenderId: "50496169941",
    appId: "1:50496169941:web:f8b634953446910b303f5c"
  };

const fire = firebase.initializeApp(config);

export default fire;