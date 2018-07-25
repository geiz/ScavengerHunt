import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
//require("firebase/messaging");
//require("firebase/functions");

import Rebase from "re-base";

firebase.initializeApp({
  apiKey: "AIzaSyAUGNapN2uE2aIK3ZnPtFQVvPZOaVuh81Q",
  authDomain: "signaio-ddc14.firebaseapp.com",
  databaseURL: "https://signaio-ddc14.firebaseio.com",
  projectId: "signaio-ddc14",
  storageBucket: "signaio-ddc14.appspot.com",
  messagingSenderId: "872928783319"
});

firebase.auth().useDeviceLanguage();

const baseDatabase = firebase.database();
const baseAuth = firebase.auth();
const baseStorage = firebase.storage();

export { baseDatabase, baseAuth, baseStorage };

const base = Rebase.createClass(baseDatabase);
export default base;
