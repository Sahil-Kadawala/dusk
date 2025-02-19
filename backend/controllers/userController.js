const passport = require("passport");
const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password, firstName, lastName } = req.body.user;
    const newUser = new User({ email, firstName, lastName, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (error) => {
      if (error) {
        return next(error);
      }
      // res.redirect("/prod ucts");
      res.send("sigup Successful!");
    });
  } catch (error) {
    // res.redirect("/users/signup");
    res.send(error);
  }
};

module.exports.login = (req, res, next) => {
  return new Promise((resolve, reject) => {
    // res.redirect("/products");
    if (req.user.isAdmin && req.user) {
      console.log("you are admin");
      res.send("admin page");
    } else {
      // redirect to product page
      res.send("login successful not admin and product page");
    }
  }).catch(next);
};

module.exports.logout = (req, res, next) => {
  return new Promise((resolve, reject) => {
    req.logout((error) => {
      if (error) {
        return reject(error);
      }
      // Clear the session cookie
      res.clearCookie("connect.sid", { path: "/" });
      res.json({ message: "User logged out" });
      resolve();
    });
  }).catch(next);
};

module.exports.allUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

module.exports.currentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};

module.exports.updateCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.username = req.body.user.username || user.username;
    user.email = req.body.user.email || user.email;
    user.firstName = req.body.user.firstName || user.firstName;
    user.lastName = req.body.user.lastName || user.lastName;

    if (req.body.user.password) {
      await user.setPassword(req.body.user.password);
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

module.exports.deleteUser = async (req, res) => {
  console.log("Delete request for user ID:", req.params.id);
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      throw new Error("Cannot delete admin");
    } else {
      await User.deleteOne({ _id: user._id });
      res.json({ message: "User removed" });
    }
  } else {
    throw new Error("User not found");
  }
};

module.exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-hash -salt");
  if (user) {
    res.json(user);
  } else {
    throw new Error("user not found");
  }
};

module.exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.user.username || user.username;
      user.email = req.body.user.email || user.email;
      user.firstName = req.body.user.firstName || user.firstName;
      user.lastName = req.body.user.lastName || user.lastName;

      if (req.body.user.isAdmin === "true") {
        user.isAdmin = true;
      } else if (req.body.user.isAdmin === "false") {
        user.isAdmin = false;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};
