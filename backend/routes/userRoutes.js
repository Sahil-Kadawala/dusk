const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin, checkId } = require("../middleware");

router.post("/signup", wrapAsync(userController.signup));
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login)
);
router.post("/logout", wrapAsync(userController.logout));

router.get("/", isLoggedIn, isAdmin, wrapAsync(userController.allUsers));

router
  .route("/profile")
  .get(isLoggedIn, wrapAsync(userController.currentUserProfile))
  .put(isLoggedIn, wrapAsync(userController.updateCurrentUserProfile));

// Admin Routes
router
  .route("/:id")
  .delete(isLoggedIn, isAdmin, wrapAsync(userController.deleteUser))
  .get(isLoggedIn, isAdmin, wrapAsync(userController.getUserById))
  .put(isLoggedIn, isAdmin, wrapAsync(userController.updateUserById));

module.exports = router;
