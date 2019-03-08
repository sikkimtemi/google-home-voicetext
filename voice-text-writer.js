if (!process.env["VOICETEXT_API_KEY"]) {
  throw new Error("VOICETEXT_API_KEY is required.");
}
if (!process.env["WIRELESS_IP"] && !process.env["WIRELESS_MODULE_NAME"]) {
  throw new Error("WIRELESS_IP or WIRELESS_MODULE_NAME is required.");
}
let WIRELESS_IP;
if (process.env["WIRELESS_IP"]) {
  WIRELESS_IP = process.env["WIRELESS_IP"];
} else {
  const os = require("os");
  const ips = os.networkInterfaces();
  const WIRELESS_MODULE_NAME = process.env["WIRELESS_MODULE_NAME"]; // ex. en0
  const WIRELESS_modules = ips[WIRELESS_MODULE_NAME];
  WIRELESS_modules.forEach(module => {
    if (module.family === "IPv4") {
      WIRELESS_IP = module.address;
    }
  });
}

const FILE_SERVER_PORT = "8888";
const VOICETEXT_API_KEY = process.env["VOICETEXT_API_KEY"];
const VOICETEXT_SPEAKER = process.env["VOICETEXT_SPEAKER"];

const VoiceText = require("voicetext");
const voice = new VoiceText(VOICETEXT_API_KEY);
const OUT_PATH = __dirname + "/public/voice/_temp.wav";
const OUTPUT_URL =
  "http://" + WIRELESS_IP + ":" + FILE_SERVER_PORT + "/googlehome/_temp.wav";
  const fs = require("fs");

let SPEAKER;
if (VOICETEXT_SPEAKER === "BEAR") {
  SPEAKER = voice.SPEAKER.BEAR;
} else if (VOICETEXT_SPEAKER === "HARUKA") {
  SPEAKER = voice.SPEAKER.HARUKA;
} else if (VOICETEXT_SPEAKER === "SANTA") {
  SPEAKER = voice.SPEAKER.SANTA;
} else if (VOICETEXT_SPEAKER === "SHOW") {
  SPEAKER = voice.SPEAKER.SHOW;
} else if (VOICETEXT_SPEAKER === "TAKERU") {
  SPEAKER = voice.SPEAKER.TAKERU;
} else {
  SPEAKER = voice.SPEAKER.HIKARI;
}

class VoiceTextWriter {
  convertToText(text) {
    return new Promise(function(resolve, reject) {
      voice
        .speaker(SPEAKER)
        .emotion(voice.EMOTION.HAPPINESS)
        .emotion_level(voice.EMOTION_LEVEL.HIGH)
        .volume(150)
        .speak(text, function(e, buf) {
          if (e) {
            console.error(e);
            reject(e);
          } else {
            fs.writeFileSync(OUT_PATH, buf, "binary");
            resolve(OUTPUT_URL);
          }
        });
    });
  }
}
module.exports = VoiceTextWriter;
