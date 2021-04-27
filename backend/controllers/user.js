const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.userSignup = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    id = new Date().toISOString();
    const user = new User(id, (email = req.body.email), (password = hash));

    const result = await user.save();

    res.status(201).json({
      message: "user created!",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.userLogin = async (req, res, next) => {
  let fetchedUser;
  let result;

  try {
    const user = await User.findByEmail(req.body.email);
    if (!user[0].length) {
      return res.status(401).json({ message: "Auth fail !" });
    } else {
      fetchedUser = user[0][0];

      result = await bcrypt.compare(req.body.password, fetchedUser.password);
    }

    if (!result) {
      return res.status(401).json({ message: "Auth fail" });
    } else {
      //

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser.id },
        process.env.SECRET_KEY,
        { expiresIn: 30 }
      );

      const refreshToken = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser.id },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "7d" }
      );

      //store refresh token in database

      const reftoken = await User.saveRefreshToken(
        refreshToken,
        fetchedUser.id
      );

      if (reftoken[0].affectedRows == 0) {
        return res
          .status(403)
          .json({ message: "token is not stored in  database!" });
      }
      res.status(200).json([
        { token: token, expiresIn: "10s" },
        { refreshToken: refreshToken, expiresIn: "7d" },
      ]);
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Auth fail" });
  }
};

exports.refreshToken = (req, res, next) => {
  refToken = req.body.refreshToken;
};
