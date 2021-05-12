const express = require("express");
const userAuth = require("../middleware/user-auth");
const router = express.Router();

const userController = require("../controllers/user");

router.post("/signup", userAuth, userController.userSignup);
router.post("/login", userAuth, userController.userLogin);
router.get("/:role", userController.getAllUsers);
router.get("/admin/:id", userController.getAdminById);
router.put("/admin/:id", userController.updateAdmin);
router.get("/admin/search/:searchText", userController.searchAdmins);
router.post("/admin/sort", userController.sortAdmins);
module.exports = router;
