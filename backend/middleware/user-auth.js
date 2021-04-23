module.exports = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Email is required!" });
  } else if (!req.body.password) {
    return res.status(400).json({ message: "Password is required!" });
  }
  next();
};
