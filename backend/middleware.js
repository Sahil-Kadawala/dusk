const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");

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
