const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");

// Admin routes
router
  .route("/")
  .post(isLoggedIn, isAdmin, wrapAsync(categoryController.createCategory));

router
  .route("/:categoryId")
  .put(isLoggedIn, isAdmin, wrapAsync(categoryController.updateCategory))
  .delete(isLoggedIn, isAdmin, wrapAsync(categoryController.deleteCategory));

// generic
router.route("/categories").get(wrapAsync(categoryController.listCategories));

// get single category info
router.route("/:id").get(wrapAsync(categoryController.readCategory));
module.exports = router;
