const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    //verify token from every incomming request
    const decodedToken = jwt.verify(token, "secret_key");

    //for verifying user for perticular posts ,add usrdta into evry req
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };

    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
