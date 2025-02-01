const si = require("systeminformation");

si.bluetoothDevices().then((data) => console.log(data));
