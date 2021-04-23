const express = require("express");
const router = express.Router();

const postsController = require("../controllers/posts");
const checkAuth = require("../middleware/check-auth");
const postsAuth = require("../middleware/post-auth");

router.post(
  "",
  checkAuth,
  postsAuth.createPostAuth,
  postsController.createPost
);
router.get("", postsController.getPosts);
router.get("/:id", checkAuth, postsController.getPost);
router.delete("/:id", checkAuth, postsController.deletePost);
router.put(
  "/:id",

  checkAuth,
  postsAuth.updatePostAuth,
  postsController.updatePost
);

module.exports = router;
