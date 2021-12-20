var express = require("express");
var path = require("path");
var favicon = require("static-favicon");
var morgan = require("./lib/morgan");
var logger = require("./lib/logger");
var cookieParser = require("cookie-parser");
var session = require("express-session");
require("dotenv").config();
var port = process.env.PORT || 3000;

var mongoose = require("mongoose");
//clear console
console.clear();

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(logger.custom("Connected!", "green", "MongoDB", false));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(favicon());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuring Passport
var passport = require("passport");
// TODO - Why Do we need this key ?
app.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: "shhhh, very secret",
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require("connect-flash");
app.use(flash());

// Initialize Passport
var initPassport = require("./passport/init");
initPassport(passport);

var routes = require("./routes/index")(passport);
app.use("/", routes);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

//Express version
const fs = require("fs");
const pjs = fs.readFileSync(path.join(__dirname, "package.json"));
const parse = JSON.parse(pjs);
const express_version = parse.dependencies.express.split("^").pop();

app.listen(port);
logger.custom(`Listening on port ${port}`, "bold", "Express", false);
logger.custom("v" + express_version, "bold", "Express");
