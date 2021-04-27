const express = require("express");
const router = express.Router();

const postsController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const postsAuth = require("../middleware/post-auth");
const passport = require("passport");
const passportAuth = require("../middleware/passport");

router.post(
  "",
  passportAuth,
  postsAuth.createPostAuth,
  postsController.createPost
);
router.get("", postsController.getPosts);
router.get("/:id", passportAuth, postsController.getPost);
router.delete("/:id", passportAuth, postsController.deletePost);
router.put(
  "/:id",
  passportAuth,
  postsAuth.updatePostAuth,
  postsController.updatePost
);

module.exports = router;
