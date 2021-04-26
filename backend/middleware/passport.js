const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const passport = require("passport");
require("dotenv").config();
const User = require("../models/user");

var opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  new JWTStrategy(opts, (payload, done) => {
    console.log("in passport");

    User.findByEmail(payload.email)
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        return done(err, null);
      });
  })
);
module.exports = passport.authenticate("jwt", { session: false });
