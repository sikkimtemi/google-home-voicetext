const Client = require("castv2-client").Client;
const DefaultMediaReceiver = require("castv2-client").DefaultMediaReceiver;
const mdns = require("mdns");
const browser = mdns.createBrowser(mdns.tcp("googlecast"));
let deviceAddress;
let language;

const VoiceTextWriter = require("./voice-text-writer");
const voiceTextWriter = new VoiceTextWriter();

let device = function(name, lang = "ja") {
  device = name;
  language = lang;
  return this;
};

const ip = function(ip) {
  deviceAddress = ip;
  return this;
};

const notify = function(message, callback) {
  if (!deviceAddress) {
    browser.start();
    browser.on("serviceUp", function(service) {
      console.log(
        'Device "%s" at %s:%d',
        service.name,
        service.addresses[0],
        service.port
      );
      if (service.name.includes(device.replace(" ", "-"))) {
        deviceAddress = service.addresses[0];
        getSpeechUrl(message, deviceAddress, function(res) {
          callback(res);
        });
      }
      browser.stop();
    });
  } else {
    getSpeechUrl(message, deviceAddress, function(res) {
      callback(res);
    });
  }
};

const play = function(mp3_url, callback) {
  if (!deviceAddress) {
    browser.start();
    browser.on("serviceUp", function(service) {
      console.log(
        'Device "%s" at %s:%d',
        service.name,
        service.addresses[0],
        service.port
      );
      if (service.name.includes(device.replace(" ", "-"))) {
        deviceAddress = service.addresses[0];
        getPlayUrl(mp3_url, deviceAddress, function(res) {
          callback(res);
        });
      }
      browser.stop();
    });
  } else {
    getPlayUrl(mp3_url, deviceAddress, function(res) {
      callback(res);
    });
  }
};

const getSpeechUrl = function(text, host, callback) {
  voiceTextWriter
    .convertToText(text)
    .then(function(result, reject) {
      onDeviceUp(host, result, function(res) {
        callback(res);
      });
    })
    .catch(function onRejected(error) {
      console.error(error);
    });
};

const getPlayUrl = function(url, host, callback) {
  onDeviceUp(host, url, function(res) {
    callback(res);
  });
};

const onDeviceUp = function(host, url, callback) {
  const client = new Client();
  client.connect(host, function() {
    client.launch(DefaultMediaReceiver, function(err, player) {
      const media = {
        contentId: url,
        contentType: "audio/mp3",
        streamType: "BUFFERED" // or LIVE
      };
      if (url.endsWith("wav")) {
        media.contentType = "audio/wav";
      } else if (url.endsWith("ogg")) {
        media.contentType = "audio/ogg";
      }
      player.load(media, { autoplay: true }, function(err, status) {
        client.close();
        callback("Device notified");
      });
    });
  });

  client.on("error", function(err) {
    console.log("Error: %s", err.message);
    client.close();
    callback("error");
  });
};

exports.ip = ip;
exports.device = device;
exports.notify = notify;
exports.play = play;
