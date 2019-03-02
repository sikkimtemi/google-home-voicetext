require('date-utils')
var firebase = require('firebase')
var googlehome = require('google-home-notifier/google-home-voicetext')

var deviceName = 'Google Home'
googlehome.device(deviceName)

// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
}
firebase.initializeApp(config);

const firestore = firebase.firestore()
const document = firestore.doc('/googlehome/chant')

var observer = document.onSnapshot(docSnapshot => {
  var text = docSnapshot.get('message')
  if (text) {
    now = new Date().toFormat("YYYY年MM月DD日 HH24時MI分SS秒")
    console.log(now)
    try {
      googlehome.notify(text, function(notifyRes) {
        console.log(notifyRes)
      })
    } catch(err) {
      console.log(err)
    }
    document.update({
      message: ''
    }).then(() => {
      console.log(text)
    })
  }
}, err => {
  console.log('Encountered error: ${err}')
})
