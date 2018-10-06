
var serialport = require("serialport"),
    SerialPort = serialport.SerialPort, // localize object constructor
    portName = 'COM3',
    express = require("express"),
    app = express(),
    Handlebars = require("handlebars"),
    exphbs = require("express-handlebars"),
    server = require("http").createServer(app),
    io = require('socket.io')(server),
    path = require("path"),
	bodyParser = require("body-parser");

//app environment
app.set("views", path.join(__dirname, "views"));
app.engine(
    ".hbs",
    exphbs({
        extname: ".hbs",
        defaultLayout: "layout",
    }),
);

app.set("view engine", ".hbs");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);


var 

var connectArd = function() {
    var sp = new SerialPort(portName, {
        parser: serialport.parsers.readline("\r\n"),
        //parser: serialport.parsers.raw,
        baudrate: 9600,
        // defaults for Arduino serial communication
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });


    sp.on("open", function() {
        console.log('Serial Port ' + portName + ' Opened');
        sp.on('data', function(data) {
            console.log(data.toString());
            io.emit('arduino', data);
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

app.use(require("./routes/auth"));
app.use(require("./routes/dashboard"));

app.set("port", process.env.PORT || 3100);

server.listen(app.get("port"), function() {
    console.log("Server working working at port", app.get("port"));
});
