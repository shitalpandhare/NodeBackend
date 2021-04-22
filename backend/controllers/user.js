const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.userSignup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User(null, (email = req.body.email), (password = hash));

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "user created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;

  User.findByEmail(req.body.email)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Auth fail" });
      }
      fetchedUser = user[0][0];
      return bcrypt.compare(req.body.password, fetchedUser.password);
    })
    .then((result) => {
      //   console.log(process.env.SECRET_KEY);
      if (!result) {
        return res.status(401).json({ message: "Auth fail" });
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser.id },
        "secret_key",
        { expiresIn: "1h" }
      );

      res.status(200).json({ token: token, expiresIn: 3600 });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ message: "Auth fail" });
    });
};
