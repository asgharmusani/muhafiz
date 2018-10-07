
var SerialPort = require("serialport"),
    Readline = require('@serialport/parser-readline'),
    portName = 'COM3';

module.exports = function(io) {

    var somedataNSP = io.of('/somedata');
    var connectArd = function() {
        const sp = new SerialPort(portName, {
            baudRate: 115200,
            // defaults for Arduino serial communication
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
          });
    
        const parser = sp.pipe(new Readline({ delimiter: '\r\n' }))
    
        sp.on("open", function() {
            console.log('Serial Port ' + portName + ' Opened');
            parser.on('data', function(data) {
                let ardData = data.split(":");
                let jsonData = {};
                if(ardData[0] === "GPS"){
                    let gps = ardData[1].split(",");
                    jsonData = {
                        GPS: {
                            lat: gps[0],
                            long: gps[1],
                        }
                    }
                }
                else
                    jsonData[ardData[0]] = ardData[1];
                somedataNSP.emit('arduino', jsonData);
            });
        });
    
        sp.on('close', function(){
            console.log('ARDUINO PORT CLOSED, waiting 9 sec before retry');
            setTimeout(
                function() {
                    //process.exit();
                    reconnectArd();
                }, 9000);
        });
    
        sp.on('error', function (err) {
            console.error("sp error: ", err, "Waiting 9 sec before restarting");
            setTimeout(
                function() {
                    //process.exit();
                    reconnectArd();
                }, 9000);
        });
    }
    
    
    
    // check for connection errors or drops and reconnect
    var reconnectArd = function () {
        console.log('INITIATING RECONNECT');
        connectArd();
        /*
        setTimeout(function(){
            console.log('RECONNECTING TO ARDUINO [after 5sec wait]');
            connectArd();
        }, 5000);*/
    };

    connectArd();

}
