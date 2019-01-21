// server.js
const helmet = require('helmet')
const comment = require('./routes/comment')

// BASE SETUP
require("dotenv").config();
const keys = require("./config/keys");

// call the packages we need
var sslRedirect = require("heroku-ssl-redirect");
var express = require("express");
var app = express();

// Mandatory Middleware for secure HTTP headers
app.use(helmet())

// if heroku, force SSL
if (process.env.NODE_ENV === "production") {
    app.use(sslRedirect());
}

// Database
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.connect(
    keys.mongoURI,
    { useNewUrlParser: true }
);

// For logins:
var passport = require("passport");
var cookieParser = require("cookie-parser");
var session = require("cookie-session");

app.use(cookieParser()); // read cookies (needed for auth)
app.use(
    session({
        secret: keys.session,
        resave: true,
        saveUninitialized: true
    })
); // session secret

require("./config/passport")(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// bodyParser tillader JSON-posts
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// multer tillader filuploads (billeder til spørgsmål)
const multer = require("multer");
const cloudinary = require("cloudinary");

var port = process.env.PORT || 3001; // set our port

// ROUTES
var router = express.Router();

// log requests to DB
const saveReq = require("./middleware/saveReq");

app.use(saveReq);

// more routes for our API will happen here
require("./routes/question")(app);
require("./routes/feedback")(app);
app.use("./routes/comment", comment);
require("./routes/user")(app);

// Registrer alle routes fra denne fil (prefixed '/api')
//app.use('/api', router);

if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "au_server"
) {
    // Express will serve prod. assets
    // (js, css files)
    app.use(express.static("client/build"));
}

// Express will serve up index.html if
// unknown route
// Catchall case, only happens if all above
// failed
const path = require("path");
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// START SERVEREN
app.listen(port);
console.log("Magic happens on port " + port);
