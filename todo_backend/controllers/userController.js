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
   
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({ token: token, message: "LoggedIn successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { registerUser, loginUser };
