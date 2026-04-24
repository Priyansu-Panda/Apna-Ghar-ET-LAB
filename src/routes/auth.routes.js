const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")
const { registerValidator, loginValidator } = require("../middleware/validator.middleware");

// router.post("/register", registerValidator, authController.registerUser);
// router.post("/login", loginValidator, authController.loginUser);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);

module.exports = router;