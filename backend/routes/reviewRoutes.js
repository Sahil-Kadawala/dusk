const Review = require("../models/review");
const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, checkReviewId, isReviewAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviewController");

router.route("/").post(isLoggedIn, wrapAsync(reviewController.addReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  checkReviewId,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
