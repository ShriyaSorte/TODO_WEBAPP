const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

async function registerUser(req, res) {
  const { firstName, lastName, username, email, password, confirmPassword } =
    req.body;
  try {
    const existUser = await User.findOne({ email });
    if (!existUser) {
      const user = new User({
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
      });
      await user.save();
      return res.status(201).send({ message: "User registered successfully" });
    } else {
      return res.status(400).send({ message: "User already exists" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send({ error: "Invalid login credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Returning the token as accessToken
    res
      .status(200)
      .send({ accessToken: token, message: "LoggedIn successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getUserInfo(req, res) {
  const id = req.user.id; // `req.user` should be populated by the auth middleware
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }
    res.status(200).send({ user, success: true });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
}

// Add this function to your user controller
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, 'email'); // Adjust fields as necessary
    res.status(200).send({ users, success: true });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
}


module.exports = { registerUser, loginUser, getUserInfo, getAllUsers };
