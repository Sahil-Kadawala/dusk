const passport = require("passport");
const User = require("../models/user");
const { isAdmin } = require("../middleware");

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password, firstName, lastName } = req.body;
    const newUser = new User({ email, firstName, lastName, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (error) => {
      if (error) {
        return next(error);
      }
      // res.redirect("/products");
      res.send("sigup Successful!")
    });
  } catch (error) {
    // res.redirect("/signup");
    res.send(error);
  }
};

module.exports.login = (req, res) => {
  // res.redirect("/products");
  if(req.user.isAdmin && req.user){
    console.log("you are admin");
    res.send("admin page");
  } else {
    // redirect to product page
    res.send("login successful not admin and product page");
  }
};

module.exports.logout = (req, res) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    // Clear the session cookie
    res.clearCookie('connect.sid', { path: '/' });
    res.json({ message: "User logged out" });
  });
}

module.exports.allUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
}

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

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;

    if (req.body.password) {
      await user.setPassword(req.body.password);
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

module.exports.getUserById = async (req,res)=>{
  const user = await User.findById(req.params.id).select("-hash -salt");
  if(user) {
    res.json(user);
  } else {
    throw new Error("user not found");
  }
}

module.exports.updateUserById = async(req, res) =>{
  const user = await User.findById(req.params.id);

  if(user) {
    user.username =  user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.isAdmin = Boolean(req.body.isAdmin);

    const  updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.username,
    });

  } else {
    throw new Error("user not found")
  }
}