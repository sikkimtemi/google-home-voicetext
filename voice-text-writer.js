if (!process.env['VOICETEXT_API_KEY']) {
    throw new Error('VOICETEXT_API_KEY is required.')
}
if (!process.env['WIRELESS_IP'] && !process.env['WIRELESS_MODULE_NAME']) {
    throw new Error('WIRELESS_IP or WIRELESS_MODULE_NAME is required.')
}
var WIRELESS_IP = ''
if (process.env['WIRELESS_IP']) {
    WIRELESS_IP = process.env['WIRELESS_IP']
} else {
    var os = require('os')
    var ips = os.networkInterfaces()
    var WIRELESS_MODULE_NAME = process.env['WIRELESS_MODULE_NAME']  // ex. en0
    var WIRELESS_modules = ips[WIRELESS_MODULE_NAME]
    WIRELESS_modules.forEach(module => {
        if (module.family === 'IPv4') {
            WIRELESS_IP = module.address
        }
    })
}

var VOICETEXT_API_KEY = process.env['VOICETEXT_API_KEY']
var VoiceText = require('voicetext')
var voice = new VoiceText(VOICETEXT_API_KEY)
var OUT_PATH = __dirname + '/../../public/voice/_temp.wav'
var OUTPUT_URL = 'http://' + WIRELESS_IP + ':8888/googlehome/_temp.wav'
var fs = require('fs')

class VoiceTextWriter {

    convertToText(text) {
        return new Promise(function (resolve, reject) {
            voice
                .speaker(voice.SPEAKER.HIKARI)
                .emotion(voice.EMOTION.HAPPINESS)
                .emotion_level(voice.EMOTION_LEVEL.HIGH)
                .volume(150)
                .speak(text, function (e, buf) {
                    if (e) {
                        console.error(e)
                        reject(e)

                    } else {
                        fs.writeFileSync(OUT_PATH, buf, 'binary')
                        resolve(OUTPUT_URL)
                    }
                })
        })
    }
}
module.exports = VoiceTextWriter