const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const middleware = require("../middleware");
const User = require("../models/user");
const user = require("../models/user");

router.post("/signup", wrapAsync(userController.signup));
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login)
);
router.post("/logout", wrapAsync(userController.logout));

router.get("/users",middleware.isLoggedIn, middleware.isAdmin, wrapAsync(userController.allUsers));

router.route("/users/profile")
    .get(middleware.isLoggedIn, wrapAsync(userController.currentUserProfile))
    .put(middleware.isLoggedIn, wrapAsync(userController.updateCurrentUserProfile))

// Admin Routes
router.route("/users/:id")
    .delete(middleware.isLoggedIn, middleware.isAdmin, wrapAsync(userController.deleteUser))
    .get(middleware.isLoggedIn, middleware.isAdmin, wrapAsync(userController.getUserById))
    .put(middleware.isLoggedIn, middleware.isAdmin, wrapAsync(userController.updateUserById))

module.exports = router;