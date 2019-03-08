// This is a tool for checking IP address and network module names.
const os = require("os");
const ips = os.networkInterfaces();
Object.keys(ips).forEach(key => {
  modules = ips[key];
  modules.forEach(element => {
    if (element.family === "IPv4") {
      console.log(key, element.address);
    }
  });
});
