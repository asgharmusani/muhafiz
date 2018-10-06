
var serialport = require("serialport"),
		bodyParser = require("body-parser"),



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





var port = new serialport("COM7", {
  baudRate: 9600,
  parser: new serialport.parsers.Readline("\n")
});

port.on("open", function() {
	console.log('open');
	port.on('data', function(data) {
		console.log(data.toString());
	});
});

