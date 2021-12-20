var login = require("./login");
var signup = require("./signup");
var User = require("../models/user");
var logger = require("../lib/logger");

module.exports = function (passport) {
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function (user, done) {
    logger.custom("Serializing user: ", "white", "Passport");
    console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      logger.custom("Deserializing user: ", "white", "Passport");
      console.log(user);
      done(err, user);
    });
  });

  // Setting up Passport Strategies for Login and SignUp/Registration
  login(passport);
  signup(passport);
};
