exports.createPostAuth = (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({
      message: "Please fill in all the required fields.",
      fields: ["title", "content"],
    });
  }
  next();
};

exports.updatePostAuth = (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({
      message: "Please fill in all the required fields.",
      fields: ["title", "content"],
    });
  }
  next();
};
