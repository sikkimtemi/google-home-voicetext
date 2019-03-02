// This is a tool for checking IP address and network module names.
var os = require('os')
var ips = os.networkInterfaces()
Object.keys(ips).forEach(key => {
    modules = ips[key]
    modules.forEach(element => {
        if (element.family === 'IPv4') {
            console.log(key, element.address)
        }
    })
})
