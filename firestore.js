require("date-utils");
// const firebase = require("firebase");
const googlehome = require("./google-home-voicetext");

const deviceName = "Google Home";
googlehome.device(deviceName);

if (process.env["GOOGLE_HOME_IP"]) {
  googlehome.ip(process.env["GOOGLE_HOME_IP"]);
}

// Initialize Firebase
const admin = require("firebase-admin");
const serviceAccount = require(process.env["FIREBASE_SECRET_KEY_PATH"]);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env["FIREBASE_DATABASE_URL"]
});

// Connect to Firestore
const firestore = admin.firestore();
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
    console.log("Firestore error:", err);
    console.log(document);
  }
);
