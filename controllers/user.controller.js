const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const secret_key = process.env.JWT_SERCRET;

const register = async (req, res) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log(req.body)

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      admin: req.body.admin,
    });

    await newUser.save();
    res.status(201).json({ status: "Resgistration successful!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) return res.status(401).json({ message: "User Not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorret password" });

    const token = jwt.sign({ _id: user._id, admin: user.admin }, secret_key, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      token: token,
      isAdmin: user.admin,
      status: "You are successfully logged in!",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req, res) =>{
  try {
    const userData = await User.find()
    return res.status(200).json(userData)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

module.exports = { register, login, getAllUser };
