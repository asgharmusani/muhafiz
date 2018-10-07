var express = require("express"),
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

app.use(require("./routes/auth"));
app.use(require("./routes/dashboard"));
require("./routes/socket.js")(io);


app.set("port", process.env.PORT || 3100);

server.listen(app.get("port"), function() {
    console.log("Server working working at port", app.get("port"));
});
