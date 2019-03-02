require('date-utils')
var express = require('express')
var googlehome = require('./google-home-voicetext')
var bodyParser = require('body-parser')
var app = express()
const serverPort = 8080

var deviceName = 'Google Home'
googlehome.device(deviceName)

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/google-home-notifier', urlencodedParser, function (req, res) {
  now = new Date().toFormat("YYYY-MM-DD HH24:MI:SS")
  console.log(now)
  if (!req.body) return res.sendStatus(400)
  console.log(req.body)
  var text = req.body.text
  if (text){
    try {
      googlehome.notify(text, function(notifyRes) {
        console.log(notifyRes)
        res.send(deviceName + ' will say: ' + text + '\n')
      })
    } catch(err) {
      console.log(err)
      res.sendStatus(500)
      res.send(err)
    }
  }else{
    res.send('Please POST "text=Hello Google Home"')
  }
})

app.listen(serverPort, function () {
  console.log('POST "text=Hello Google Home" to:')
  console.log('    http://{Server IP address}:' + serverPort + '/google-home-notifier')
  console.log('example:')
  console.log('curl -X POST -d "text=こんにちは、Googleです。" http://{Server IP address}:' + serverPort + '/google-home-notifier')
})
