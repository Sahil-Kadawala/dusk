const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You Must Be Logged In!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  } else {
    res.locals.redirectUrl = "/products";
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  const user = req.user;
  console.log("Checking admin status for user:", user);
  if (user && user.isAdmin) {
    return next();
  } else {
    console.log("User is not admin");
    res.status(403).send("You do not have permission to perform this action!");
  }
};

module.exports.checkId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid Object of: ${req.params.id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    // id variable can be used for redirect
    return res.json("not owner of this review");
  }
  next();
};

module.exports.checkReviewId = (req, res, next) => {
  const { id, reviewId } = req.params;

  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: `Invalid ObjectId: ${id}` });
  }

  if (reviewId && !mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(404).json({ error: `Invalid ObjectId: ${reviewId}` });
  }

  next();
};
