if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user.js");

const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

main()
  .then((res) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/dusk");
  } catch (err) {
    console.log("error in main() function");
    throw err;
  }
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// for deployment
// const store = MongoStore.create({
//   mongoUrl: process.env.ATLASDB_URL,
//   crypto: {
//     secret: process.env.SECRET,
//   },
//   touchAfter: 24 * 3600,
// });

const sessionOptions = {
  // store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const userByEmail = await User.findOne({ email: req.body.email });
        if (!userByEmail) {
          return done(null, false, { message: "Email not registered." });
        }

        User.authenticate()(username, password, (err, user) => {
          if (err) return done(err);
          if (!user)
            return done(null, false, {
              message: "Invalid username or password.",
            });

          if (user.email !== req.body.email) {
            return done(null, false, { message: "Email does not match." });
          }
          return done(null, user);
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/users", userRoutes);
app.use("/category", categoryRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/reviews", reviewRoutes);
app.use("/orders", orderRoutes);

app.all("*", (req, res, next) => {
  return next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  let { status = 500, message = "something went wrong!" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => console.log("server working"));
