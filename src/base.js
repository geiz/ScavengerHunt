import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
//require("firebase/messaging");
//require("firebase/functions");

import Rebase from "re-base";

firebase.initializeApp({
  apiKey: "YOUR KEY HERE",
  authDomain: "YOUR DOMAIN HERE",
  databaseURL: "YOUR URL HERE",
  projectId: "YOUR ID HERE",
  storageBucket: "YOUR BUCKET HERE",
});

firebase.auth().useDeviceLanguage();

const baseDatabase = firebase.database();
const baseAuth = firebase.auth();
const baseStorage = firebase.storage();

export { baseDatabase, baseAuth, baseStorage };

const base = Rebase.createClass(baseDatabase);
export default base;
