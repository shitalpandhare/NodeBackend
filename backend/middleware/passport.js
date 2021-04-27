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
    let expDate = new Date(payload.exp);

    if (expDate < new Date()) {
      console.log("token expired");
    }

    User.findByEmail(payload.email)
      .then((user) => {
        if (user) {
          console.log(user[0][0].email);
          hash = user[0][0].password;
          return done(null, user);
        } else {
          console.log("in catch");
          return done(null, false);
        }
      })
      .catch((err) => {
        console.log(payload.expireIn);
        return done(err, null);
      });
  })
);
module.exports = passport.authenticate("jwt", { session: false });
