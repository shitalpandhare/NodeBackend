const express = require("express");
const userAuth = require("../middleware/user-auth");
const router = express.Router();

const userController = require("../controllers/user");

router.post("/signup", userAuth, userController.userSignup);
router.post("/login", userAuth, userController.userLogin);

module.exports = router;
