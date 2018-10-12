var SerialPort = require("serialport"),
    Readline = require("@serialport/parser-readline"),
    portName = "COM4";

module.exports = function(io) {
    var somedataNSP = io.of("/somedata");
    var connectArd = function() {
        const sp = new SerialPort(portName, {
            baudRate: 115200,
            // defaults for Arduino serial communication
            dataBits: 8,
            parity: "none",
            stopBits: 1,
            flowControl: false,
        });

        const parser = sp.pipe(new Readline({ delimiter: "\r\n" }));

        sp.on("open", function() {
            console.log("Serial Port " + portName + " Opened");
            parser.on("data", function(data) {
                let ardData = data.split("/");
                if (typeof ardData[1] != "undefined") {
                    if (ardData[1].includes(":")) {
                        let idAndVal = ardData[1].split(":");
                        // console.log(ardData);
                        let jsonData = {};
                        if (ardData[0] === "GPS") {
                            let gps = idAndVal[1].split(",");
                            jsonData = {
                                id: idAndVal[0],
                                gps: {
                                    lat: gps[0],
                                    long: gps[1],
                                },
                            };
                        } else if (ardData[0] === "Touch1") {
                            console.log("Value for impact1 is", idAndVal[1], typeof idAndVal[1]);
                            jsonData = {
                                id: idAndVal[0],
                                impact1: idAndVal[1] < 10 ? true : false,
                            };
                        } else if (ardData[0] === "Touch2") {
                            console.log("Value for impact2 is", idAndVal[1], typeof idAndVal[1]);
                            jsonData = {
                                id: idAndVal[0],
                                impact2: idAndVal[1] < 10 ? true : false,
                            };
                        } else {
                            jsonData["id"] = idAndVal[0];
                            jsonData[ardData[0]] = idAndVal[1];
                        }
                        console.log(jsonData);
                        somedataNSP.emit("arduino", jsonData);
                    }
                }
            });
        });

        sp.on("close", function() {
            console.log("ARDUINO PORT CLOSED, waiting 9 sec before retry");
            setTimeout(function() {
                //process.exit();
                reconnectArd();
            }, 9000);
        });

        sp.on("error", function(err) {
            console.error("sp error: ", err, "Waiting 9 sec before restarting");
            setTimeout(function() {
                //process.exit();
                reconnectArd();
            }, 9000);
        });
    };

    // check for connection errors or drops and reconnect
    var reconnectArd = function() {
        console.log("INITIATING RECONNECT");
        connectArd();
        /*
    setTimeout(function(){
        console.log('RECONNECTING TO ARDUINO [after 5sec wait]');
        connectArd();
    }, 5000);*/
    };

    connectArd();
};
