const Review = require("../models/review");
const User = require("../models/user");
const Product = require("../models/product");
const product = require("../models/product");

module.exports.addReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  let review = new Review(req.body.review);
  review.author = req.user._id;

  product.reviews.push(review);

  await review.save();
  await product.save();
  res.json({
    product: product,
  });
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let deletedReview = await Review.findByIdAndDelete(`${reviewId}`);
  let updatedProduct = await Product.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  res.json({
    reviewDeleted: deletedReview,
    updatedProduct: updatedProduct,
  });
};
