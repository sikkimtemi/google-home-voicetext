require("date-utils");
const express = require("express");
const googlehome = require("./google-home-voicetext");
const bodyParser = require("body-parser");
const app = express();
const serverPort = 8080;

const deviceName = "Google Home";
googlehome.device(deviceName);

if (process.env["GOOGLE_HOME_IP"]) {
  googlehome.ip(process.env["GOOGLE_HOME_IP"]);
}

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/google-home-voicetext", urlencodedParser, function(req, res) {
  now = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
  console.log(now);
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  const text = req.body.text;
  if (text) {
    try {
      googlehome.notify(text, function(notifyRes) {
        console.log(notifyRes);
        res.send(deviceName + " will say: " + text + "\n");
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  } else {
    res.send('Please POST "text=Hello Google Home"');
  }
});

app.listen(serverPort, function() {
  console.log('POST "text=Hello Google Home" to:');
  console.log(
    "    http://{Server IP address}:" + serverPort + "/google-home-voicetext"
  );
  console.log("example:");
  console.log(
    'curl -X POST -d "text=こんにちは、Googleです。" http://{Server IP address}:' +
      serverPort +
      "/google-home-voicetext"
  );
});
