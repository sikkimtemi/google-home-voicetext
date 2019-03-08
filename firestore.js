require("date-utils");
const firebase = require("firebase");
const googlehome = require("./google-home-voicetext");

const deviceName = "Google Home";
googlehome.device(deviceName);

if (process.env["GOOGLE_HOME_IP"]) {
  googlehome.ip(process.env["GOOGLE_HOME_IP"]);
}

// Initialize Firebase
const config = {
  apiKey: process.env["FIREBASE_API_KEY"],
  authDomain: process.env["FIREBASE_AUTH_DOMAIN"],
  databaseURL: process.env["FIREBASE_DB_URL"],
  projectId: process.env["FIREBASE_PROJECT_ID"],
  storageBucket: process.env["FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: process.env["FIREBASE_SENDER_ID"]
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
const document = firestore.doc("/googlehome/chant");

const observer = document.onSnapshot(
  docSnapshot => {
    const text = docSnapshot.get("message");
    if (text) {
      now = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
      console.log(now);
      try {
        googlehome.notify(text, function(notifyRes) {
          console.log(notifyRes);
        });
      } catch (err) {
        console.log(err);
      }
      document
        .update({
          message: ""
        })
        .then(() => {
          console.log(text);
        });
    }
  },
  err => {
    console.log("Encountered error: ${err}");
  }
);
